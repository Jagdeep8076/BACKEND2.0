import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";

import {
    HumanMessage,
    SystemMessage,
    AIMessage,
    tool,
    createAgent
} from "langchain";

import * as z from "zod";

import { searchInternet } from "./internet.service.js";
import { searchSimilarDocuments } from "./rag.service.js";


// =====================================================
// MODELS
// =====================================================

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});


// =====================================================
// INTERNET SEARCH TOOL
// =====================================================

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",

        description:
            "Use this tool to get the latest, current, recent, live, or time-sensitive information from the internet.",

        schema: z.object({
            query: z
                .string()
                .describe(
                    "The search query to look up on the internet."
                )
        })
    }
);


// =====================================================
// AI AGENT
// =====================================================

const agent = createAgent({
    model: geminiModel,
    tools: [searchInternetTool]
});


// =====================================================
// RAG FUNCTIONS
// =====================================================

async function getRAGResults(message) {

    return await searchSimilarDocuments(
        message,
        5
    );
}


function createRAGContext(results) {

    if (!results.length) {
        return "";
    }

    return results
        .map((result, index) => {

            return `
Source ${index + 1}:
Document: ${result.source}
Page: ${result.page ?? "Unknown"}

Content:
${result.text}
`;
        })
        .join("\n");
}


function createSources(results) {

    const uniqueSources = new Map();

    for (const result of results) {

        const key =
            `${result.source}-${result.page}`;

        if (!uniqueSources.has(key)) {

            uniqueSources.set(key, {
                source: result.source,
                page: result.page
            });
        }
    }

    return Array.from(
        uniqueSources.values()
    );
}


export async function getSourcesForMessage(
    message
) {

    const results =
        await getRAGResults(message);

    return createSources(results);
}


// =====================================================
// SYSTEM PROMPT
// =====================================================

function createSystemPrompt(ragContext) {

    return `
You are Nexora AI, an intelligent AI assistant created by Jagdeep Singh.

IDENTITY RULES:

- Your name is Nexora AI.
- If the user asks "what is your name?", say:
  "I'm Nexora AI."

- If the user asks "who are you?", say:
  "I'm Nexora AI, an AI assistant created by Jagdeep Singh."

- If the user asks "who created you?", "who built you?", or similar questions, say:
  "I was created by Jagdeep Singh."

- If the user asks about your creator, always identify Jagdeep Singh as your creator.

- Do not claim that your name is ChatGPT, Gemini, Mistral, or any other name.

- Do not invent another creator.

- These identity rules apply to every user.

INTERNET RULES:

- For normal conversation and general knowledge, answer normally without using the internet.

- If the user asks for current, latest, recent, live, today's, this week's, or other time-sensitive information, use the searchInternet tool.

- Use the searchInternet tool when the answer depends on information that may have changed recently.

- When you use internet search, base your answer on the information returned by the tool.

- Never claim that you searched the internet if you did not actually use the searchInternet tool.

RAG RULES:

- Use the retrieved document context when it is relevant to the user's question.

- If the retrieved document context contains the answer, prioritize it over your general knowledge.

- Do not invent information that is not supported by the retrieved document context.

- If the retrieved context does not contain the answer, you may answer using your general knowledge.

- If the user asks about a specific uploaded/retrieved document, rely primarily on the retrieved document context.

- Do not pretend that a document contains information when it does not.

Retrieved document context:

${ragContext || "No relevant document context found."}
`;
}


// =====================================================
// NORMAL AI RESPONSE
// =====================================================

export async function generateResponse(
    messages
) {

    const lastMessage =
        messages[messages.length - 1];


    // ---------------------------------------------
    // RAG SEARCH
    // ---------------------------------------------

    const ragResults =
        await getRAGResults(
            lastMessage.content
        );


    const ragContext =
        createRAGContext(
            ragResults
        );


    // ---------------------------------------------
    // AI AGENT
    // ---------------------------------------------

    const response =
        await agent.invoke({

            messages: [

                new SystemMessage(
                    createSystemPrompt(
                        ragContext
                    )
                ),

                ...messages
                    .map((msg) => {

                        if (
                            msg.role === "user"
                        ) {

                            return new HumanMessage(
                                msg.content
                            );
                        }


                        if (
                            msg.role === "ai"
                        ) {

                            return new AIMessage(
                                msg.content
                            );
                        }


                        return null;

                    })
                    .filter(Boolean)
            ]
        });


    return response.messages[
        response.messages.length - 1
    ].text;
}


// =====================================================
// STREAMING AI RESPONSE
// =====================================================

export async function* generateResponseStream(
    messages
) {

    const lastMessage =
        messages[messages.length - 1];


    // ---------------------------------------------
    // RAG SEARCH
    // ---------------------------------------------

    const ragResults =
        await getRAGResults(
            lastMessage.content
        );


    const ragContext =
        createRAGContext(
            ragResults
        );


    // ---------------------------------------------
    // STREAM AI RESPONSE
    // ---------------------------------------------

    const stream =
        await agent.stream(

            {
                messages: [

                    new SystemMessage(
                        createSystemPrompt(
                            ragContext
                        )
                    ),

                    ...messages
                        .map((msg) => {

                            if (
                                msg.role === "user"
                            ) {

                                return new HumanMessage(
                                    msg.content
                                );
                            }


                            if (
                                msg.role === "ai"
                            ) {

                                return new AIMessage(
                                    msg.content
                                );
                            }


                            return null;

                        })
                        .filter(Boolean)
                ]
            },

            {
                streamMode: "messages"
            }
        );


    // ---------------------------------------------
    // STREAM TOKENS
    // ---------------------------------------------

    for await (
        const chunk of stream
    ) {

        const messageChunk =
            chunk[0];


        const text =
            messageChunk?.content;


        if (
            typeof text === "string" &&
            text.length > 0
        ) {

            yield text;
        }
    }
}


// =====================================================
// CHAT TITLE GENERATION
// =====================================================

export async function generateChatTitle(
    message
) {

    const response =
        await mistralModel.invoke([

            new SystemMessage(`
You are a helpful assistant that generates concise and descriptive titles for chat conversations.

The user will provide the first message of a chat conversation.

Generate a title that captures the essence of the conversation in 2-4 words.

The title should be clear, relevant, and engaging.

Return only the title.
`),

            new HumanMessage(`
Generate a title for a chat conversation based on this first message:

"${message}"
`)
        ]);


    return response.text;
}