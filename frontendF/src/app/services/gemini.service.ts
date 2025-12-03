import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  
  constructor() {
    
    if (!environment.geminiApiKey || environment.geminiApiKey === 'AIzaSyC7twBIdfq31Hiy3uo9gDYXDeNN9T8DBRw') {
        console.error("Gemini API Key is missing or default! Check environment.ts");
    }
    this.ai = new GoogleGenAI({ 
      apiKey: environment.geminiApiKey 
    });
  }

  generateRecommendation(userSelfAssessment: string): Observable<string> {
    
    const systemInstruction = 
      "You are a supportive, non-clinical AI mentor. Based on the user's self-assessment, provide general, constructive, and encouraging advice for improving their mental state. The response must be encouraging, non-diagnostic, and offer 3-4 specific, actionable, non-medical steps (like deep breathing, specific exercise, or journaling prompts), keep it short and so general and limit it to 10 lines.";

    const fullPrompt = `User Self-Assessment: "${userSelfAssessment}"`;

    const apiCallPromise = this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return from(apiCallPromise).pipe(
      map((response: GenerateContentResponse) => {
       
        const textResult = response.text ?? 
                           "I'm sorry, I couldn't generate a text response for that input. Please rephrase or check your safety settings.";
        
        return textResult;
      })
    );
  }
}