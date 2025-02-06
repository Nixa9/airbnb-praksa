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

    // Redirect authenticated users away from login/register pages
    if (session && isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Redirect unauthenticated users to login except for public paths
    if (!session && !isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return res

  } catch (e) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
