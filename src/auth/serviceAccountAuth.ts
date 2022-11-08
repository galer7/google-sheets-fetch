import { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import path from "path";
import { Auth } from "googleapis";

export default async function getServiceAccountAuthClient(
  scopes: string[]
): Promise<JSONClient> {
  // @ts-expect-error
  console.log(path.resolve(global.__rootdir, "sa.json"));
  const auth = new Auth.GoogleAuth({
    // @ts-expect-error
    keyFile: path.resolve(global.__rootdir, "sa.json"),
    scopes,
  });

  return auth.getClient() as unknown as JSONClient;
}
