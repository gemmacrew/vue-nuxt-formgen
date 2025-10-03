import {useSchema} from "#shared/composables/useSchema.ts";
import {z} from "zod/v4";

const typeSchema = z.object({
	type: z.enum(['basic', 'standard', 'enhanced'])
})

export default defineEventHandler(async (event) => {

		const {application: applicationSchema} = useSchema()
		const {type} = await readValidatedBody(event, typeSchema.parse)
		const db = useDrizzle()

		try {
			const application = await readValidatedBody(event, applicationSchema[type].parse)
			const {
				addressHistory = [],
				previousNameHistory = [],
				organisationAddress = [],
				createdDate,
				updatedDate,
				id,
				...rest
			} = application

			const [savedApplication] = await db.insert(tables.applications).values({
				...rest
			}).returning()

			if (addressHistory.length) {
				await db.insert(tables.applicationAddressHistory).values(addressHistory.map((address) => ({applicationId: savedApplication.id, ...address})))
			}
			if (organisationAddress.length) {
				await db.insert(tables.applicationAddressHistory).values(organisationAddress.map((address) => ({applicationId: savedApplication.id, ...address})))
			}
			if (previousNameHistory.length > 0) {
				await db.insert(tables.applicationNameHistory).values(previousNameHistory.map((nameHistory) => ({applicationId: savedApplication.id, ...nameHistory})))
			}

			return await $fetch(`/api/applications/${savedApplication.id}`, {
				method: 'GET'
			})

		} catch (ex) {
			return {
				success: false,
				error: ex?.message
			}
		}
	}
)
