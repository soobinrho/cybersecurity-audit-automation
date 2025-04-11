import { error } from 'console'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api')) {
    const basicAuth = req.headers.get('authorization')
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pass] = atob(authValue).split(':')
    
      // TODO: Generate secure user / pass values for each user.
      if (user === 'testvaluefornow' && pass === 'testvaluefornow_pass') {
        return NextResponse.next()
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG] API request received but authentication failed.')
    }
    
    return NextResponse.json(
      { message: 'Please provide a proper HTTPBasicAuth username and password.'},
      { status: 401, statusText: 'Unauthorized' }
    )
  }
}