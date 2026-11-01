import { DefaultSession } from "next-auth"
interface IUser {
  _id: string
  email: string
  userName: string
  role: string
  type: string
  isVerify: string
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    access_token: string
    refresh_token: string
    user: IUser
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token: string
    refresh_token: string
    user: IUser & DefaultSession["user"]
  }
}