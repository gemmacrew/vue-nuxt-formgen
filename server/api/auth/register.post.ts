import {z} from 'zod/v4'

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, registerSchema.parse)
  const hashedPassword = await hashPassword(body.password)
  const db = useDrizzle()
  const [user] = await db.insert(tables.users).values({
    email: body.email,
    passwordHash: hashedPassword,
  }).returning()

  await setUserSession(event, {
    user: {
      email: user.email,
    },
    lastLogin: new Date(),
  })

  return {success: true}
})
