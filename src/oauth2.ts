import { OAuth2Client } from "google-auth-library";
import * as http from "http";
import * as keys from "../oa2.json";
import * as url from "url";
import open from "open";
import destroyer from "server-destroy";

const CB_SERVER_HOST = "http://localhost";

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
export function getOAuth2Client(): Promise<OAuth2Client> {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    const oAuth2Client = new OAuth2Client(
      keys.installed.client_id,
      keys.installed.client_secret,
      keys.installed.redirect_uris[0]
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
      redirect_uri: keys.installed.redirect_uris[0],
    });

    console.log({ authorizeUrl });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req, res) => {
        try {
          if (!req.url) throw new Error("No req.url");
          console.log({ "req.url": req.url });

          // acquire the code from the querystring, and close the web server.
          const qs = new url.URL(req.url, `${CB_SERVER_HOST}`).searchParams;
          const code = qs.get("code");
          console.log(`Code is ${code}`);
          res.end("Authentication successful! Please return to the console.");
          server.destroy();

          if (!code) throw new Error("No code!");
          // Now that we have the code, use that to acquire tokens.
          const r = await oAuth2Client.getToken(code);
          console.log({ r });
          // Make sure to set the credentials on the OAuth2 client.
          oAuth2Client.setCredentials(r.tokens);
          console.info("Tokens acquired.");
          resolve(oAuth2Client);
        } catch (e) {
          reject(e);
        }
      })
      .listen(80, () => {
        // open the browser to the authorize url to start the workflow
        open(authorizeUrl, { wait: false }).then((cp) => cp.unref());
      });
    destroyer(server);
  });
}
