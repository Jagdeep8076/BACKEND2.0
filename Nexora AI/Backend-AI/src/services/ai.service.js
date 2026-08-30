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

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description:
            "Use this tool to get the latest information from the internet",
        schema: z.object({
            query: z
                .string()
                .describe(
                    "The search query to look up on the internet."
                )
        })
    }
);

const agent = createAgent({
    model: geminiModel,
    tools: [searchInternetTool]
});

async function getRAGContext(message) {
    const results = await searchSimilarDocuments(message, 5);

    if (!results.length) {
        return "";
    }

    return results
        .map((result) => result.metadata?.text)
        .filter(Boolean)
        .join("\n\n");
}

export async function generateResponse(messages) {
    const lastMessage =
        messages[messages.length - 1];

    const ragContext = await getRAGContext(
        lastMessage.content
    );

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
You are a helpful and precise assistant.

Use the retrieved document context when it is relevant to the user's question.

Do not invent information that is not supported by the retrieved context.

If the retrieved context does not contain the answer, you may answer using your general knowledge.

If the question requires up-to-date information, use the searchInternet tool.

Retrieved document context:

${ragContext || "No relevant document context found."}
`),

            ...messages
                .map((msg) => {
                    if (msg.role === "user") {
                        return new HumanMessage(msg.content);
                    }

                    if (msg.role === "ai") {
                        return new AIMessage(msg.content);
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

export async function* generateResponseStream(messages) {
    const lastMessage =
        messages[messages.length - 1];

    const ragContext = await getRAGContext(
        lastMessage.content
    );

    const stream = await agent.stream(
        {
            messages: [
                new SystemMessage(`
You are a helpful and precise assistant.

Use the retrieved document context when it is relevant to the user's question.

Do not invent information that is not supported by the retrieved context.

If the retrieved context does not contain the answer, you may answer using your general knowledge.

If the question requires up-to-date information, use the searchInternet tool.

Retrieved document context:

${ragContext || "No relevant document context found."}
`),

                ...messages
                    .map((msg) => {
                        if (msg.role === "user") {
                            return new HumanMessage(
                                msg.content
                            );
                        }

                        if (msg.role === "ai") {
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

    for await (const chunk of stream) {
        const messageChunk = chunk[0];

        const text = messageChunk?.content;

        if (
            typeof text === "string" &&
            text.length > 0
        ) {
            yield text;
        }
    }
}

export async function generateChatTitle(message) {
    const response =
        await mistralModel.invoke([
            new SystemMessage(`
You are a helpful assistant that generates concise and descriptive titles for chat conversations.

The user will provide the first message of a chat conversation.

Generate a title that captures the essence of the conversation in 2-4 words.

The title should be clear, relevant, and engaging.
`),

            new HumanMessage(`
Generate a title for a chat conversation based on this first message:

"${message}"
`)
        ]);

    return response.text;
}