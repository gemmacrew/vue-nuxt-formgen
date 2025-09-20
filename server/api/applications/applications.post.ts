
// import * as yup from "yup";

// const applicantDetails = yup.object({
//   title: yup.string().defined('isRequired').nonNullable('isRequired').min(1, 'isRequired'),
//   firstName: yup.string().required('isRequired'),
//   hasMiddleName: yup.boolean().required('isRequired'),
//   middleName: yup.string().when('hasMiddleName', ([hasMiddleName]) => {
//     if (hasMiddleName === true) {
//       return yup.string().required('isRequired')
//     }
//     return yup.string().notRequired()
//   }),
//   lastName: yup.string().required('isRequired'),
//   hasNameHistory: yup.boolean().required('isRequired')
// })
//
export default defineEventHandler(async (event) => {
//   const body = await readValidatedBody(event, applicantDetails.parse)
//   const user = await db.query.users.findFirst({
//     where: eq(tables.users.email, body.email),
//   })
//
//   const application: typeof tables.applications.$inferInsert = {
//     title,
//     firstName,
//   }
//
//   const [insertedApplication] = await db.insert(tables.applications).values(application).returning()

  return {success: true}
})
