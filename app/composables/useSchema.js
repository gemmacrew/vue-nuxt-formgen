import * as yup from "yup";


export const useSchema = () => {

	const applicantDetails = yup.object({
		title: yup.string().defined('isRequired').nonNullable('isRequired').min(1, 'isRequired'),
		firstName: yup.string().required('isRequired'),
		lastName: yup.string().required('isRequired'),
		hasNameHistory: yup.boolean().required('isRequired'),
		nameHistory: yup.array().when('hasNameHistory', ([hasNameHistory]) => {
			if (hasNameHistory === true) {
				return yup.array().defined('atLeastOne').nonNullable('atLeastOne').min(1, 'atLeastOne')
			}
		})
	})

	const additionalInfoDetails = yup.object({
		hasPassport: yup.boolean().notRequired(),
		passportNumber: yup.string().when('hasPassport', ([hasPassport]) => {
			if (hasPassport === true) {
				return yup.string().required('isRequired')
			}
		}),
		passportCountryOfIssue: yup.string().when('hasPassport', ([hasPassport]) => {
			if (hasPassport === true) {
				return yup.string().required('isRequired')
			}
		}),
		hasDrivingLicence: yup.boolean().notRequired(),
		drivingLicenceNumber: yup.string().when('hasDrivingLicence', ([hasDrivingLicence]) => {
			if (hasDrivingLicence === true) {
				return yup.string().required('isRequired')
			}
		})
	})

	const birthDetails = yup.object({
		gender: yup.string().required('isRequired'),
		dob: yup.string().required('isRequired'),
		townOfBirth: yup.string().required('isRequired'),
		countryOfBirth: yup.string().required('isRequired'),
		nationalityAtBirth: yup.string().required('isRequired'),
		currentNationality: yup.string().required('isRequired'),
		motherMaidenName: yup.string().required('isRequired')
	})

	const addressHistoryDetails = yup.object({
		addressHistoryList: yup.array().defined('atLeastOne').nonNullable('atLeastOne').min(1, 'atLeastOne')
	})

	const nameHistory = yup.object({
		title: yup.string().required('isRequired'),
		firstName: yup.string().required('isRequired'),
		lastName: yup.string().required('isRequired'),
		fromDate: yup.date().required('isRequired'),
		toDate: yup.date().required('isRequired')
	})

	const addressHistory = yup.object({
		streetNumber: yup.string().required('isRequired'),
		route: yup.string().required('isRequired'),
		locality: yup.string().required('isRequired'),
		postalTown: yup.string().required('isRequired'),
		administrativeAreaLevel2: yup.string().required('isRequired'),
		country: yup.string().required('isRequired'),
		postalCode: yup.string().required('isRequired'),
		fromDate: yup.date().required('isRequired')
	})

	const validationSchema = yup.object({
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
		additionalInfoDetails
	}
}