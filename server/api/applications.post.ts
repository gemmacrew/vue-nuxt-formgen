import {useSchema} from "#shared/composables/useSchema";

export default defineEventHandler(async (event) => {

  const {application: applicationSchema} = useSchema()
  const application = await readValidatedBody(event, applicationSchema.parse)
  const {addressHistory = [], previousNameHistory = [], createdDate, updatedDate, id, ...rest} = application

  const [savedApplication] = await db.insert(tables.applications).values({
    ...rest
  }).returning()

  await db.insert(tables.applicationAddressHistory).values(addressHistory.map((addressHistory) => ({applicationId: savedApplication.id, ...addressHistory})))
  if (previousNameHistory.length > 0) {
    await db.insert(tables.applicationNameHistory).values(previousNameHistory.map((nameHistory) => ({applicationId: savedApplication.id, ...nameHistory})))
  }

  return await $fetch(`/api/applications/${savedApplication.id}`, {
    method: 'GET'
  })

})
