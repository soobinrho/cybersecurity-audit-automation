import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { Session } from "next-auth";

export default async function checkAuthenticationForAPI(
  oAuthSession: Session | null,
  clientSideAuthForAPI: String | null
) {
  let userAuthenticatedID = "";
  if (oAuthSession) {
    userAuthenticatedID = oAuthSession.user?.id || "";
  } else if (clientSideAuthForAPI && clientSideAuthForAPI !== "") {
    const authValue = clientSideAuthForAPI.split(" ")[1];
    const [user, pass] = atob(authValue).split(":");
    const findKeyHashed = await prisma.client_side_program_api_keys.findFirst({
      where: {
        caa_user_id: user,
        api_key_is_active: 1,
      },
    });
    const keyHashedAnswer = findKeyHashed?.api_key_hashed_value || "";
    if (await bcrypt.compare(pass, keyHashedAnswer)) {
      userAuthenticatedID = user;
    }
  }
  return userAuthenticatedID;
}
