import React from "react"
import SignInPage from "./signin"
import { getServerSession } from "next-auth"
import { redirect } from "next/dist/client/components/navigation"
import { authOption } from "@/app/api/auth/[...nextauth]/authOption"

export default async function AuthPage() {
  const session = await getServerSession(authOption)
  if(session){
    redirect('/')
  }
  return (
    <>
      <SignInPage></SignInPage>
    </>
  )
}