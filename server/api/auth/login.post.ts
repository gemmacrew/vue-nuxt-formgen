import {z} from 'zod/v4'

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {

  const body = await readValidatedBody(event, loginSchema.parse)
  const user = await db.query.users.findFirst({
    where: eq(tables.users.email, body.email),
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const result = await verifyPassword(user.passwordHash, body.password)

  if (!result) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  await setUserSession(event, {
    user,
    lastLogin: new Date(),
  })

  return {success: true}
})
