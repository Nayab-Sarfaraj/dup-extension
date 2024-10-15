const express = require("express");
const axios = require("axios");
const app = express();
const fs = require("fs");
const path = require("path");
const os = require("os");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
async function readDownloads(url) {
  console.log(path.join(os.homedir(), "Downloads"));

  const readData = fs.readdirSync(
    path.join(os.homedir(), "Downloads"),
    "utf-8"
  );

  const fileUrl = url.split("/");
  console.log(fileUrl);
  let fileName = fileUrl[fileUrl.length - 1];
  fileName = fileName.replaceAll("%20", " ");
  fileName = fileName.replaceAll(",", "");
  console.log(fileName);
  const isExist = readData.findIndex(
    (item) =>
      item.trim() === fileName.trim() ||
      item.trim().startsWith(fileName.trim()) ||
      item.trim().endsWith(fileName.trim()) ||
      item.trim().includes(fileName.trim())
  );
  let filePath = "";
  if (isExist != -1)
    filePath = path.join(os.homedir(), "Downloads", readData[isExist]);

  console.log(filePath);
  return { result: isExist, filePath: filePath };
}
// end point to check whether the pdf exist in the computer or not
app.post("/download-pdf", async (req, res) => {
  const url = req.body.url;
  console.log(req.body);

  try {
    const { result, filePath } = await readDownloads(url);
    res.json({ result, filePath });
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).send("Error fetching PDF");
  }
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
