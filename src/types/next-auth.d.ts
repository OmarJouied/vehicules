import { DefaultUser, ISODateString } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module "next-auth" {
  interface Session {
    user: {
      id: string,
      email: string,
      name: string
      permissions?: any
    }
    expires: ISODateString
  }

  interface User extends DefaultUser {
    nom: string
    permissions?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    permissions?: any
  }
}