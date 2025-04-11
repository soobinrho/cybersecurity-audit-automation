import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/api/v1")) {
    const oAuthSession = req.auth;
    const clientSideAuthForAPI = req.headers.get("authorization");
    if (oAuthSession || clientSideAuthForAPI) {
      return NextResponse.next();
    }

    return NextResponse.json(
      {
        message: "Provide authentication credentials.",
      },
      { status: 401, statusText: "Unauthorized" }
    );
 
  }

  return NextResponse.next();
});
