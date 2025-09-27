import {z} from 'zod/v4'

const ApplicationDetailsSchema = z.object({
  id: z.number().nullish().optional(),
  type: z.enum(['basic', 'standard', 'enhanced']),
  email: z.email('invalidEmail').trim().min(1, 'isRequired'),
  paymentStatus: z.enum(['pending', 'paid', 'cancelled', 'failed', 'refunded', 'unpaid', 'unknown'], 'isRequired').nullish().optional(),
  checkoutSessionId: z.string().nullish().optional(),
  createdDate: z.coerce.date().nullish().optional(),
  updatedDate: z.coerce.date().nullish().optional()
})

const NameDetailsSchema = z.object({
  id: z.number().nullish().optional(),
  title: z.string('isRequired').trim().min(1, 'isRequired'),
  firstName: z.string('isRequired').trim().min(1, 'isRequired'),
  middleName: z.string().nullish().optional(),
  lastName: z.string('isRequired').trim().min(1, 'isRequired'),
  fromDate: z.coerce.date('isRequired').min(1, 'isRequired').max(new Date(), 'dateBeforeToday'),
  toDate: z.coerce.date('isRequired').min(1, 'isRequired').max(new Date(), 'dateBeforeToday'),
}).refine((data) => {
  if (new Date(data.fromDate) > new Date(data.toDate)) {
    return false
  }
  return true
}, {
  message: "toDateAfterFromDate",
  path: ["toDate"],
  when: () => true,
})

const AddressDetailsSchema = z.object({
  id: z.number().nullish().optional(),
  streetNumber: z.string('isRequired').trim().min(1, 'isRequired'),
  route: z.string('isRequired').trim().min(1, 'isRequired'),
  locality: z.string('isRequired').trim().min(1, 'isRequired'),
  postalTown: z.string('isRequired').trim().min(1, 'isRequired'),
  administrativeAreaLevel2: z.string('isRequired').trim().min(1, 'isRequired'),
  country: z.string('isRequired').trim().min(1, 'isRequired'),
  postalCode: z.string('isRequired').trim().min(1, 'isRequired'),
})

const DatedAddressDetailsSchema = AddressDetailsSchema.extend({
  fromDate: z.coerce.date('isRequired').min(1, 'isRequired').max(new Date(), 'dateBeforeToday')
})

const ApplicantDetailsSchema = z.object({
  title: z.string('isRequired').trim().min(1, 'isRequired'),
  firstName: z.string('isRequired').trim().min(1, 'isRequired'),
  lastName: z.string('isRequired').trim().min(1, 'isRequired'),
  hasMiddleName: z.boolean('selectOption'),
  middleName: z.string().nullish().optional(),
  hasNameHistory: z.boolean('selectOption'),
  previousNameHistory: z.array(NameDetailsSchema).nullable().optional()
}).refine((data) => {
  if (data.hasMiddleName === true && !data.middleName?.trim()) {
    return false
  }
  return true
}, {
  message: "isRequired",
  path: ["middleName"],
  when: () => true,
}).refine((data) => {
  if (data.hasNameHistory === true && !data.previousNameHistory?.length) {
    return false
  }
  return true
}, {
  message: "atLeastOne",
  path: ["previousNameHistory"],
  when: () => true,
})

const ConfirmationDetailsSchema = z.object({
  electronicResults: z.literal<boolean>(true, 'acknowledge'),
  declaration: z.literal<boolean>(true, 'acknowledge')
})

const BasicAdditionalInfoDetailsSchema = z.object({
  hasPassport: z.boolean('selectOption'),
  passportNumber: z.string().optional(),
  passportCountryOfIssue: z.string().nullish().optional(),
  hasDrivingLicence: z.boolean('selectOption'),
  drivingLicenceNumber: z.string().optional(),
  dbsProfileNumber: z.string().nullish().optional()
})

const AdditionalInfoDetailsSchema = BasicAdditionalInfoDetailsSchema.extend({})

const RefinedAdditionalInfoDetailsSchema = AdditionalInfoDetailsSchema.extend({}).refine((data) => data.hasPassport !== true || !!data.passportNumber?.trim(), {
  message: "isRequired",
  path: ["passportNumber"],
  when: () => true,
}).refine((data) => data.hasPassport !== true || !!data.passportCountryOfIssue?.trim(), {
  message: "isRequired",
  path: ["passportCountryOfIssue"],
  when: () => true,
}).refine((data) => data.hasDrivingLicence !== true || !!data.drivingLicenceNumber?.trim(), {
  message: "isRequired",
  path: ["drivingLicenceNumber"],
  when: () => true,
})


