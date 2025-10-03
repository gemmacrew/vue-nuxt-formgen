import {z} from 'zod/v4'

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export default defineEventHandler(async (event) => {

  let hashedPassword = ''
  let body = null
  try {
    console.log('AAAA')
    body = await readValidatedBody(event, registerSchema.parse)
    console.log('BBBB')
    hashedPassword = await hashPassword(body.password)
    console.log('CCCC')
    const db = useDrizzle()
    console.log('DDDD')
    const [user] = await db.insert(tables.users).values({
      email: body.email,
      passwordHash: hashedPassword,
    }).returning()
    console.log('EEEE')
    await setUserSession(event, {
      user: {
        email: user.email,
      },
      lastLogin: new Date(),
    })

    console.log('FFFF')
    return {success: true}
  } catch (ex) {
    console.log('XXXX: ', ex)
    return {
      success: false,
      error: `${ex?.message}: ${hashedPassword}, ${body}`
    }
  }

})
