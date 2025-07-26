export const API_CONFIG = {
  baseUrl: "http://localhost:3000/api",
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      refresh: "/auth/refresh",
      logout: "/auth/logout",
    },
    tasks: {
      base: "/tasks",
      byId: (id: number) => `/tasks/${id}`,
    },
    users: {
      profile: "/users/profile",
      base: "/users",
    },
  },
}

// Para producción, puedes cambiar la baseUrl
export const PRODUCTION_API_URL = "https://tu-api-en-produccion.com/api"
