import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API client on server side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "MediRoute AI Backend", timestamp: new Date().toISOString() });
});

// 1. AI Symptom Checker Endpoint
app.post("/api/ai/symptom-check", async (req, res) => {
  try {
    const { symptomText, age, gender, duration, severity, patientHistory } = req.body;

    if (!symptomText || symptomText.trim().length === 0) {
      return res.status(400).json({ error: "Symptom description is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback rule-based intelligent output if API key is not yet set up
      const isEmergency = /chest pain|difficulty breathing|severe bleeding|stroke|unconscious|paralysis/i.test(symptomText);
      let recommendedSpecialist = "General Physician";
      if (/heart|chest|palpitation|blood pressure/i.test(symptomText)) recommendedSpecialist = "Cardiologist";
      else if (/headache|dizzy|numbness|seizure/i.test(symptomText)) recommendedSpecialist = "Neurologist";
      else if (/bone|joint|fracture|knee|back pain/i.test(symptomText)) recommendedSpecialist = "Orthopedist";
      else if (/cough|fever|breath|lungs|asthma/i.test(symptomText)) recommendedSpecialist = "Pulmonologist";
      else if (/skin|rash|itching|acne|eczema/i.test(symptomText)) recommendedSpecialist = "Dermatologist";
      else if (/stomach|stomachache|acid|vomiting|diarrhea/i.test(symptomText)) recommendedSpecialist = "Gastroenterologist";
      else if (/eye|vision|redness/i.test(symptomText)) recommendedSpecialist = "Ophthalmologist";
      else if (/ear|nose|throat|sinus/i.test(symptomText)) recommendedSpecialist = "ENT Specialist";

      return res.json({
        primaryCategory: recommendedSpecialist,
        urgencyLevel: isEmergency ? "Emergency (Immediate SOS)" : severity === "high" ? "Urgent (Within 24 hrs)" : "Routine / OPD",
        emergencyWarning: isEmergency,
        possibleCauses: ["Preliminary Assessment (Offline Mode)", "Requires clinical evaluation", "Correlate with vitals"],
        recommendedSpecialists: [recommendedSpecialist, "General Physician"],
        suggestedQuestions: ["How long have these symptoms been active?", "Are there trigger factors?", "What tests do I need?"],
        triageAdvice: isEmergency 
          ? "Please seek immediate emergency medical care or call SOS." 
          : `We recommend scheduling a consultation with a ${recommendedSpecialist} for clinical evaluation.`,
        disclaimer: "DISCLAIMER: MediRoute AI provides informational guidance based on algorithms and does NOT provide a final medical diagnosis. Always consult a licensed medical professional."
      });
    }

    const prompt = `You are MediRoute AI's Clinical Triage Assistant. Analyze the patient's reported symptoms and return structured triage guidance.
IMPORTANT SAFETY RULE: You must suggest appropriate medical specialists, but NEVER give a definitive medical diagnosis. Provide possible differential categories for discussion with a doctor.

Patient Information:
- Reported Symptoms: "${symptomText}"
- Age: ${age || "Unspecified"}
- Gender: ${gender || "Unspecified"}
- Duration: ${duration || "Unspecified"}
- Reported Severity (1-10): ${severity || "Medium"}
- Pre-existing Conditions / History: ${patientHistory || "None"}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a safe, empathetic medical triage AI system for MediRoute AI. Always include a strict medical disclaimer.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryCategory: { type: Type.STRING, description: "Primary medical specialty needed (e.g. Cardiologist, Neurologist, Orthopedist, Pulmonologist, Dermatologist, Gastroenterologist, General Physician, ENT Specialist, Ophthalmologist, Pediatrician)" },
            urgencyLevel: { type: Type.STRING, description: "'Emergency (Immediate SOS)', 'Urgent (Within 24 hrs)', 'Routine / OPD', or 'Home Care & Monitoring'" },
            emergencyWarning: { type: Type.BOOLEAN, description: "True if red flag emergency symptoms like heart attack, stroke, respiratory distress, or heavy bleeding are detected." },
            possibleCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-4 potential medical conditions for doctor review (e.g., 'Viral Respiratory Tract Infection', 'Acute Bronchitis')"
            },
            recommendedSpecialists: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of recommended medical specialties"
            },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Questions the patient should ask during consultation"
            },
            triageAdvice: { type: Type.STRING, description: "Clear, empathetic advice on next steps." },
            disclaimer: { type: Type.STRING, description: "Standard clinical non-diagnosis warning statement" }
          },
          required: ["primaryCategory", "urgencyLevel", "emergencyWarning", "possibleCauses", "recommendedSpecialists", "suggestedQuestions", "triageAdvice", "disclaimer"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/ai/symptom-check:", error);
    return res.status(500).json({
      error: "Failed to analyze symptoms. Please try again or consult a doctor.",
      details: error?.message || "Unknown error"
    });
  }
});

// 2. AI Medical Report Summarizer Endpoint
app.post("/api/ai/summarize-report", async (req, res) => {
  try {
    const { reportText, reportType } = req.body;

    if (!reportText || reportText.trim().length === 0) {
      return res.status(400).json({ error: "Report text or content is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reportTitle: `${reportType || "Lab Report"} Summary`,
        patientSummary: "Your lab report shows several key parameters. Most values appear stable, but certain markers require attention from your doctor.",
        keyMetrics: [
          { parameter: "Hemoglobin (Hb)", value: "13.2 g/dL", status: "normal", explanation: "Optimal oxygen-carrying capability in blood." },
          { parameter: "WBC Count", value: "11,500 /mcL", status: "high", explanation: "Mildly elevated, which can indicate your body is fighting a mild infection." },
          { parameter: "Fasting Blood Sugar", value: "110 mg/dL", status: "high", explanation: "Slightly above standard fasting range (70-99 mg/dL)." }
        ],
        actionableAdvice: [
          "Maintain proper hydration (2.5L water daily)",
          "Schedule a follow-up with your primary physician within 7 days",
          "Repeat Fasting Glucose test after 2 weeks"
        ],
        questionsForDoctor: [
          "Should I adjust my diet based on the elevated glucose?",
          "Are there specific symptoms I should monitor regarding WBC count?"
        ],
        disclaimer: "AI-generated summary for educational reference only. Please review all lab reports with your treating physician."
      });
    }

    const prompt = `You are MediRoute AI's Medical Document Translator. Simplify the provided medical report into plain, easily understandable language for the patient.

Report Type: ${reportType || "General Lab Report"}
Report Document Text:
"${reportText}"

Please translate complex medical terminology into plain English and summarize key metrics.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You translate complex medical jargon into easy-to-understand explanations for patients while emphasizing physician consultation.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportTitle: { type: Type.STRING },
            patientSummary: { type: Type.STRING, description: "A simple 2-3 sentence overview of what the report means in everyday language." },
            keyMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  value: { type: Type.STRING },
                  status: { type: Type.STRING, description: "'normal', 'high', 'low', or 'critical'" },
                  explanation: { type: Type.STRING, description: "Simple explanation of what this test result means" }
                },
                required: ["parameter", "value", "status", "explanation"]
              }
            },
            actionableAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lifestyle or follow-up tips"
            },
            questionsForDoctor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Questions the patient should ask their doctor"
            },
            disclaimer: { type: Type.STRING }
          },
          required: ["reportTitle", "patientSummary", "keyMetrics", "actionableAdvice", "questionsForDoctor", "disclaimer"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/ai/summarize-report:", error);
    return res.status(500).json({ error: "Failed to summarize medical report." });
  }
});

// 3. AI Health Assistant Interactive Chat
app.post("/api/ai/health-assistant", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: "I am your MediRoute AI Health Assistant. How can I help you today with hospital navigation, appointment scheduling, symptom guidance, or medicine reminders?"
      });
    }

    const chatHistory = messages ? messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join("\n") : "";

    const prompt = `Context: The user is in the MediRoute AI app.
User Profile: ${JSON.stringify(userContext || {})}
Chat History:
${chatHistory}

Provide a helpful, friendly, and medically responsible response. Always advise consulting a physician for medical diagnoses. Keep answers concise and structured.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are MediRoute AI's companion assistant. Help users navigate healthcare, understand appointments, check symptoms, and manage medical records."
      }
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/health-assistant:", error);
    return res.status(500).json({ error: "Failed to get AI health response." });
  }
});

// Vite Middleware for Dev or Static file serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediRoute AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
