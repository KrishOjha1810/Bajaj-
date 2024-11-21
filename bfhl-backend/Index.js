const express = require("express");
const bodyParser = require("body-parser");
const mime = require("mime-types"); // Import mime-types package

const app = express();
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({
  origin: "https://bajaj-navy-delta.vercel.app/", // Replace with your actual frontend URL
}));

// POST Endpoint
app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    // Extract numbers and alphabets
    const numbers = data.filter((x) => !isNaN(x));
    const alphabets = data.filter((x) => isNaN(x));

    // Determine the highest lowercase alphabet
    const lowercaseAlphabets = alphabets.filter(
      (x) => x === x.toLowerCase() && /^[a-z]$/.test(x)
    );
    const highestLowercase = lowercaseAlphabets.sort().slice(-1)[0] || null;

    // Check for prime numbers
    const isPrimeFound = numbers.some((num) => isPrime(Number(num)));

    // File handling
    const fileValid = !!file_b64;
    let fileMimeType = null;
    let fileSizeKb = 0;

    if (fileValid) {
      const fileBuffer = Buffer.from(file_b64, "base64");
      fileMimeType = mime.lookup(fileBuffer) || "application/octet-stream"; // Dynamically detect MIME type
      fileSizeKb = fileBuffer.length / 1024; // File size in KB
    }

    // Prepare response
    const response = {
      is_success: true,
      user_id: "krishojha_1810", // Your user ID
      email: "krishojha210868@acropolis.in", // Your email
      roll_number: "0827CD211037", // Your roll number
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
      is_prime_found: isPrimeFound,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ is_success: false, error: error.message });
  }
});

// GET Endpoint
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Helper Function: Check Prime
function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}


module.exports = app; // Export the app for Vercel
