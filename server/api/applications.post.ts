import {ApplicationSchema} from "#shared/models/application";

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, ApplicationSchema.parse)
    const {title, firstName} = body

    const application: typeof tables.applications.$inferInsert = {
        title,
        firstName,
    }

    const [insertedApplication] = await db.insert(tables.applications).values(application).returning()

    return {success: true}
})
