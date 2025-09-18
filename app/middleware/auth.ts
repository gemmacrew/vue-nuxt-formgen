export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = useUserSession()
  const localePath = useLocalePath()

  await useUserSession().fetch()

  if (!session.loggedIn.value) {
    return navigateTo({
      path: localePath('auth-login'),
      query: {
        redirectTo: localePath(to.fullPath),
      },
    })
  }
})
