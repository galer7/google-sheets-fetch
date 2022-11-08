import { OAuth2Client } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";

export class Spreadsheet {
  private sheets: sheets_v4.Sheets;
  constructor(private authClient: OAuth2Client) {
    this.sheets = google.sheets("v4");
  }

  async setRow(spreadsheetId: string, valueRange: sheets_v4.Schema$ValueRange) {
    return (
      await this.sheets.spreadsheets.values.update({
        auth: this.authClient,
        spreadsheetId,
        range: valueRange.range as string,
        requestBody: valueRange,
      })
    ).data;
  }
  async getCellRange(spreadsheetId: string, range: string) {}
}

type CellValueType = string | number;
