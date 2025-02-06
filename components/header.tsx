"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CreatePropertyModal } from "@/components/create-property-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setUserEmail(session?.user?.email || null)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      setUserEmail(session?.user?.email || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setIsLoggedIn(false)
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <span className="inline-block font-bold">Airbnb Praksa</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-4">
              {isLoggedIn && (
                <>
                  <CreatePropertyModal />
                  <Button asChild variant="ghost">
                    <Link href="/bookings">My Bookings</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/">Browse</Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {userEmail}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="py-2">Browse Properties</Link>
                  {isLoggedIn ? (
                    <>
                      <div className="py-2">
                        <CreatePropertyModal />
                      </div>
                      <Link href="/bookings" className="py-2">My Bookings</Link>
                      <div className="py-2 px-4 text-sm text-muted-foreground">
                        {userEmail}
                      </div>
                      <Button variant="destructive" onClick={handleLogout} className="mt-2 w-full">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="py-2">Login</Link>
                      <Link href="/register" className="py-2">Register</Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
