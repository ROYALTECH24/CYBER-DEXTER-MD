const fs = require("fs");
require("dotenv").config();

const parseBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

const config = {
  // Session Configuration
  SESSION_ID: process.env.SESSION_ID || "CYBER-DEXTER-MD [KILL]>>>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0lXUW5nZlZwWjFhL1JuYUxFUHFZbkd2bHJxK2plQURxcjB6TU82VGNWdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRjF0QmJ3LzNhTDE5Mk1hWmI0Sys1WlVFSTgzbEhHRHp1eTdIUEhVK0Vraz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHSTdCeDc3MUUybzJrdVpNd1k1TGRjNE9XaDNvT042elNnTE5aRCt2ejNzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJaUFhtL25aU1pqaVhzZkZkanlPeHdMaVBSV0JXMzltUkJTK3l3cHdHRW1nPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IitEZDlCRUZMSjVmZlRQMGpyd21lYTJVeEo1RXNMcHUyYjJTbjdFblovVjQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InJzQTZHMWx3Rm1ka1IwR1IyZzRPZk9jakp5K2hXL2x5dDRudFhXL2ZjREU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUU8yRklUQTBJTDhwamlWMFd1eEUrcGRyUW9WaG1EVVBaWHB2UVZPRkZuUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWnlCQjNtSFJPTXE3TEdpM1A0M3JTeEJxZWRmb2xmTFBCaUhzbDJ1Qk5rRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9oWk1hcWZQR1lCaFR5MlJUNjYwUHh6bzV0Z0U4enVhVGRpcXhudHA1Ry9JTnMvSGpia1J3N1BXRnhwRzZvUTBRTGlwQTF3VUZ1WUU2NVpBSVJ0WmlBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTE4LCJhZHZTZWNyZXRLZXkiOiJjUWY5UmlLM2tBaVZzN2VpQ09Qam45RTRwTm0vVEdWcnBmSzhqb2lEcFh3PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJIdU5fU2RsUlIwLWxEUjRuSGlGdU5nIiwicGhvbmVJZCI6ImQ1MGFjODA1LWMwNjItNDE3Zi1hYjliLTJlNGQzYmMzMzc0NCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI5ZzRSQU1NWjFGUW1XaG9jVzNnUVR4Y0hzVFE9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNFJFb1NnNzJITzJPbDZ4S01ZSFFHZVJKTVJVPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlpOUEtUNkw4IiwibWUiOnsiaWQiOiIyNTQ3OTkyMTEzNTc6MTNAcy53aGF0c2FwcC5uZXQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ05hRnA4a0hFTi9TdWI4R0dBSWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkMzdy9EUFBDclRnanAzNnlVdUtXQW5nSzdKUTFqUVB5L0gwTnB0R0Fxa0k9IiwiYWNjb3VudFNpZ25hdHVyZSI6IklnblFZNktxM3RwVUZmaEJjWUllNHM3ZmEyU0p5SmpTbGxSMTE5WmhFdUxwSHdFT0F4MXp1SUpQL1RENXlKRnh3K3d5eldvZlVYQi9nenNxYmVQcERBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJVQ3pUTDZCbVRwbUFZSnFiVU1uT1RJbDljc09BeCsxY2tUNmQ2SmJTcTM1MVFtQ0RiYThxN3JSRzVteDJweUdrbk44aURHNjczRWhRZXloZjVwZlppZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDc5OTIxMTM1NzoxM0BzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRdDhQd3p6d3EwNEk2ZCtzbExpbGdKNEN1eVVOWTBEOHZ4OURhYlJnS3BDIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQzNjc3ODEwfQ==",
  PREFIX: process.env.PREFIX || ".",
  
  // Auto Features
  AUTO_STATUS_SEEN: parseBoolean(process.env.AUTO_STATUS_SEEN, true),
  AUTO_STATUS_REACT: parseBoolean(process.env.AUTO_STATUS_REACT, true),
  AUTO_STATUS_REPLY: parseBoolean(process.env.AUTO_STATUS_REPLY, false),
  AUTO_STATUS_REPLY_VOICE: parseBoolean(process.env.AUTO_STATUS_REPLY_VOICE, false),
  AUTO_STATUS_REPLY_VOICE_MULTI: parseBoolean(process.env.AUTO_STATUS_REPLY_VOICE_MULTI, false),
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || "*📍 Auto Status Seen Bot By ✪⏤Roye king*",

  AUTO_DL: parseBoolean(process.env.AUTO_DL, false),
  AUTO_READ: parseBoolean(process.env.AUTO_READ, false),
  AUTO_TYPING: parseBoolean(process.env.AUTO_TYPING, false),
  AUTO_RECORDING: parseBoolean(process.env.AUTO_RECORDING, true),
  AUTO_STATUS_REACT: parseBoolean(process.env.AUTO_STATUS_REACT, false),
  ALWAYS_ONLINE: parseBoolean(process.env.ALWAYS_ONLINE, true),

  // Call Settings
  REJECT_CALL: parseBoolean(process.env.REJECT_CALL, false),

  // General Settings
  NOT_ALLOW: parseBoolean(process.env.NOT_ALLOW, true),
  MODE: process.env.MODE || "private",
  OWNER_NAME: process.env.OWNER_NAME || "✪⏤Roye king",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "254799211357",

  // API Keys
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyCUPaxfIdZawsKZKqCqJcC-GWiQPCXKTDc",

  // Features
  WELCOME: parseBoolean(process.env.WELCOME, true),

  // Trigger Words
  triggerWords: [
    "ඔනි", "send", "එවන්න", "sent", "giv", "gib", "upload",
    "send me", "sent me", "znt", "snt", "ayak", "do", "mee", "autoread"
  ],
};

module.exports = config;
