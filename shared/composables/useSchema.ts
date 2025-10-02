import {z} from 'zod/v4'

const conditionalStringExistsRefiner = (checkPath, path) => {
  return {
    fn: (data) => data[checkPath] !== true || !!data[path]?.trim(),
    params: {
      message: "isRequired",
      path: [path],
      when: () => true,
    }
  }
}
const conditionalArrayExistsRefiner = (checkPath, path) => {
  return {
    fn: (data) => {
      //if the condition is not met then don't validate the date
      return data[checkPath] !== true || data[path]?.length
    },
    params: {
      message: "isRequired",
      path: [path],
      when: () => true,
    }
  }
}
const conditionalDateValidRefiner = (checkPath, path) => {
  return {
    fn: (data) => {
      //if the condition is not met then don't validate the date
      return data[checkPath] !== true || (!isNaN(new Date(data[path]).getTime()) && data[path].getTime() !== 0)
    },
    params: {
      message: "isRequired",
      path: [path],
      when: () => true,
    }
  }
}
const arrayExistsRefiner = (path) => {
  return {
    fn: (data) => {
      //if the condition is not met then don't validate the date
      return data[path]?.length
    },
    params: {
      message: "isRequired",
      path: [path],
      when: () => true,
    }
  }
}
const dateValidRefiner = (path: string): [fn: (data: z.infer<z.ZodObject>) => boolean, params: {
  message: string,
  path: string[],
  when?: () => true
}] => {
  return [
    (data: z.infer<typeof z.ZodObject>) => {
      return !isNaN(new Date(data[path]).getTime()) && data[path].getTime() !== 0
    }, {
      message: "isRequired",
      path: [path],
      when: () => true,
    }
  ]
}
const dateBeforeDateRefiner = (path1, path2) => {
  return {
    fn: (data) => {
      return (new Date(data[path1]) < new Date(data[path2]))
    },
    params: {
      message: "dateBeforeDate",
      path: [path1],
      when: () => true,
    }
  }
}

const ApplicationDetailsSchema = z.object({
  id: z.number().nullish().optional(),
  type: z.enum(['basic', 'standard', 'enhanced']),
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
  fromDate: z.coerce.date('isRequired').max(new Date(), 'dateBeforeToday'),
  toDate: z.coerce.date('isRequired').max(new Date(), 'dateBeforeToday'),
})
  .refine(...Object.values(dateValidRefiner('fromDate')))
  .refine(...Object.values(dateValidRefiner('toDate')))
  .refine(...Object.values(dateBeforeDateRefiner('fromDate', 'toDate')))

const AddressDetailsSchema = z.object({
  id: z.number().nullish().optional(),
  type: z.enum(['applicant', 'organisation']),
  streetNumber: z.string('isRequired').trim().min(1, 'isRequired'),
  route: z.string('isRequired').trim().min(1, 'isRequired'),
  locality: z.string('isRequired').trim().min(1, 'isRequired'),
  postalTown: z.string('isRequired').trim().min(1, 'isRequired'),
  administrativeAreaLevel2: z.string('isRequired').trim().min(1, 'isRequired'),
  country: z.string('isRequired').trim().min(1, 'isRequired'),
  postalCode: z.string('isRequired').trim().min(1, 'isRequired'),
})

const DatedAddressDetailsSchema = AddressDetailsSchema.extend({
  fromDate: z.coerce.date('isRequired').max(new Date(), 'dateBeforeToday')
})
  .refine(...Object.values(dateValidRefiner('fromDate')))

const ApplicantDetailsSchema = z.object({
  email: z.email('invalidEmail').trim().min(1, 'isRequired'),
  title: z.string('isRequired').trim().min(1, 'isRequired'),
  firstName: z.string('isRequired').trim().min(1, 'isRequired'),
  lastName: z.string('isRequired').trim().min(1, 'isRequired'),
  hasMiddleName: z.boolean('selectOption'),
  middleName: z.string().nullish().optional(),
  hasNameHistory: z.boolean('selectOption'),
  previousNameHistory: z.array(NameDetailsSchema).nullable().optional()
})
  .refine(...Object.values(conditionalStringExistsRefiner('hasMiddleName', 'middleName')))
  .refine(...Object.values(conditionalArrayExistsRefiner('hasNameHistory', 'previousNameHistory')))

const ConfirmationDetailsSchema = z.object({
  electronicResults: z.literal(true, 'acknowledge'),
  declaration: z.literal(true, 'acknowledge')
})

const BasicAdditionalInfoDetailsSchema = z.object({
  hasPassport: z.boolean('selectOption'),
  passportNumber: z.string().nullish().optional(),
  passportCountryOfIssue: z.string().nullish().optional(),
  hasDrivingLicence: z.boolean('selectOption'),
  drivingLicenceNumber: z.string().nullish().optional(),
  dbsProfileNumber: z.string().nullish().optional()
})

const AdditionalInfoDetailsSchema = BasicAdditionalInfoDetailsSchema.extend({
  passportNationality: z.string().nullish().optional(),
  passportIssueDate: z.coerce.date().optional(),
  passportDob: z.coerce.date().optional(),
  drivingLicenceDob: z.coerce.date().optional(),
  drivingLicenceValidFromDate: z.coerce.date().optional(),
  drivingLicenceCountryOfIssue: z.string().nullish().optional(),
  drivingLicenceType: z.string().optional()
})

