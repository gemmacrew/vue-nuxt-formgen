import {useServerStripe} from "#stripe/server";
import {z} from "zod/v4";

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const body = await readValidatedBody(event, z.object({}).parse)

  const prices = await stripe.prices.list()

  const customer = await stripe.customers.create({email: 'gemma.crew@outlook.com'})
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/foo?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/foo?cancelled',
    customer: customer.id
  });

  return {
    url: session.url
  }
});