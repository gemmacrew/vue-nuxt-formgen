import {useSchema} from "#shared/composables/useSchema";
import {z} from "zod/v4";
const typeSchema = z.object({
	type: z.enum(['basic', 'standard', 'enhanced'])
})

export default defineEventHandler(async (event) => {

  const id = getRouterParam(event, 'id')
  const {application: applicationSchema} = useSchema()
  const {type: applicationType} = await readValidatedBody(event, typeSchema.parse)

  try {
    const application = await readValidatedBody(event, applicationSchema[applicationType].parse)
		const db = useDrizzle()
    //
    const {
      id: ignoreId,
      type,
      email,
      addressHistory,
      previousNameHistory,
			organisationAddress,
      createdDate,
      updatedDate,
      ...rest
    } = application
    //
    // //update
    const [updatedApplication] = await db.update(tables.applications).set({
      ...rest
    })
      .where(eq(tables.applications.id, Number(id)))
      .returning()

    return await $fetch(`/api/applications/${updatedApplication.id}`, {
      method: 'GET'
    })

  } catch (ex) {
    return {
      success: false,
      error: ex?.message
    }
  }

})
