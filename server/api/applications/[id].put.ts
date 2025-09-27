import {useSchema} from "#shared/composables/useSchema";

export default defineEventHandler(async (event) => {

  const id = getRouterParam(event, 'id')
  const {application: applicationSchema} = useSchema()

  const application = await readValidatedBody(event, applicationSchema.parse)
  //
  const {
    id: ignoreId,
    type,
    email,
    addressHistory,
    previousNameHistory,
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

})