const RefinedBasicAdditionalInfoDetailsSchema = BasicAdditionalInfoDetailsSchema.refine((data) => data.hasPassport !== true || !!data.passportNumber?.trim(), {
  message: "isRequired",
  path: ["passportNumber"],
  when: () => true,
}).refine((data) => data.hasPassport !== true || !!data.passportCountryOfIssue?.trim(), {
  message: "isRequired",
  path: ["passportCountryOfIssue"],
  when: () => true,
}).refine((data) => data.hasDrivingLicence !== true || !!data.drivingLicenceNumber?.trim(), {
  message: "isRequired",
  path: ["drivingLicenceNumber"],
  when: () => true,
})

const BirthDetailsSchema = z.object({
  gender: z.enum(["male", "female", "other"], 'isRequired'),
  dob: z.coerce.date('isRequired').min(1, 'isRequired').max(new Date(), 'dateBeforeToday'),
  townOfBirth: z.string('isRequired').trim().min(1, 'isRequired'),
  countryOfBirth: z.string('isRequired').trim().min(1, 'isRequired'),
  nationalityAtBirth: z.string('isRequired').trim().min(1, 'isRequired'),
  currentNationality: z.string('isRequired').trim().min(1, 'isRequired'),
  mothersMaidenName: z.string('isRequired').trim().min(1, 'isRequired'),
})
const AddressHistorySchema = z.object({
  addressHistory: z.array(DatedAddressDetailsSchema, 'atLeastOne').min(1, 'atLeastOne'),
}).refine((data) => {

  if (!data.addressHistory?.length) {
    return false
  }

  const minFromDate = new Date()
  minFromDate.setFullYear(minFromDate.getFullYear() - 5);
  for (const address of data.addressHistory) {
    if (new Date(address.fromDate) < minFromDate) {
      return true
    }
  }
  return false
}, {
  message: "incompleteAddressHistory",
  path: ["addressHistory"],
  when: () => true,
})


const OrganisationDetailsSchema = z.object({
  organisationName: z.string('isRequired').trim().min(1, 'isRequired'),
  organisationAddress: z.array(AddressDetailsSchema, 'onlyOne').min(1, 'onlyOne').max(1, 'onlyOne'),
})

const PositionDetailsSchema = z.object({
  positionAppliedFor: z.string('isRequired').trim().min(1, 'isRequired'),
  jobDescription: z.string('isRequired').trim().min(1, 'isRequired'),
})

/**
 * all possible schemas for the application
 */
export const useSchema = () => {

  return {
    application: {
      basic: z.object({
        ...ApplicationDetailsSchema.shape,
        ...ApplicantDetailsSchema.shape,
        ...BirthDetailsSchema.shape,
        ...RefinedBasicAdditionalInfoDetailsSchema.shape,
        ...ConfirmationDetailsSchema.shape
      }),
      standard: z.object({
        ...ApplicationDetailsSchema.shape,
        ...PositionDetailsSchema.shape,
        ...OrganisationDetailsSchema.shape,
        ...ApplicantDetailsSchema.shape,
        ...BirthDetailsSchema.shape,
        ...RefinedAdditionalInfoDetailsSchema.shape,
        ...ConfirmationDetailsSchema.shape
      }),
      enhanced: z.object({
        ...ApplicationDetailsSchema.shape,
        ...PositionDetailsSchema.shape,
        ...OrganisationDetailsSchema.shape,
        ...ApplicantDetailsSchema.shape,
        ...BirthDetailsSchema.shape,
        ...RefinedAdditionalInfoDetailsSchema.shape,
        ...ConfirmationDetailsSchema.shape
      })
    },
    applicantDetails: ApplicantDetailsSchema,
    birthDetails: BirthDetailsSchema,
    datedAddressDetails: DatedAddressDetailsSchema,
    nameDetails: NameDetailsSchema,
    additionalInfoDetails: RefinedAdditionalInfoDetailsSchema,
    basicAdditionalInfoDetails: RefinedBasicAdditionalInfoDetailsSchema,
    additionalInfoDetails: RefinedAdditionalInfoDetailsSchema,
    confirmationDetails: ConfirmationDetailsSchema,
    addressHistory: AddressHistorySchema,
    positionDetails: PositionDetailsSchema
  }
}
