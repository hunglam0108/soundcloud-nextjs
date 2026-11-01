import { NextRequest } from "next/server" 

export const GET = async (request: NextRequest, context: { params: Promise<{ audio: string }> }) => {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${searchParams.get('audio')}`)
}