import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/api/v1")) {
    const basicAuth = req.headers.get("authorization");

    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pass] = atob(authValue).split(":");

      // TODO: Create a new db just for API keys:
      // TABLE caa_client_side_api_keys
      // user_id  -- comes from session.user?.id from Auth.js
      // key -- comes from crypto.randomBytes(32).toString('hex');
      // permission -- string of "read;write;"
      if (
        user === "UID4.0_this_is_a_test_value" &&
        pass === "RANDOM_API_KEY_this_is_a_test_value"
      ) {
        return NextResponse.next();
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[DEBUG] API request received but authentication failed.");
    }

    return NextResponse.json(
      {
        message: "Please provide a proper HTTPBasicAuth username and password.",
      },
      { status: 401, statusText: "Unauthorized" }
    );
  }
});
