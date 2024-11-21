const express = require("express");
const bodyParser = require("body-parser");
const mime = require("mime-types");

const app = express();
app.use(bodyParser.json());
const cors = require("cors");

// Update CORS to allow requests from the deployed frontend
app.use(cors({
  origin: "https://your-frontend-domain.vercel.app", // Replace with your actual frontend URL
}));

app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    const numbers = data.filter((x) => !isNaN(x));
    const alphabets = data.filter((x) => isNaN(x));
    const lowercaseAlphabets = alphabets.filter(
      (x) => x === x.toLowerCase() && /^[a-z]$/.test(x)
    );
    const highestLowercase = lowercaseAlphabets.sort().slice(-1)[0] || null;
    const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

    let fileMimeType = null;
    let fileSizeKb = 0;

    if (file_b64) {
      const fileBuffer = Buffer.from(file_b64, "base64");
      fileMimeType = mime.lookup(fileBuffer) || "application/octet-stream";
      fileSizeKb = fileBuffer.length / 1024;
    }

    res.status(200).json({
      is_success: true,
      user_id: "krishojha_1810",
      email: "krishojha210868@acropolis.in",
      roll_number: "0827CD211037",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
      is_prime_found: isPrimeFound,
      file_valid: !!file_b64,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb,
    });
  } catch (error) {
    res.status(400).json({ is_success: false, error: error.message });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

module.exports = app; // For Vercel deployment
