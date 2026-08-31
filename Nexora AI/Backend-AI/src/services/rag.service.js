import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index(
    process.env.PINECONE_INDEX_NAME,
    process.env.PINECONE_INDEX_HOST
);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function createEmbedding(text) {
    const result = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: {
            outputDimensionality: 1024,
        },
    });

    return result.embeddings[0].values;
}

export async function searchSimilarDocuments(query, topK = 5) {

    const queryVector = await createEmbedding(query);

    const result = await index.query({
        vector: queryVector,
        topK,
        includeMetadata: true,
    });

    return (result.matches || []).map((match) => ({
        score: match.score,
        text: match.metadata?.text || "",
        source: match.metadata?.source || "Unknown source",
        page: match.metadata?.page || null,
        chunkId: match.metadata?.chunkId || match.id,
    }));
}