"use client"

import { useCallback, useEffect } from "react"
import { useAuthStore, type User } from "@/lib/store"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { user, token, isAuthenticated, login, logout, setUser } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken && !token) {
      api.get<{ success: boolean; data: User }>("/users/profile")
        .then((res) => {
          login(res.data, storedToken)
        })
        .catch(() => {
          localStorage.removeItem("auth_token")
        })
    }
  }, [login, token])

  const loginAction = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{ success: boolean; data: { user: User; token: string } }>("/auth/login", {
        email,
        password,
      })
      login(res.data.user, res.data.token)
      router.push("/")
    },
    [login, router]
  )

  const registerAction = useCallback(
    async (data: {
      name: string
      email: string
      phone: string
      password: string
    }) => {
      const res = await api.post<{ success: boolean; data: { user: User; token: string } }>(
        "/auth/register",
        data
      )
      login(res.data.user, res.data.token)
      router.push("/verify-otp")
    },
    [login, router]
  )

  const logoutAction = useCallback(() => {
    logout()
    router.push("/login")
  }, [logout, router])

  const verifyOtpAction = useCallback(
    async (email: string, otp: string) => {
      await api.post("/auth/verify-otp", { email, otp })
      if (user) {
        setUser({ ...user, isVerified: true })
      }
      router.push("/")
    },
    [router, user, setUser]
  )

  const sendOtpAction = useCallback(
    async (email: string) => {
      await api.post("/auth/send-otp", { email })
    },
    []
  )

  return {
    user,
    token,
    isAuthenticated,
    login: loginAction,
    register: registerAction,
    logout: logoutAction,
    verifyOtp: verifyOtpAction,
    sendOtp: sendOtpAction,
    setUser,
  }
}
