import {sqliteTable} from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', t => ({
        email: t.text().notNull().unique(),
        passwordHash: t.text().notNull(),
        createdAt: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
        updatedAt: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
    }),
)

export const applications = sqliteTable('applications', t => (
    {
        id: t.integer().primaryKey({autoIncrement: true}),
        type: t.integer(),
        email: t.text(),
        title: t.text(),
        firstName: t.text(),
        middleName: t.text(),
        lastName: t.text(),
        dateOfBirth: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
        createdAt: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
        updatedAt: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
    }
))

export const applicationAddresses = sqliteTable('applicationAddresses', t => ({
        id: t.integer().primaryKey({autoIncrement: true}),
        applicantId: t.integer().references(() => applications.id),// person the application is for
        firstLine: t.text().notNull(),
        secondLine: t.text(),
        town: t.text().notNull(),
        county: t.text(),
        postCode: t.text().notNull(),
        country: t.text().notNull(),
        isCurrentAddress: t.integer({mode: 'boolean'}),
        fromDate: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
        createdAt: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).notNull(),
        updatedAt: t.integer({mode: 'timestamp_ms'}).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
    }),
)
