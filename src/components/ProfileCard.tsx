"use client"

import React, { FormEventHandler, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { SpecificActions } from '@/utils/frontend-functions'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import ResponseType from '@/types/ResponseType'

const ProfileCard = ({ user, userColumns }: any) => {
  const { validation, getRequiredField, getInputsSpecial } = new SpecificActions("users" as "prix");
  const [userData, setUserData] = useState({ nom: "", password: "", email: "", phone: "", ...user, date: '' });
  const { toast } = useToast();

  const handleEnregistrer: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const description = validation(userData);

    if (description) {
      return toast({
        title: "Erreur des donnees.",
        description,
        variant: "destructive"
      });
    }

    const res = await fetch(`/api/profile`, {
      method: "PATCH",
      body: JSON.stringify(userData)
    });
    const { message }: ResponseType = await res.json();

    if (!res.ok) {
      toast({
        title: "Erreur des donnees.",
        description: message,
        variant: "destructive"
      })
    } else {
      toast({
        title: message,
        className: 'bg-success'
      })
    }
  }

  return (
    <form onSubmit={handleEnregistrer} className={`grid gap-4 p-2 container`}>
      {
        userColumns.map((field: string) => (
          <Label key={field} className={`flex items-center gap-4 flex-wrap`}>
            <span className={`text-right capitalize ${"min-w-32"}`}>
              {field}
            </span>
            {field === "password" ? getInputsSpecial(userData, setUserData)["password"] : (
              <Input
                id={field}
                value={(userData as any)[field]}
                onChange={({ target: { value } }) => setUserData((prev: any) => ({ ...prev, [field]: value }))}
                required={getRequiredField().find((item: string) => item === field) ?? false}
                className='flex-1'
              />
            )}
          </Label>
        ))
      }
      <Button className='col-start-2 max-w-28 ml-auto' type="submit">Enregistrer</Button>
    </form>
  )
}

export default ProfileCard