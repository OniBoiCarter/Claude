import { NextAuthOptions } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  // JWT strategy allows credentials provider alongside OAuth
  session: { strategy: "jwt" },
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: { params: { scope: "openid profile email" } },
    }),
    CredentialsProvider({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            department: true,
            title: true,
            // demoPassword is stored in a separate field we add
          },
        })

        if (!user) return null

        // Look up the demo password record
        const demoRecord = await prisma.demoAccount.findUnique({
          where: { userId: user.id },
        })

        if (!demoRecord) return null

        const valid = await bcrypt.compare(credentials.password, demoRecord.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          department: user.department,
          title: user.title,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // On sign-in: pull custom fields from user object or DB
        token.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, department: true, title: true },
        })
        token.role = dbUser?.role ?? "SUBMITTER"
        token.department = dbUser?.department ?? null
        token.title = dbUser?.title ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as string) ?? "SUBMITTER"
        session.user.department = (token.department as string) ?? null
        session.user.title = (token.title as string) ?? null
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}
