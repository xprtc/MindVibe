import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyPlan = async (
  subject: string,
  topic: string,
  examDate: string,
  materialsContext: string,
  contentTypes: string[]
): Promise<string> => {
  try {
    // Determine prompt instructions based on selected content types
    let contentInstructions = "";

    if (contentTypes.includes('plan')) {
      contentInstructions += `
      ### 1. 📅 Strukturierter Zeitplan (Study Plan)
      - Calculate the days remaining until ${examDate}.
      - Create a table or list dividing the time into phases: "Lernen" (Learning), "Wiederholen" (Repetition), and "Üben" (Practice).
      - Assign specific sub-topics from the context to these days.
      `;
    }

    if (contentTypes.includes('solutions_practice')) {
      contentInstructions += `
      ### 2. ✅ Lösungen & Übungsaufgaben (Solutions & Practice)
      - **TASK 1:** Identify any questions or problem sets in the provided "Materials Context". Solve them step-by-step with clear explanations.
      - **TASK 2:** For every identified problem type, generate **3 NEW similar practice problems** (3x multiplication of tasks) so the student can practice the pattern. Provide the answers to these new problems at the very end of this section hidden behind a "Spoiler" warning or separated clearly.
      `;
    }

    if (contentTypes.includes('summary')) {
      contentInstructions += `
      ### 3. 📖 Deep Dive Zusammenfassung (NotebookLM Style)
      - Provide a comprehensive, structured summary of the material.
      - Use headers, bullet points, and bold text for key terms.
      - Explain complex concepts simply (Feynman technique).
      `;
    }

    if (contentTypes.includes('flashcards')) {
      contentInstructions += `
      ### 4. 🃏 Lernkarten (Flashcards)
      - Generate a list of 10-15 Question/Answer pairs suitable for Anki or Quizlet.
      - Format: Q: [Question] | A: [Answer]
      `;
    }

    if (contentTypes.includes('audio_script')) {
      contentInstructions += `
      ### 5. 🎙 Audio-Guide Skript
      - Write a script for a 5-minute podcast episode explaining this topic.
      - Two hosts: "Host" (Main explainer) and "Guest" (Curious learner asking questions).
      - Make it conversational and engaging (Learn About style).
      `;
    }

    if (contentTypes.includes('mock_exam')) {
      contentInstructions += `
      ### 6. 🎓 Test-Simulation (Mock Exam)
      - Create a mock exam with multiple-choice questions and short-answer questions.
      - Include a grading rubric (points per question).
      `;
    }

    const prompt = `
      You are an elite AI tutor for the MindVibe app.
      
      **Metadata:**
      - Subject: "${subject}"
      - Exam Title: "${topic}"
      - Exam Date: ${examDate}
      - Current Date: ${new Date().toISOString().split('T')[0]}

      **User Materials (Context):**
      """
      ${materialsContext}
      """

      **Your Mission:**
      Generate a study output based strictly on the selected modules below. Use German language. Format nicely with Markdown.

      ${contentInstructions}
      
      If no specific tasks were found in the materials for the "Solutions" section, generate generic practice problems based on the topic topic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Konnte keinen Lernplan generieren. Bitte versuche es erneut.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ein Fehler ist bei der Generierung aufgetreten. Bitte überprüfe deine Internetverbindung.";
  }
};

export const analyzeExamNotes = async (notes: string): Promise<string> => {
  try {
     const prompt = `
      Analyze the following student notes and suggest 3 key areas where they might be missing information or where clarification is often needed for this topic:
      
      "${notes}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not analyze notes.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while analyzing notes.";
  }
}