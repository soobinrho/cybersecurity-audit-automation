import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { Session } from "next-auth";

const API_KEY_IDENTIFICATION_PREFIX = process.env
  .NEXT_PUBLIC_API_KEY_IDENTIFICATION_PREFIX as string;

export default async function checkAuthenticationForAPI(
  oAuthSession: Session | null,
  authFromAPI: string
) {
  if (oAuthSession && oAuthSession.user) {
    const userAuthenticatedID = oAuthSession.user.id;
    try {
      const clientSideApiKeys = await prisma.client_side_api_keys.findFirst({
        where: {
          caa_user_id: userAuthenticatedID,
          client_side_api_key_is_active: 1,
        },
      });
      // Example:
      //                      caa_user_id = 4138798a-b55e-44d4-8cd8-8181182eb856
      //             client_side_api_key_id = 1
      //   client_side_api_key_hashed_value = $2b$10$nS.fSmLibN8cw5hqgdy82.GcK18XmPdo3lNXa2EfSUvwuDJJ2W.YW
      //      client_side_api_key_is_active = 1
      // client_side_api_key_time_generated = 1648193962
      const clientSideApiKeyID = Number(
        clientSideApiKeys?.client_side_api_key_id
      );
      return {
        userAuthenticatedID: userAuthenticatedID as string,
        clientSideApiKeyID: clientSideApiKeyID as number,
      };
    } catch (err) {
      console.log(err);
    }
  } else {
    if (authFromAPI !== "") {
      const auth = authFromAPI.split(" ")[1];
      const [user, pass] = atob(auth).split(":");

      if (user && user !== "" && pass && pass !== "") {
        try {
          const clientSideApiKeys = await prisma.client_side_api_keys.findFirst(
            {
              where: {
                caa_user_id: user,
                client_side_api_key_is_active: 1,
              },
            }
          );
          if (clientSideApiKeys && clientSideApiKeys.client_side_api_key_id) {
            const keyHashedAnswer =
              clientSideApiKeys?.client_side_api_key_hashed_value.substring(
                API_KEY_IDENTIFICATION_PREFIX.length
              );
            if (await bcrypt.compare(pass, keyHashedAnswer)) {
              const userAuthenticatedID = user;
              const clientSideApiKeyID =
                clientSideApiKeys?.client_side_api_key_id;
              return {
                userAuthenticatedID: userAuthenticatedID as string,
                clientSideApiKeyID: clientSideApiKeyID as number,
              };
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  return null;
}
