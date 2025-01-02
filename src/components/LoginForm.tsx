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

export function LoginForm({ asAdmin }: { asAdmin: boolean }) {
  const [userData, setUserData] = useState({
    nom: "", password: "", email: "", phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (asAdmin) {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!res.ok) {
          throw new Error("Erreur lors de la creation de ce document");
        }

        toast({
          title: "Admin cree avec succes",
          className: 'bg-success'
        })
      }
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
        <CardTitle className="text-2xl font-bold">{asAdmin ? "Cree Admin" : "Login"}</CardTitle>
        <CardDescription>Enter your {asAdmin && "email and"} nom and password to {asAdmin ? "cree admin account" : "login to your account"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleLogin}>
          {asAdmin && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="text" required value={userData.email} onChange={({ target: { value } }) => setUserData(prev => ({ ...prev, email: value }))} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" type="text" required value={userData.nom} onChange={({ target: { value } }) => setUserData(prev => ({ ...prev, nom: value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={userData.password} onChange={({ target: { value } }) => setUserData(prev => ({ ...prev, password: value }))} />
          </div>
          {asAdmin && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="phone" required value={userData.phone} onChange={({ target: { value } }) => setUserData(prev => ({ ...prev, phone: value }))} />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}