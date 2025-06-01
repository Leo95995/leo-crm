export const AppRoutes = {
  authorized: {
    home: "/",
    clients: "/clienti",
    opportunities: "/opportunita",
    users: "/utenti",
    profile: "/profilo",
    notFound: "*",
  },
  unauthorized: {
    signin: "/signin",
    signup: "/signup",
    reset: "/reset-password",
    newpassword: "/new-password",
    notFound: "*",
    api:"/api",
    docs: "/api/api-docs"
  },
};
