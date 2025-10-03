import {useServerStripe} from "#stripe/server";
import {useSchema} from "#shared/composables/useSchema.ts";
import {z} from "zod/v4";

const typeSchema = z.object({
	type: z.enum(['basic', 'standard', 'enhanced'])
})

export default defineEventHandler(async (event) => {
		const {application: applicationSchema} = useSchema()
		const stripe = await useServerStripe(event);
		const {type} = await readValidatedBody(event, typeSchema.parse)
		const db = useDrizzle()

	const log = []
		let application = null

		try {
			application = await readValidatedBody(event, applicationSchema[type].parse)
			log.push('AAA')
			log.push(application)

			let user = await db.query.users.findFirst({
				where: eq(tables.users.email, application.email),
			})

			if (!user) {
				([user] = await db.insert(tables.users).values({
					email: application.email,
				}).returning())
				log.push('BBB')
				log.push(user)
			}

			let stripeCustomerId = user.stripeCustomerId
			if (!stripeCustomerId) {
				// get stripe customer
				const customerList = await stripe.customers.list({
					email: application.email
				})

				let customer = customerList?.data?.[0]
				if (!customer) {
					customer = await stripe.customers.create({email: application.email})
				}

				stripeCustomerId = customer.id
				await db.update(tables.users).set({
					stripeCustomerId: customer.id,
				}).where(eq(tables.users.email, user.email))
			}

			const prices = await stripe.prices.list({
				lookup_keys: [application.type]
			})

			if (prices.data.length === 0) {
				throw createError({
					statusCode: 400,
					statusMessage: 'Bad request.  Price not found',
				})
			}

			let response
			application.paymentStatus = 'pending'

			if (application.id) {
				response = await $fetch(`/api/applications/${application.id}`, {
					method: 'PUT',
					body: application
				})

				log.push('CCC')
				log.push(response)

			} else {
				response = await $fetch(`/api/applications`, {
					method: 'POST',
					body: application
				})
				log.push('DDD')
				log.push(response)
			}

			const {id: applicationId} = response.data
			const session = await stripe.checkout.sessions.create({
				billing_address_collection: 'auto',
				line_items: [
					{
						price: prices.data[0].id,
						quantity: 1
					},
				],
				mode: 'payment',
				success_url: `https://dbs-online-gemmacrew.nuxt.dev/payment/success?session_id={CHECKOUT_SESSION_ID}&application_id=${applicationId}`,
				cancel_url: `https://dbs-online-gemmacrew.nuxt.dev/payment/cancelled?session_id={CHECKOUT_SESSION_ID}&application_id=${applicationId}`,
				customer: stripeCustomerId
			});

			/**
			 * at this point we should commit the application to the database as we've created a payment intent
			 */

			return {
				success: true,
				url: session.url
			}

		} catch (ex) {
			return {
				success: false,
				error: `${ex?.message}: ${JSON.stringify(log)}`
			}
		}
	}
)