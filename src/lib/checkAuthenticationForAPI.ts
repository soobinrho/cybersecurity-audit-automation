import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { Session } from "next-auth";

// TODO: Delete this debug code.
// INSERT INTO client_side_program_api_keys (api_key_id, caa_user_id, api_key_hashed_value, api_key_is_active, api_key_time_generated)
// VALUES (1, "3a8f4c10-d426-43a1-bb72-9f894ff6a52f", "$2b$10$nS.fSMLiBN9cW5hGgdy84.GFK38XkPdowlNXc2efsUvWudJy2w.YW", 1, 1742113862);

// DELETE FROM client_side_program_api_keys WHERE api_key_id=1;

export default async function checkAuthenticationForAPI(oAuthSession: Session | null, clientSideAuthForAPI: String | null) {
  let userAuthenticatedID = '';
  if (oAuthSession) {
    userAuthenticatedID = oAuthSession.user?.id || '';
  } else if (clientSideAuthForAPI && clientSideAuthForAPI !== '') {
    const authValue = clientSideAuthForAPI.split(" ")[1];
    const [user, pass] = atob(authValue).split(":");
    const findKeyHashed = await prisma.client_side_program_api_keys.findFirst({
      where: {
        caa_user_id: user,
        api_key_is_active: 1,
      }
    })
    const keyHashedAnswer = findKeyHashed?.api_key_hashed_value || '';
    if (await bcrypt.compare(pass, keyHashedAnswer)) {
      userAuthenticatedID = user;
    }
  }
  return userAuthenticatedID;
}
