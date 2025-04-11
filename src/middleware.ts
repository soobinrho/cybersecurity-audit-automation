import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/api/v1')) {
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
})

// export async function middleware(req: NextRequest) {
//   const pathName = req.nextUrl.pathname
//   if (pathName.startsWith('/api/v1')) {
//     const basicAuth = req.headers.get('authorization')
    
//     if (basicAuth) {
//       const authValue = basicAuth.split(' ')[1]
//       const [user, pass] = atob(authValue).split(':')
    
//       // TODO: Use OAuth 2.0 for dashboard login authentication and
//       //       authorization for internal dashboard API calls.
//       // TODO: Use database caa_user_id, caa_user_api_key, and
//       //       caa_user_permission for client-side Python scripts
//       //       with only read access. Give an option to regenerate.
//       if (user === 'UID4.0_this_is_a_test_value' && pass === 'RANDOM_API_KEY_this_is_a_test_value') {
//         return NextResponse.next()
//       }
//     }

//     if (process.env.NODE_ENV === 'development') {
//       console.log('[DEBUG] API request received but authentication failed.')
//     }
    
//     return NextResponse.json(
//       { message: 'Please provide a proper HTTPBasicAuth username and password.'},
//       { status: 401, statusText: 'Unauthorized' }
//     )
//   }
// }

// // TODO: https://authjs.dev/getting-started/authentication
// // If I can find a way to use OAuth for creating tokens for 
// // client-side Python code tokens, I might need a database.