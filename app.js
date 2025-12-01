const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { extractBillData } = require("./ai-reader");
const { updateSheet } = require("./google-sheet");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("bill"), async (req, res) => {
    try {
        const result = await extractBillData(req.file.path);

        await updateSheet(result);

        res.json({
            message: "Bill processed and updated in Google Sheet",
            data: result
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
