export default defineEventHandler(async (event) => {

	const id = getRouterParam(event, 'id')
	const db = useDrizzle()

	let application = null

	try {

		application = await db.query.applications.findFirst({
			where: eq(tables.applications.id, Number(id)),
		})

		if (application) {
			const previousNameHistory = await db.query.applicationNameHistory.findMany({
				where: eq(tables.applicationNameHistory.applicationId, Number(application.id)),
			})

			const addressHistory = await db.query.applicationAddressHistory.findMany({
				where: eq(tables.applicationAddressHistory.applicationId, Number(application.id)),
			})

			return {
				success: true,
				data: {
					...application,
					previousNameHistory,
					addressHistory: addressHistory.filter(address => address.type === 'applicant'),
					organisationAddress: addressHistory.filter(address => address.type === 'organisation')
				}
			}
		}

		return {
			success: false,
			data: application
		}

	} catch (ex) {
		return {
			success: false,
			error: `${ex?.message}: ${application}`
		}
	}

})
