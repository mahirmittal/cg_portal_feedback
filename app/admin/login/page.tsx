"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Lock, Shield, Crown } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      alert("Please enter both username and password")
      return
    }

    setLoading(true)

    if (username && password) {
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminUsername", username)
      router.push("/admin/dashboard")
    } else {
      alert("Please enter both username and password")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-green-50 to-blue-50">
      {/* Government Header */}
      <header className="bg-gradient-to-r from-orange-400 via-orange-500 to-green-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://cgstate.gov.in/user-assets/images/logo-cg.png"
                alt="Chhattisgarh Government"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-blue-900">ADMINISTRATIVE PORTAL</h1>
                <p className="text-sm text-blue-800">छत्तीसगढ़ शासन | GOVERNMENT OF CHHATTISGARH</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("login.backToHome")}
            </Link>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-gray-700 to-blue-800 text-white rounded-t-lg">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">{t("login.adminTitle")}</CardTitle>
              <CardDescription className="text-gray-200">{t("login.adminDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                    {t("login.username")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="username"
                      placeholder={t("login.usernamePlaceholder")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    {t("login.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("login.adminPasswordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-gray-700 to-blue-800 hover:from-gray-800 hover:to-blue-900 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? t("login.loggingIn") : t("login.loginButton")}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">{t("login.demoSystem")}</p>
                    <p className="text-sm text-blue-700 mt-1">{t("login.demoAdminDesc")}</p>
                    <p className="text-sm text-blue-600 mt-1 font-medium">{t("login.adminExample")}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Administrative Access Only • For technical support: 0771-2234567
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
