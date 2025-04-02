const fs = require("fs");
require("dotenv").config();

const parseBoolean = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

const config = {
  // Session Configuration
  SESSION_ID: process.env.SESSION_ID || "CYBER-DEXTER-MD [KILL]>>>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT054NVhMK0JLeHZQVXJOdXIwWHB5ZFF3Z3hISklhbUhnQ3RwTG1Zc0MwQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMHBpemZrQ1daaXVnS0RhZFBqdWU1WlZPRndmanNSWEVUdCtBd29uelRGST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJVTFI4NEFnUC83c2ppejcyZlViWUdTU25JWHhqN0ZsbHBvWU41NUZQZVcwPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI3UnpzYStYWDZIVkppYVFVckFlVWhMcFJlWFR6MVpDNFBPbGw5YW9qbW5FPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFMSlN4SXB0NFlMTElYb1Iva1U4RkxMdFhCdzh1RVlXRmdTbTd5aHpSa2s9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpTU2lEaGpHWDluS3JpMzhVUHVHRUovd2VMMkFSdDYrekd2dmIvUkpkejA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNk14TFVVdXRpZHpTUExiZnZSOGxFamJudnd6S3hTN3IvUHBiMUVDdVBuZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0dKNWdCODA1eHkrRTdqaXp5U0pmOHZhZmVQcmFGQzZURlQ2eVRYdXB6dz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkhFOUJIQXQwSFZad09YdzR6T1hIbktFVVgxWGZwbHNpNzNWaDBhN2MrN0Rxd040KzYrSG1uSEpkcmNpYmdxWEVoK3lTTE53U0xPTGEwVG8vN0hhM0RnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NzQsImFkdlNlY3JldEtleSI6IjkvU2VXU1FJdFdQV0xsclc5a2xwUTVreEZuWTdYMVJUTk9pYTdZSjB3WE09IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IkYyQ2RSVWJhUlFPc3h3RTBYNTRFOFEiLCJwaG9uZUlkIjoiZmZlNmE3YTAtMTA2NS00YjBhLWI0MmEtNzFmNzFlYmEzN2U2IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkxIUHhmZ0ZGaldFN0pkM3VKN0x5QXdyeGcrZz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ6T21yb2M5RUtYTmxoTVBKaSsvaFQ1UEFWa3M9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiVjgzWUhGTTUiLCJtZSI6eyJpZCI6IjI1NDc5OTIxMTM1Nzo4QHMud2hhdHNhcHAubmV0In0sImFjY291bnQiOnsiZGV0YWlscyI6IkNOV0ZwOGtIRU5qNnRMOEdHQkFnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJDM3cvRFBQQ3JUZ2pwMzZ5VXVLV0FuZ0s3SlExalFQeS9IME5wdEdBcWtJPSIsImFjY291bnRTaWduYXR1cmUiOiIzUTVIcXZ5SE54bUNzc1R3YzgxcGdpdEFwdElnVVZjUkgzbWc0VGJwUDhYZ3g1WDNNZ0YvSnFJaDV3amJQejRUSS9nM0g5UUI3ODJZZ2hzL2hIOS9CZz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiVW5obnp2TTYranRNMDdEbkxWMS9xUElDb0hxOXhYQ2U3MXJwVnplZS9hR3ErVkFyVzdYUlFoZjRVa3FYM2NNU1Q2bEFqdHQ3bGZ6bnRjTG8xcUgrQmc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNTQ3OTkyMTEzNTc6OEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRdDhQd3p6d3EwNEk2ZCtzbExpbGdKNEN1eVVOWTBEOHZ4OURhYlJnS3BDIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzQzNjAwOTk3LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUduWiJ9",
  PREFIX: process.env.PREFIX || ".",
  
  // Auto Features
  AUTO_STATUS_SEEN: parseBoolean(process.env.AUTO_STATUS_SEEN, true),
  AUTO_STATUS_REACT: parseBoolean(process.env.AUTO_STATUS_REACT, true),
  AUTO_STATUS_REPLY: parseBoolean(process.env.AUTO_STATUS_REPLY, true),
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
