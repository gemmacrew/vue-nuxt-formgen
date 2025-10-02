import {sqliteTable} from 'drizzle-orm/sqlite-core'
import {z} from "zod/v4/index";

export const users = sqliteTable('users', t => ({
    email: t.text().primaryKey(),
    passwordHash: t.text(),
    otp: t.text(),
    stripeCustomerId: t.text().unique(),
    createdDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
    updatedDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
  }),
)

export const applications = sqliteTable('applications', t => (
  {
    //applicant details
    id: t.integer().primaryKey({autoIncrement: true}),
    type: t.integer(),
    email: t.text(),
    title: t.text(),
    firstName: t.text(),
    hasMiddleName: t.integer({mode: 'boolean'}),
    middleName: t.text(),
    lastName: t.text(),
    hasNameHistory: t.integer({mode: 'boolean'}),

    //birth details
    gender: t.text(),
    dob: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
    townOfBirth: t.text(),
    countryOfBirth: t.text(),
    nationalityAtBirth: t.text(),
    currentNationality: t.text(),
    mothersMaidenName: t.text(),

    //additional info
    hasPassport: t.integer({mode: 'boolean'}),
    passportNumber: t.text(),
    passportCountryOfIssue: t.text(),
    passportNationality: t.text(),
    passportIssueDate: t.integer({mode: 'timestamp_ms'}),
    passportDob: t.integer({mode: 'timestamp_ms'}),
    // ----
    hasDrivingLicence: t.integer({mode: 'boolean'}),
    drivingLicenceNumber: t.text(),
    drivingLicenceDob: t.integer({mode: 'timestamp_ms'}),
    drivingLicenceValidFromDate: t.integer({mode: 'timestamp_ms'}),
    drivingLicenceCountryOfIssue: t.text(),
    drivingLicenceType: t.text(),
    // ----
    dbsProfileNumber: t.text(),

    //organisation details
    positionAppliedFor: t.text(),
    jobDescription: t.text(),
    organisationName: t.text(),
    contractualAgreement: t.integer({mode: 'boolean'}),
    eligibilityGuidelines: t.integer({mode: 'boolean'}),
    dbsGuidelines: t.integer({mode: 'boolean'}),
    dbsCodeOfConduct: t.integer({mode: 'boolean'}),
    dbsIdentityCheckingGuidelines: t.integer({mode: 'boolean'}),

    //confirmation details
    electronicResults: t.integer({mode: 'boolean'}),
    declaration: t.integer({mode: 'boolean'}),

    paymentStatus: t.text({enum: ['pending', 'paid', 'cancelled', 'failed', 'refunded', 'unpaid', 'unknown']}),
    checkoutSessionId: t.text(),

    createdDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
    updatedDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
  }
))


export const applicationNameHistory = sqliteTable('applicationNameHistory', t => ({
    id: t.integer().primaryKey({autoIncrement: true}),
    applicationId: t.integer().references(() => applications.id),// person the application is for
    title: t.text(),
    firstName: t.text(),
    middleName: t.text(),
    lastName: t.text(),
    fromDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
    toDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
    createdDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
    updatedDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
  }),
)

export const applicationAddressHistory = sqliteTable('applicationAddressHistory', t => ({
    id: t.integer().primaryKey({autoIncrement: true}),
    type: t.text({enum: ['applicant', 'organisation']}),
    applicationId: t.integer().references(() => applications.id),
    streetNumber: t.text().notNull(),
    route: t.text(),
    locality: t.text().notNull(),
    postalTown: t.text(),
    administrativeAreaLevel2: t.text(),
    country: t.text().notNull(),
    postalCode: t.text().notNull(),
    fromDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
    createdDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
    updatedDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
  }),
)
