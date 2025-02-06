import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    const publicPaths = ['/login', '/register']
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

    // If the user is authenticated and trying to access public paths, redirect them to the homepage
    if (session && isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // If the user is unauthenticated and trying to access private paths, redirect them to login
    if (!session && !isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return res
  } catch (e) {
    // If session retrieval fails or an error occurs, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
