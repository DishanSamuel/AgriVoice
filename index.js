import express from "express";
import twilio from "twilio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AssemblyAI } from "assemblyai";
import "dotenv/config";

const app = express();
app.use(express.urlencoded({ extended: false }));

// Twilio Client Initialization
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const assemblyAiClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
const chatHistories = {};
const PUBLIC_URL = process.env.PUBLIC_URL;
const PORT = 4000;

// Generate Pre-Signed Recording URL
async function getRecordingUrl(recordingUrl) {
  try {
    // Extract the recording SID from the URL
    const recordingSid = recordingUrl.split('/').pop().split('?')[0];
    const recording = await twilioClient.recordings(recordingSid).fetch();
    console.log("Successfully fetched recording.");
    // Ensure the URL is complete
    return `https://api.twilio.com${recordingUrl}?Download=true`;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error.message);
    return null;
  }
}

// Incoming Call Handling
app.post("/voice", (req, res) => {
  const callSid = req.body.CallSid;
  chatHistories[callSid] = [];

  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say("Please say something after the beep.");
  twiml.record({
    timeout: 5,
    transcribe: false,
    action: "/recording-done",
    recordingStatusCallback: "/recording",
    recordingStatusCallbackEvent: ["completed"],
  });

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// Recording Handling
app.post("/recording", async (req, res) => {
  const callSid = req.body.CallSid;
  const recordingUrl = await getRecordingUrl(req.body.RecordingUrl);
  res.status(200).end();
  if (recordingUrl) processRecording(callSid, recordingUrl);
});

// Add a new route to handle the followup action
app.post("/followup", async (req, res) => {
  const callSid = req.body.CallSid;
  const digits = req.body.Digits;

  if (digits === "1") {
    // End the current call
    await twilioClient.calls(callSid).update({ status: "completed" });
    res.status(200).end();
  } else {
    // Handle other inputs if needed
    res.status(200).end();
  }
});

// Modify the processRecording function to make a callback after processing
async function processRecording(callSid, recordingUrl) {
  try {
    const transcript = await assemblyAiClient.transcripts.create({
      audio_url: recordingUrl
    });
    const gpt4Response = await generateResponse(transcript.text, callSid);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(gpt4Response);

    // Make a callback to the user
    const callbackTwiml = new twilio.twiml.VoiceResponse();
//   callbackTwiml.say("For versatility and ease of learning, Python is the best, but the ideal choice depends on the project: JavaScript for web, Swift for iOS, Kotlin for Android, and C++ for games.");
    callbackTwiml.say("You trial period is over. Please visit twilio for other plans")
//    callbackTwiml.say("The best crops to grow in summer in India are paddy (rice), maize, cotton, groundnut, and millets, as they thrive in the warm temperatures and monsoon rains.")
    console.log("Gemini Response:", gpt4Response);
    console.log("Callback TwiML:", callbackTwiml.toString());
    await twilioClient.calls.create({
      to: process.env.USER_PHONE_NUMBER, // Ensure this is set in your .env file
      from: process.env.TWILIO_PHONE_NUMBER, // Ensure this is set in your .env file
      twiml: callbackTwiml.toString()
    });
  } catch (error) {
    console.error("Failed to process recording", error);
  }
}

async function generateResponse(text, callSid) {
  chatHistories[callSid].push({ role: "user", content: text });
  try {
    const model = geminiClient.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(chatHistories[callSid].map(msg => msg.content).join("\n"));
    const reply = result.response.text();
    chatHistories[callSid].push({ role: "assistant", content: reply });
    return reply;
  } catch (error) {
    console.error("Error querying Gemini", error);
    return "I'm sorry, I couldn't process your request.";
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
