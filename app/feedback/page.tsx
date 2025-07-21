"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LogOut, Phone, Hash, MessageSquare, User, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export default function FeedbackPage() {
  const { t } = useLanguage()
  const [callId, setCallId] = useState("")
  const [citizenMobile, setCitizenMobile] = useState("")
  const [citizenName, setCitizenName] = useState("")
  const [queryType, setQueryType] = useState("")
  const [satisfaction, setSatisfaction] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [executiveUsername, setExecutiveUsername] = useState("")
  const [executiveType, setExecutiveType] = useState("")
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("executiveLoggedIn")
    const username = localStorage.getItem("executiveUsername")
    const userType = localStorage.getItem("executiveType")

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (username) {
      setExecutiveUsername(username)
    }
    if (userType) {
      setExecutiveType(userType)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("executiveLoggedIn")
    localStorage.removeItem("executiveUsername")
    localStorage.removeItem("executiveType")
    localStorage.removeItem("executiveId")
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all required fields
    if (!callId || !citizenMobile || !citizenName || !queryType || !satisfaction || !description) {
      alert("Please fill all fields")
      return
    }

    // Validate mobile number format
    if (!/^[0-9]{10}$/.test(citizenMobile)) {
      alert("Please enter a valid 10-digit mobile number")
      return
    }

    // Validate satisfaction value
    if (!["satisfied", "not-satisfied"].includes(satisfaction)) {
      alert("Please select satisfaction level")
      return
    }

    // Validate call ID format (simple validation)
    if (callId.length < 3) {
      alert("Call ID must be at least 3 characters long")
      return
    }

    setLoading(true)

    const feedbackData = {
      callId: callId.trim(),
      citizenMobile: citizenMobile.trim(),
      citizenName: citizenName.trim(),
      queryType: queryType.trim(),
      satisfaction,
      description: description.trim(),
      submittedBy: executiveUsername,
      submittedAt: new Date().toISOString(),
      status: satisfaction === "satisfied" ? "resolved" : "pending",
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert("Feedback recorded successfully!")
        // Clear form fields
        setCallId("")
        setCitizenMobile("")
        setCitizenName("")
        setQueryType("")
        setSatisfaction("")
        setDescription("")
      } else {
        alert(result.error || "Failed to record feedback. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Error recording feedback. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50">
      {/* Government Header */}
      <header className="bg-gradient-to-r from-orange-400 via-orange-500 to-green-500 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <img
                  src="https://cgstate.gov.in/user-assets/images/logo-cg.png"
                  alt="Chhattisgarh Government"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-blue-900">{t("feedback.title")}</h1>
                  <p className="text-sm text-blue-800">{t("feedback.subtitle")}</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {t("feedback.welcome")} {executiveUsername} ({executiveType})
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="bg-white">
                <LogOut className="w-4 h-4 mr-2" />
                {t("feedback.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardTitle className="text-2xl flex items-center">
                <MessageSquare className="w-6 h-6 mr-3" />
                {t("feedback.recordTitle")}
              </CardTitle>
              <CardDescription className="text-green-100">{t("feedback.recordDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="callId" className="text-sm font-semibold text-gray-700">
                      {t("feedback.callId")}
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="callId"
                        placeholder={t("feedback.callIdPlaceholder")}
                        value={callId}
                        onChange={(e) => setCallId(e.target.value)}
                        className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citizenMobile" className="text-sm font-semibold text-gray-700">
                      {t("feedback.citizenMobile")}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="citizenMobile"
                        placeholder={t("feedback.citizenMobilePlaceholder")}
                        value={citizenMobile}
                        onChange={(e) => setCitizenMobile(e.target.value)}
                        maxLength={10}
                        className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="citizenName" className="text-sm font-semibold text-gray-700">
                      {t("feedback.citizenName")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="citizenName"
                        placeholder={t("feedback.citizenNamePlaceholder")}
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="queryType" className="text-sm font-semibold text-gray-700">
                      {t("feedback.queryType")}
                    </Label>
                    <Input
                      id="queryType"
                      placeholder={t("feedback.queryTypePlaceholder")}
                      value={queryType}
                      onChange={(e) => setQueryType(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700">{t("feedback.satisfactionLevel")}</Label>
                  <RadioGroup value={satisfaction} onValueChange={setSatisfaction} className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50">
                      <RadioGroupItem value="satisfied" id="satisfied" />
                      <Label
                        htmlFor="satisfied"
                        className="text-green-700 font-medium flex items-center cursor-pointer"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {t("feedback.satisfied")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-red-200 rounded-lg hover:bg-red-50">
                      <RadioGroupItem value="not-satisfied" id="not-satisfied" />
                      <Label
                        htmlFor="not-satisfied"
                        className="text-red-700 font-medium flex items-center cursor-pointer"
                      >
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {t("feedback.notSatisfied")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    {t("feedback.description")}
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      id="description"
                      placeholder={t("feedback.descriptionPlaceholder")}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="pl-12 min-h-[120px] border-2 border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {t("feedback.guidelines")}
                  </h4>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {t("feedback.guideline1")}
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {t("feedback.guideline2")}
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {t("feedback.guideline3")}
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {t("feedback.guideline4")}
                    </li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg"
                  disabled={loading}
                >
                  {loading ? t("feedback.recording") : t("feedback.recordButton")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
