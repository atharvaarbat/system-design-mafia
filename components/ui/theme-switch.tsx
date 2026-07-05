"use client"

import { MoonIcon, SunMediumIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

/** @internal */
// import { ThemeToggleEffectSelector } from "./theme-toggle-effect-selector"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()


  const switchTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleThemeToggleClick = () => {
    if (!document.startViewTransition) switchTheme()
    else document.startViewTransition(switchTheme)
  }

  return (

      <Button
        variant="outline"
        size="icon"
        aria-label="Theme Toggle"
        onClick={handleThemeToggleClick}
        className="flex rounded-none items-center justify-center h-10 w-10 border border-foreground/10 bg-transparent text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
      >
        <MoonIcon className="hidden [html.dark_&]:block" />
        <SunMediumIcon className="hidden [html.light_&]:block" />
      </Button>
  )
}
