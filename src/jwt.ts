import { JWT } from "google-auth-library";
import * as keys from "../sa.json";

export async function getJWTClient(): Promise<JWT> {
  return new Promise((resolve) => {
    const jwtClient = new JWT(
      keys.client_email,
      undefined,
      keys.private_key,
      [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
      undefined
    );

    jwtClient.authorize((err, accessToken) => {
      if (err) throw new Error();

      console.log("jwt access token", { accessToken });
      resolve(jwtClient);
    });
  });
}
