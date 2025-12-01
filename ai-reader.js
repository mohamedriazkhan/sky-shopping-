import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractBillData(imagePath) {
    const imageBytes = fs.readFileSync(imagePath);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract the following fields: agency name, bill number, bill date, total amount, paid status, and the bottom right numeric value (FTS bill number). Format as JSON." },
            { type: "image", image: imageBytes }
          ]
        }
      ]
    });

    const data = JSON.parse(response.choices[0].message.content);

    data.uploadedDate = new Date().toLocaleDateString("en-IN");

    return data;
}
