const { google } = require("googleapis");

async function authSheet() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "service-account.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth: await auth.getClient() });
}

const SPREADSHEET_ID = process.env.SHEET_ID;

exports.updateSheet = async function (bill) {
    const sheets = await authSheet();

    // Get existing data
    const existing = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1!A:F",
    });

    const rows = existing.data.values || [];
    const matchIndex = rows.findIndex(r => r[2] === bill.billNumber);

    const row = [
        bill.billDate,
        bill.agencyName,
        bill.billNumber,
        bill.ftsbillno,
        bill.totalAmount,
        bill.paid ? `PAID (${bill.uploadedDate})` : "UNPAID"
    ];

    if (matchIndex >= 0) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `Sheet1!A${matchIndex + 1}:F${matchIndex + 1}`,
            valueInputOption: "USER_ENTERED",
            resource: { values: [row] }
        });
    } else {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A:F",
            valueInputOption: "USER_ENTERED",
            resource: { values: [row] }
        });
    }
};
