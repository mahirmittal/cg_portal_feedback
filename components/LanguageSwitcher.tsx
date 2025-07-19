"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Languages className="w-4 h-4 text-gray-600" />
      <div className="flex border rounded-md overflow-hidden border-green-300">
        <Button
          variant={language === "en" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("en")}
          className={`rounded-none px-3 py-1 text-xs ${
            language === "en" ? "bg-gradient-to-r from-green-600 to-blue-600 text-white" : "hover:bg-green-50"
          }`}
        >
          EN
        </Button>
        <Button
          variant={language === "hi" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage("hi")}
          className={`rounded-none px-3 py-1 text-xs ${
            language === "hi" ? "bg-gradient-to-r from-green-600 to-blue-600 text-white" : "hover:bg-green-50"
          }`}
        >
          हिं
        </Button>
      </div>
    </div>
  )
}
