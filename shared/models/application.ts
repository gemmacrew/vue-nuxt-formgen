import {z} from 'zod/v4'

export const ApplicationSchema = z.object({
    title: z.string().nonempty('Required'),
    firstName: z.string().nonempty('Required'),
})

type Application = z.infer<typeof ApplicationSchema>
export type {Application}