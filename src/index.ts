import * as fs from "fs";
import { OAuth2Client } from "google-auth-library";
import { getOAuth2Client } from "./auth/oauth2";
import getServiceAccountClient from "./auth/serviceAccountAuth";
import path from "path";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

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
async function fetchWithServiceAccountAuth() {
  const saAuthClient = await getServiceAccountClient([
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.readonly",
  ]);
  getResourceByUrl(URL, saAuthClient);
}

async function getResourceByUrl(url: string, auth: OAuth2Client | JSONClient) {
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

  if (auth instanceof OAuth2Client) {
    // After acquiring an access_token, you may want to check on the audience, expiration,
    // or original scopes requested.  You can do that with the `getTokenInfo` method.
    const tokenInfo = await auth.getTokenInfo(auth.credentials.access_token!);
    console.log({ tokenInfo });
  }
}

fetchWithServiceAccountAuth();
