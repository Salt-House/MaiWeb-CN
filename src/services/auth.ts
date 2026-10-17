import http from "./request"

export const register = (data: any) => {
  return http.post<any>("/api/auth/register", data)
}

export const login = (data: URLSearchParams) => {
  return http.post<any>("/api/auth/jwt/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}

export const sendVerificationEmail = (email: string) => {
  return http.get<any>(`/email/verify/email`, { email })
}

export const changePassword = (data: any) => {
  return http.post<any>("/email/change_password", data)
}
