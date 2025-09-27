export default defineEventHandler(async (event) => {

	const id = getRouterParam(event, 'id')
	const session = await getUserSession(event)
	console.log(session)

	const application = await db.query.applications.findFirst({
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
				addressHistory
			}
		}
	}

	return {
		success: false,
		data: application
	}

})
