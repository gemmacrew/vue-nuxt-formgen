import {z} from 'zod/v4'

export const useSchema = () => {

	const nameHistory = z.object({
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

	const addressHistory = z.object({
		streetNumber: z.string('isRequired').trim().min(1, 'isRequired'),
		route: z.string('isRequired').trim().min(1, 'isRequired'),
		locality: z.string('isRequired').trim().min(1, 'isRequired'),
		postalTown: z.string('isRequired').trim().min(1, 'isRequired'),
		administrativeAreaLevel2: z.string('isRequired').trim().min(1, 'isRequired'),
		country: z.string('isRequired').trim().min(1, 'isRequired'),
		postalCode: z.string('isRequired').trim().min(1, 'isRequired'),
		fromDate: z.coerce.date('isRequired').min(1, 'isRequired').max(new Date(), 'dateBeforeToday'),
	})

	const applicantDetails = z.object({
		email: z.email('invalidEmail').trim().min(1, 'isRequired'),
		title: z.string('isRequired').trim().min(1, 'isRequired'),
		firstName: z.string('isRequired').trim().min(1, 'isRequired'),
		lastName: z.string('isRequired').trim().min(1, 'isRequired'),
		hasMiddleName: z.string('isRequired'),
		middleName: z.string().nullish().optional(),
		hasNameHistory: z.string('isRequired'),
		previousNames: z.array(nameHistory).nullable().optional(),
	}).refine((data) => {
		if (data.hasMiddleName === 'true' && !data.middleName?.trim()) {
			return false
		}
		return true
	}, {
		message: "isRequired",
		path: ["middleName"],
		when: () => true,
	}).refine((data) => {
		if (data.hasNameHistory === 'true' && !data.previousNames?.length) {
			return false
		}
		return true
	}, {
		message: "atLeastOne",
		path: ["previousNames"],
		when: () => true,
	})

	const confirmationDetails = z.object({
		electronicResults: z.boolean('acknowledge').nonoptional('acknowledge'),
		declaration: z.boolean('acknowledge').nonoptional('acknowledge'),
	})

	const additionalInfoDetails = z.object({
		hasPassport: z.string('selectOption'),
		passportNumber: z.string().optional(),
		passportCountryOfIssue: z.string().nullish().optional(),
		hasDrivingLicence: z.string('selectOption'),
		drivingLicenceNumber: z.string().optional(),
		dbsProfileNumber: z.string().nullish().optional()
	}).refine((data) => data.hasPassport !== 'true' || !!data.passportNumber?.trim(), {
		message: "isRequired",
		path: ["passportNumber"],
		when: () => true,
	}).refine((data) => data.hasPassport !== 'true' || !!data.passportCountryOfIssue?.trim(), {
		message: "isRequired",
		path: ["passportCountryOfIssue"],
		when: () => true,
	}).refine((data) => data.hasDrivingLicence !== 'true' || !!data.drivingLicenceNumber?.trim(), {
		message: "isRequired",
		path: ["drivingLicenceNumber"],
		when: () => true,
	})

	const birthDetails = z.object({
		gender: z.enum(["male", "female", "other"], 'isRequired'),
		dob: z.coerce.date('isRequired').min(1, 'isRequired').max(new Date(), 'dateBeforeToday'),
		townOfBirth: z.string('isRequired').trim().min(1, 'isRequired'),
		countryOfBirth: z.string('isRequired').trim().min(1, 'isRequired'),
		nationalityAtBirth: z.string('isRequired').trim().min(1, 'isRequired'),
		currentNationality: z.string('isRequired').trim().min(1, 'isRequired'),
		mothersMaidenName: z.string('isRequired').trim().min(1, 'isRequired'),
	})
	const addressHistoryDetails = z.object({
		addressHistory: z.array(addressHistory, 'atLeastOne').min(1, 'atLeastOne'),
	}).refine((data) => {

		if (!data.addressHistory?.length) {
			return false
		}

		const minFromDate = new Date()
		minFromDate.setFullYear(minFromDate.getFullYear() - 5);
		for (const address of data.addressHistory) {
			if (new Date(address.fromDate) < minFromDate.getTime()) {
				return true
			}
		}
		return false
	}, {
		message: "incompleteAddressHistory",
		path: ["addressHistory"],
		when: () => true,
	})


	const validationSchema = z.object({
		applicantDetails,
		birthDetails,
		addressHistoryDetails
	})

	return {
		validationSchema,
		applicantDetails,
		birthDetails,
		addressHistoryDetails,
		nameHistory,
		addressHistory,
		additionalInfoDetails,
		confirmationDetails
	}
}