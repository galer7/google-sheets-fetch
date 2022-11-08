import { Spreadsheet } from "../models/spreadsheet";
import { getOAuth2Client } from "../auth/oauth2";

export async function flow(
  spreadsheetId: string,
  exchangeRate: string,
  cellLocation: string
) {
  const oauth2Client = await getOAuth2Client();
  const ss = new Spreadsheet(oauth2Client);
  ss.setRow(spreadsheetId, { majorDimension: "ROWS" });
}