const RefinedAdditionalInfoDetailsSchema = AdditionalInfoDetailsSchema.extend({})
  .refine(...Object.values(conditionalStringExistsRefiner('hasPassport', 'passportNumber')))
  .refine(...Object.values(conditionalStringExistsRefiner('hasPassport', 'passportCountryOfIssue')))
  .refine(...Object.values(conditionalStringExistsRefiner('hasPassport', 'passportNationality')))
  .refine(...Object.values(conditionalDateValidRefiner('hasPassport', 'passportIssueDate')))
  .refine(...Object.values(conditionalDateValidRefiner('hasPassport', 'passportDob')))

  .refine(...Object.values(conditionalDateValidRefiner('hasDrivingLicence', 'drivingLicenceDob')))
  .refine(...Object.values(conditionalDateValidRefiner('hasDrivingLicence', 'drivingLicenceValidFromDate')))
  .refine(...Object.values(conditionalStringExistsRefiner('hasDrivingLicence', 'drivingLicenceNumber')))
  .refine(...Object.values(conditionalStringExistsRefiner('hasDrivingLicence', 'drivingLicenceCountryOfIssue')))
  .refine(...Object.values(conditionalStringExistsRefiner('hasDrivingLicence', 'drivingLicenceType')))


const RefinedBasicAdditionalInfoDetailsSchema = BasicAdditionalInfoDetailsSchema
  .refine(...Object.values(conditionalStringExistsRefiner('hasPassport', 'passportNumber')))
  .refine(...Object.values(conditionalStringExistsRefiner('hasPassport', 'passportCountryOfIssue')))
  .refine(...Object.values(conditionalStringExistsRefiner('hasDrivingLicence', 'drivingLicenceNumber')))

const BirthDetailsSchema = z.object({
  gender: z.enum(["male", "female", "other"], 'isRequired'),
  dob: z.coerce.date('isRequired').max(new Date(), 'dateBeforeToday'),
  townOfBirth: z.string('isRequired').trim().min(1, 'isRequired'),
  countryOfBirth: z.string('isRequired').trim().min(1, 'isRequired'),
  nationalityAtBirth: z.string('isRequired').trim().min(1, 'isRequired'),
  currentNationality: z.string('isRequired').trim().min(1, 'isRequired'),
  mothersMaidenName: z.string('isRequired').trim().min(1, 'isRequired'),
})
  .refine(...Object.values(dateValidRefiner('dob')))

const AddressHistorySchema = z.object({
  addressHistory: z.array(DatedAddressDetailsSchema, 'atLeastOne').min(1, 'atLeastOne'),
})
  .refine(...Object.values(arrayExistsRefiner('addressHistory')))
  .refine((data) => {
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
  contractualAgreement: z.literal(true, 'acknowledge'),
  eligibilityGuidelines: z.literal(true, 'acknowledge'),
  dbsGuidelines: z.literal(true, 'acknowledge'),
  dbsCodeOfConduct: z.literal(true, 'acknowledge'),
  dbsIdentityCheckingGuidelines: z.literal(true, 'acknowledge'),
})

const BasicApplicationSchema = z.object({
  ...ApplicationDetailsSchema.shape,
  ...ApplicantDetailsSchema.shape,
  ...BirthDetailsSchema.shape,
  ...AddressHistorySchema.shape,
  ...RefinedBasicAdditionalInfoDetailsSchema.shape,
  ...ConfirmationDetailsSchema.shape
})

const StandardApplicationSchema = z.object({
  ...ApplicationDetailsSchema.shape,
  ...PositionDetailsSchema.shape,
  ...OrganisationDetailsSchema.shape,
  ...ApplicantDetailsSchema.shape,
  ...BirthDetailsSchema.shape,
  ...AddressHistorySchema.shape,
  ...RefinedAdditionalInfoDetailsSchema.shape,
  ...ConfirmationDetailsSchema.shape
})

const EnhancedApplicationSchema = z.object({
  ...ApplicationDetailsSchema.shape,
  ...PositionDetailsSchema.shape,
  ...OrganisationDetailsSchema.shape,
  ...ApplicantDetailsSchema.shape,
  ...BirthDetailsSchema.shape,
  ...AddressHistorySchema.shape,
  ...RefinedAdditionalInfoDetailsSchema.shape,
  ...ConfirmationDetailsSchema.shape
})


/**
 * all possible schemas for the application
 */
export const useSchema = () => {

  return {
    application: {
      basic: BasicApplicationSchema,
      standard: StandardApplicationSchema,
      enhanced: EnhancedApplicationSchema
    },
    applicantDetails: ApplicantDetailsSchema,
    birthDetails: BirthDetailsSchema,
    datedAddressDetails: DatedAddressDetailsSchema,
    addressDetails: AddressDetailsSchema,
    nameDetails: NameDetailsSchema,
    additionalInfoDetails: RefinedAdditionalInfoDetailsSchema,
    basicAdditionalInfoDetails: RefinedBasicAdditionalInfoDetailsSchema,
    confirmationDetails: ConfirmationDetailsSchema,
    addressHistory: AddressHistorySchema,
    positionDetails: PositionDetailsSchema,
    organisationDetails: OrganisationDetailsSchema,
  }
}
