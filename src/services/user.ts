import http from "./request"
import { AccountResponse, UserProfile } from "@/types/user"

export const getBindAccounts = () => {
  return http.get<AccountResponse[]>("/api/maimai/maiweb/accounts")
}

export const bindLxns = (personal_token: string) => {
  return http.post("/api/maimai/maiweb/accounts/lxns", null, {
    params: { personal_token },
  })
}

export const bindDivingFish = (username: string, password: string) => {
  return http.post("/api/maimai/maiweb/accounts/divingfish", null, {
    params: { username, password },
  })
}

export const bindArcade = (qr_code: string) => {
  return http.post("/api/maimai/maiweb/accounts/arcade", null, {
    params: { qr_code },
  })
}

export const refreshData = () => {
  return http.put("/api/maimai/maiweb/accounts")
}

export const getUserProfile = () => {
  return http.get<UserProfile>("/api/user/me")
}
