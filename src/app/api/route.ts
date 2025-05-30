import { NextRequest, NextResponse } from "next/server" 

export const GET = async (request: NextRequest, reponse: NextResponse) => {
  const url  = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${searchParams.get('audio')}`)
}