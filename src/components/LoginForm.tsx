/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1ADs2FRNaQg
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormEventHandler, useState } from "react"
import { signIn } from 'next-auth/react'
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

export function LoginForm() {
  const [userData, setUserData] = useState({
    nom: "", password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        nom: userData.nom,
        password: userData.password,
        redirect: false,
      });

      if (!res?.ok) {
        throw new Error("Nom ou Password ne pas vrais");
      }

      toast({
        title: "Login avec succes",
        className: 'bg-success'
      })

      router.refresh();
      router.push(decodeURIComponent(searchParams.get("next") || '/'));
    } catch (error: any) {
      toast({
        title: "Erreur des donnees.",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-lg shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your nom and password to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" type="text" required value={userData.nom} onChange={({ target: { value } }) => setUserData(prev => ({ ...prev, nom: value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={userData.password} onChange={({ target: { value } }) => setUserData(prev => ({ ...prev, password: value }))} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}