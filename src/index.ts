import { OAuth2Client, JWT } from "google-auth-library";

import fs from "fs";
import { getOAuth2Client } from "./oauth2";
import { getJWTClient } from "./jwt";

const URL =
  "https://docs.google.com/spreadsheets/d/1-eL9BHZWu54lft6TP32g5CIHz24HacrZ8vEAa3_PA1s/export?gid=588344876&range=A1:G39&format=pdf";

/** Uses OAuth2.0 Client IDs */
async function fetchWithOAuth2Client() {
  const oAuth2Client = await getOAuth2Client();
  getResourceByUrl(URL, oAuth2Client);
}

/** Uses Service Account */
async function fetchWithJWTClient() {
  const jwtClient = await getJWTClient();
  getResourceByUrl(URL, jwtClient);
}

async function getResourceByUrl(url: string, auth: JWT | OAuth2Client) {
  // Make a simple request using our pre-authenticated client. The `request()` method takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
  const res = await auth.request({ url });
  console.log(res.data);

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  const tokenInfo = await auth.getTokenInfo(auth.credentials.access_token!);
  console.log(tokenInfo);
}

fetchWithJWTClient();
