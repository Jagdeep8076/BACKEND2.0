import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import { ChatGroq} from "@langchain/groq";
import { ChatCerebras } from "@langchain/cerebras"
import { app_config } from "../config/config.js";

export const geminiModel = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: app_config.GOOGLE_API_KEY
});

export const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: app_config.MISTRAL_API_KEY
});

export const cohoreModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: app_config.COHERE_API_KEY
});
export const  groqModel = new ChatGroq({
    model: "openai/gpt-oss-20b",
    apiKey: app_config.GROQ_API_KEY
});
export const cerebrasModel = new ChatCerebras({
    model: "gpt-oss-120b",
    apiKey: app_config.CEREBRAS_API_KEY
});