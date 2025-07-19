"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LogOut,
  Search,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  TrendingUp,
  Users,
  Phone,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

interface Feedback {
  id: string
  callId: string
  citizenMobile: string
  citizenName: string
  satisfaction: string
  description: string
  submittedBy: string
  submittedAt: string
  status: string
  queryType: string
}

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null)
  const [adminUsername, setAdminUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    const username = localStorage.getItem("adminUsername")

    if (!isLoggedIn) {
      router.push("/admin/login")
      return
    }

    if (username) {
      setAdminUsername(username)
    }

    fetchFeedbacks()
  }, [router])

  useEffect(() => {
    let filtered = feedbacks

    if (searchTerm) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.callId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feedback.citizenMobile.includes(searchTerm) ||
          feedback.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((feedback) => feedback.status === filterStatus)
    }

    setFilteredFeedbacks(filtered)
  }, [feedbacks, searchTerm, filterStatus])

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/feedback")
      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data)
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (feedbackId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/feedback", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: feedbackId, status: newStatus }),
      })

      if (response.ok) {
        fetchFeedbacks()
        setEditingFeedback(null)
      }
    } catch (error) {
      console.error("Error updating feedback:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUsername")
    router.push("/")
  }

  const stats = {
    total: feedbacks.length,
    satisfied: feedbacks.filter((f) => f.satisfaction === "satisfied").length,
    notSatisfied: feedbacks.filter((f) => f.satisfaction === "not-satisfied").length,
    pending: feedbacks.filter((f) => f.status === "pending").length,
  }

  const satisfactionRate = stats.total > 0 ? Math.round((stats.satisfied / stats.total) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-400 via-orange-500 to-green-500 shadow-lg border-b border-green-600">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://cgstate.gov.in/user-assets/images/logo-cg.png"
                alt="Chhattisgarh Government Logo"
                className="w-14 h-14 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{t("admin.title")}</h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {t("admin.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{adminUsername.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {t("admin.welcome")} {adminUsername}
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="shadow-sm bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                {t("feedback.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-blue-800 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {adminUsername}!</h2>
              <p className="text-blue-100">Monitor call center performance and manage feedback efficiently</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{satisfactionRate}%</div>
                <div className="text-sm text-blue-100">Satisfaction Rate</div>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">{t("admin.totalFeedbacks")}</CardTitle>
              <div className="p-2 bg-green-600 rounded-lg">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.total}</div>
              <p className="text-xs text-green-600 mt-1">Total feedback received</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">{t("admin.satisfied")}</CardTitle>
              <div className="p-2 bg-blue-600 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.satisfied}</div>
              <p className="text-xs text-blue-600 mt-1">Happy customers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">{t("admin.notSatisfied")}</CardTitle>
              <div className="p-2 bg-orange-600 rounded-lg">
                <XCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.notSatisfied}</div>
              <p className="text-xs text-orange-600 mt-1">Need attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">{t("admin.pending")}</CardTitle>
              <div className="p-2 bg-red-600 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">{stats.pending}</div>
              <p className="text-xs text-red-600 mt-1">Awaiting action</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg border-b border-green-200">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-green-600" />
              <CardTitle className="text-xl text-green-800">{t("admin.managementTitle")}</CardTitle>
            </div>
            <CardDescription className="text-green-700">{t("admin.managementDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("admin.search")}
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder={t("admin.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Label htmlFor="filter" className="text-sm font-medium text-gray-700 mb-2 block">
                  {t("admin.filterStatus")}
                </Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("admin.allStatus")}</SelectItem>
                    <SelectItem value="pending">{t("admin.pendingStatus")}</SelectItem>
                    <SelectItem value="resolved">{t("admin.resolvedStatus")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                        {t("common.callId")} {feedback.callId}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1">
                        {t("common.citizen")} {feedback.citizenName}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1">
                        {t("common.mobile")} {feedback.citizenMobile}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                        {t("common.query")} {feedback.queryType}
                      </Badge>
                      <Badge
                        variant={feedback.satisfaction === "satisfied" ? "default" : "destructive"}
                        className={`px-3 py-1 ${
                          feedback.satisfaction === "satisfied"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {feedback.satisfaction === "satisfied" ? "✓ Satisfied" : "✗ Not Satisfied"}
                      </Badge>
                      <Badge
                        variant={feedback.status === "resolved" ? "default" : "secondary"}
                        className={`px-3 py-1 ${
                          feedback.status === "resolved"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-orange-100 text-orange-800 border-orange-200"
                        }`}
                      >
                        {feedback.status === "resolved" ? t("admin.resolved") : t("admin.needsFollowup")}
                      </Badge>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 leading-relaxed">{feedback.description}</p>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {t("admin.recordedBy")} <strong className="ml-1">{feedback.submittedBy}</strong>
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {t("admin.date")} {new Date(feedback.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="ml-6">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingFeedback(feedback)}
                          className="shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {t("admin.edit")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <Edit className="w-5 h-5 mr-2 text-blue-600" />
                            {t("admin.updateStatus")}
                          </DialogTitle>
                          <DialogDescription>{t("admin.updateDesc")}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <Label className="text-sm font-medium text-gray-700">{t("admin.currentStatus")}</Label>
                            <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">{feedback.status}</p>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleStatusUpdate(feedback.id, "resolved")}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t("admin.markResolved")}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleStatusUpdate(feedback.id, "pending")}
                              className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              {t("admin.markPending")}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredFeedbacks.length === 0 && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t("admin.noFeedback")}</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || filterStatus !== "all" ? t("admin.noFeedbackDesc") : t("admin.noFeedbackSubmitted")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
