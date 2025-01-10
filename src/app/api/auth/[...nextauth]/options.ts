import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"

export const options: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        nom: {},
        password: {}
      },
      async authorize(credentials) {
        if (!credentials?.nom || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ nom: credentials.nom });

        if (user) {
          const isTheSame = await bcrypt.compare(credentials.password, user.password);
          if (isTheSame) {
            return user;
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      await connectDB();
      const { permissions } = await User.findById(token.sub);
      if (user) {
        token.name = user.nom;
      }
      token.permissions = permissions;
      return token;
    },
    async session({ token, session }) {
      if (session?.user) {
        session.user.name = token.name!;
        session.user.permissions = token.permissions;
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login'
  },
}
