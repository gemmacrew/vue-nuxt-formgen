import {useServerStripe} from "#stripe/server";

export default defineEventHandler(async (event) => {
    const stripe = await useServerStripe(event);
    const id = getRouterParam(event, 'id')

    const session = await stripe.checkout.sessions.retrieve(id)

    return {
      success: true,
      data: session
    }

  }
)