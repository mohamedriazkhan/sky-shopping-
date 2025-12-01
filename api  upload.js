api/
   upload.js
import formidable from "formidable";
import { GoogleSpreadsheet } from "google-spreadsheet";
import OpenAI from "openai";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const form = formidable({ multiples: false });
  const [fields, files] = await form.parse(req);
  const filePath = files.file.filepath;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const image = fs.readFileSync(filePath);

  const ocrResponse = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "user", content: "Extract text from this bill" },
      { role: "user", content: [{ type: "input_image", image_url: image.toString("base64") }] }
    ]
  });

  res.json({ result: ocrResponse.output_text });
}
