'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import login from "@/public/login.webp"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      // After successful registration and automatic sign in
      router.refresh()
      await new Promise(resolve => setTimeout(resolve, 100)) // Give time for session to be established
      router.push('/')
    } catch (error) {
      setError("Failed to register. Please try again.")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="flex rounded-lg overflow-hidden bg-background">
          <div className="hidden md:block w-1/2 relative">
            <div className="absolute inset-0 z-10" />
            <Image src={login} fill alt="Login pic" />
          </div>
          <div className="w-full md:w-1/2">
            <Card className="border-none shadow-none h-full">
              <CardHeader className="px-6 pt-8 pb-4">
                <CardTitle className="text-2xl sm:text-3xl">Register</CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                  <Button type="submit" className="w-full h-11 text-base">
                    Register
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="px-6 pb-8 pt-2 flex justify-center">
                <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                  Already have an account? Login
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
