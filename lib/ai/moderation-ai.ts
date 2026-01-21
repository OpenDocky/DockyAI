// lib/ai/moderation-ai.ts
import { generateText } from "ai";
import { getLanguageModel } from "./providers";
import { moderationPrompt } from "./prompts";
import { ChatSDKError } from "@/lib/errors";

const MODERATION_MODEL_NAME = "meta-llama/Llama-3.1-8B-Instruct"; // Use a suitable Hugging Face model for moderation

export async function checkMessageWithAI(messageText: string): Promise<boolean> {
  try {
    const { text: moderationResult } = await generateText({
      model: getLanguageModel(MODERATION_MODEL_NAME), // Use a dedicated model for moderation if available, or the general one.
      prompt: moderationPrompt({ message: messageText }),
      temperature: 0, // Keep temperature low for deterministic responses
    });

    const parsedResult = moderationResult.trim().toUpperCase();

    if (parsedResult === "UNSAFE") {
      return true; // Message is unsafe
    } else if (parsedResult === "SAFE") {
      return false; // Message is safe
    } else {
      // Handle unexpected responses from the moderation AI
      console.warn("Moderation AI returned an unexpected response:", moderationResult);
      // For safety, if response is unclear, we might choose to treat as unsafe or log for review.
      // For now, let's treat unclear as safe to avoid false positives, but log it.
      return false; 
    }
  } catch (error) {
    console.error("Error during AI moderation check:", error);
    // If the moderation AI itself fails, what should we do?
    // For now, let's throw an error indicating a moderation service issue,
    // which the main API route can catch and handle.
    throw new ChatSDKError("offline:chat", "Failed to perform AI moderation check");
  }
}
