import { error } from 'console'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api')) {
    const basicAuth = req.headers.get('authorization')
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pass] = atob(authValue).split(':')
    
      // TODO: Use OAuth 2.0 for dashboard login authentication and
      //       authorization for internal dashboard API calls.
      // TODO: Use database caa_user_id, caa_user_api_key, and
      //       caa_user_permission for client-side Python scripts
      //       with only read access. Give an option to regenerate.
      if (user === 'UID4.0_this_is_a_test_value' && pass === 'RANDOM_API_KEY_this_is_a_test_value') {
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