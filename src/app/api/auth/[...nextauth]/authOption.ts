import { AuthOptions } from "next-auth"
import { apiFunction } from "../../api"
import { JWT } from "next-auth/jwt"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";

const getAuth = async (type: string, userName: string) => await apiFunction<IBackendRes<JWT>>(
  {
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/social-media`,
    method: "POST",
    body: {
      type,
      userName
    }
  }
)

const login = async(username: string, password: string) => await apiFunction<IBackendRes<any>>(
  {
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
    method: "POST",
    body: {
      username,
      password 
    }
  }
)

export const authOption: AuthOptions = {
  secret: process.env.NO_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "please input" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await login(credentials?.username ?? '', credentials?.password ?? '')
        if (user.res?.data) {
          // Any object returned will be saved in `user` property of the JWT
          return user.res.data
        } else {
          const errorMessage = user?.error ?? user.res?.error
          throw new Error(errorMessage)

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, account, user }){

      if(trigger === 'signIn' && account?.provider !== 'credentials' && token.email) {
        const callApi = await getAuth('GITHUB', token.email)
        if(callApi.res?.data) {
          token = { ...token, ...callApi.res?.data }
        }
      }
      else if(trigger === 'signIn') {
        token = {...token, ...user}
      }
      return token
    },
    session({ trigger, token, user, session }){
      if(token) {
        session.user = { ...token.user, image: session.user.image }
        session.access_token = token.access_token
        session.refresh_token = token.refresh_token
      }
      return session
    },
  }
}
