import * as fs from "fs";
import { OAuth2Client, JWT } from "google-auth-library";
import { getOAuth2Client } from "./oauth2";
import { getJWTClient } from "./jwt";
import path from "path";

// @ts-expect-error
global.__rootdir = path.resolve(__dirname, "..");

const URL =
  "https://docs.google.com/spreadsheets/d/1-eL9BHZWu54lft6TP32g5CIHz24HacrZ8vEAa3_PA1s/export?gid=588344876&range=A1:G39&format=pdf&gridlines=false";

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
  // Make a simple request using our pre-authenticated client. The `request()` method takes an GaxiosOptions object. Visit https://github.com/JustinBeckwith/gaxios.
  const res = await auth.request<ArrayBuffer>({
    url,
    responseType: "arraybuffer",
  });

  const pdfWriteStream = fs.createWriteStream(
    // @ts-expect-error
    path.resolve(global.__rootdir, "export", `${Date.now()}.pdf`)
  );
  pdfWriteStream.once("open", () => {
    console.log("Writing PDF to file...");

    pdfWriteStream.write(Buffer.from(res.data));
    pdfWriteStream.on("finish", () => {
      console.log("Finished writing to PDF!");
    });

    pdfWriteStream.end();
  });
  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  const tokenInfo = await auth.getTokenInfo(auth.credentials.access_token!);
  console.log({ tokenInfo });
}

fetchWithOAuth2Client();
