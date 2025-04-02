const fs = require("fs");
require("dotenv").config();

const parseBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

const config = {
  // Session Configuration
  SESSION_ID: process.env.SESSION_ID || "CYBER-DEXTER-MD [KILL]>>>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib01hblQrU3pQT2wrVXgzYm02S2V1ZmdtZUVrM1l6aHNleURYMTY2elEybz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK3c1aU5PeXVGZmpNTEhnM24rRzZ3Z3lOdStWdVdheTBVS09Yd0VaTzl6QT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJtRzM1Q0VKbFBSTWZIa1lIRVlJczFONk53d0ZQczdnNnRKV1BuWVcrNW00PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJMZUlVTmhpbCtUd0hQSzdLYkhGaUFWSmNIT29veEFJZDdRNndlbjRTeVFNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im9DcEtJUHNQbyt2Y2hXUFlURHlGc2d5UUozZEVsa0FmUlNGclQ4RmJsMzg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik96U0dmQmlwRjlEOURWWjZjWDFrSmp1Y1ljMGs4Wng0YXliQXR1ajBxbVU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0k1a1JyN2VPaFBmSmc2NXI1cEpxUjZwVU9lQjU0Q3VGUi9kS0Yza0JrRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTDFGdElsdkdTZnlTMkc1RndxZ3IrUFR5OEFXb0xPN1dLV3ZJdkhUSGtDND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlM2WDVmRGl6Q1Q5Z3BLQUNKeE9Ia3VQWk5BN2p0T3JteHNLVWNqR3BjTUl6bEpYK0g3RzFZM3dTS3NUZmo5MUtrSzUxQnpzbFphWDV0b3RMMFViamdBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTU4LCJhZHZTZWNyZXRLZXkiOiJQRURCN0wxL3VuSzdNYTBtc1J5a051VUY1Uk0vOVZlVE4vd3ZZUkwvVFpNPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJPeDBQYVdnWlFDLU9TaDF0dU5IRXp3IiwicGhvbmVJZCI6ImFhZTk1MWRhLTg5ZDItNDY1OS1hZTUzLTdlM2FlMDEzOGI1NCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCaElnNXJsRVhUSERHdnVNYzFCays0SGV0eFE9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ2pxay93TSsveURPb3luVStVNDdFc05PQzY0PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik41VEdITVhBIiwibWUiOnsiaWQiOiIyNTQ3OTkyMTEzNTc6NkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTldGcDhrSEVQUDZzNzhHR0E0Z0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQzN3L0RQUENyVGdqcDM2eVV1S1dBbmdLN0pRMWpRUHkvSDBOcHRHQXFrST0iLCJhY2NvdW50U2lnbmF0dXJlIjoiMHk3OEFFT2pMdThsWnlFcDY3MnNzbVNpWnRiNGZ6cjBjUmxNcVNLZTVBTlc5MWRXcnZEOHRwUkxzNjVNNy9GR3VwZ0JmQ2JacWp5a0YzVUszRUx0QkE9PSIsImRldmljZVNpZ25hdHVyZSI6Im1jVlc3OW5jajEwWEZVQlplc0lVcmlpU1BSb0ZDRUZVbXgwNUkvR0wrTG9CSTlPUHJGcVpaRFg4Y2VndHkwLzVzdVZkQjFVRFVoNktvd2IwV2puSWhnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0Nzk5MjExMzU3OjZAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUXQ4UHd6endxMDRJNmQrc2xMaWxnSjRDdXlVTlkwRDh2eDlEYWJSZ0twQyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0MzU4NDY0MSwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFHblkifQ==",
  PREFIX: process.env.PREFIX || ".",
  
  // Auto Features
  AUTO_STATUS_SEEN: parseBoolean(process.env.AUTO_STATUS_SEEN, true),
  AUTO_STATUS_REACT: parseBoolean(process.env.AUTO_STATUS_REACT, true),
  AUTO_STATUS_REPLY: parseBoolean(process.env.AUTO_STATUS_REPLY, false),
  AUTO_STATUS_REPLY_VOICE: parseBoolean(process.env.AUTO_STATUS_REPLY_VOICE, false),
  AUTO_STATUS_REPLY_VOICE_MULTI: parseBoolean(process.env.AUTO_STATUS_REPLY_VOICE_MULTI, false),
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || "*📍 Auto Status Seen Bot By CYBER-DEXTER-MD*",

  AUTO_DL: parseBoolean(process.env.AUTO_DL, false),
  AUTO_READ: parseBoolean(process.env.AUTO_READ, false),
  AUTO_TYPING: parseBoolean(process.env.AUTO_TYPING, false),
  AUTO_RECORDING: parseBoolean(process.env.AUTO_RECORDING, true),
  AUTO_STATUS_REACT: parseBoolean(process.env.AUTO_STATUS_REACT, false),
  ALWAYS_ONLINE: parseBoolean(process.env.ALWAYS_ONLINE, false),

  // Call Settings
  REJECT_CALL: parseBoolean(process.env.REJECT_CALL, false),

  // General Settings
  NOT_ALLOW: parseBoolean(process.env.NOT_ALLOW, true),
  MODE: process.env.MODE || "public",
  OWNER_NAME: process.env.OWNER_NAME || "✪⏤CYBER-DEXTER",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "94785274495",

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
