import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.passwordHash) return null
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
    // Facebook & Apple providers can be added with env vars
  ],
  callbacks: {
    async session({ session, token, user }) {
      // attach user id and role
      if (token && session.user) {
        session.user.id = token.sub
        session.user.role = token.role || 'BUYER'
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        // copy role from user record
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (dbUser) token.role = dbUser.role
      }
      return token
    }
  }
})
