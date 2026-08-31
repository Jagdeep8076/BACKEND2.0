import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model .js";

import {
    generateResponseStream,
    generateChatTitle,
    getSourcesForMessage
} from "../services/ai.service.js";

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin:
                process.env.FRONTEND_URL ||
                "http://localhost:5173",
            credentials: true,
        },
    });

    console.log("Socket.io server is running");

    io.use((socket, next) => {
        try {
            const cookieHeader =
                socket.handshake.headers.cookie;

            if (!cookieHeader) {
                return next(
                    new Error("No authentication cookie")
                );
            }

            const cookies = {};

            cookieHeader
                .split(";")
                .forEach((item) => {
                    const [key, ...value] =
                        item.trim().split("=");

                    cookies[key] =
                        decodeURIComponent(
                            value.join("=")
                        );
                });

            const token = cookies.token;

            if (!token) {
                return next(
                    new Error("No token found")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.user = decoded;

            console.log(
                "SOCKET JWT VERIFIED:",
                decoded.id
            );

            next();

        } catch (error) {

            console.error(
                "SOCKET JWT ERROR:",
                error.message
            );

            next(
                new Error(
                    "Invalid or expired token"
                )
            );
        }
    });

    io.on("connection", (socket) => {

        console.log(
            "A User Connected:",
            socket.id,
            "User:",
            socket.user.id
        );

        socket.on(
            "chat:send",
            async ({ message, chatId }) => {

                try {

                    console.log(
                        "CHAT MESSAGE:",
                        message
                    );

                    if (
                        !message ||
                        !message.trim()
                    ) {

                        return socket.emit(
                            "chat:error",
                            {
                                message:
                                    "Message cannot be empty",
                            }
                        );
                    }

                    let chat;

                    if (!chatId) {

                        const title =
                            await generateChatTitle(
                                message
                            );

                        chat =
                            await chatModel.create({
                                user:
                                    socket.user.id,
                                title,
                            });

                    } else {

                        chat =
                            await chatModel.findOne({
                                _id: chatId,
                                user:
                                    socket.user.id,
                            });

                        if (!chat) {

                            return socket.emit(
                                "chat:error",
                                {
                                    message:
                                        "Chat not found",
                                }
                            );
                        }
                    }

                    await messageModel.create({
                        chat: chat._id,
                        content: message,
                        role: "user",
                    });

                    const messages =
                        await messageModel
                            .find({
                                chat: chat._id,
                            })
                            .sort({
                                createdAt: 1,
                            });

                    socket.emit(
                        "chat:start",
                        {
                            chatId:
                                chat._id.toString(),
                            title: chat.title,
                        }
                    );

                    let fullResponse = "";

                    for await (
                        const chunk of
                        generateResponseStream(
                            messages
                        )
                    ) {

                        if (!chunk) {
                            continue;
                        }

                        fullResponse += chunk;

                        socket.emit(
                            "chat:token",
                            {
                                chatId:
                                    chat._id.toString(),
                                token: chunk,
                            }
                        );
                    }

                    if (!fullResponse.trim()) {

                        throw new Error(
                            "AI returned an empty response"
                        );
                    }

                    const aiMessage =
                        await messageModel.create({
                            chat: chat._id,
                            content: fullResponse,
                            role: "ai",
                        });

                    const sources =
                        await getSourcesForMessage(
                            message
                        );

                    socket.emit(
                        "chat:complete",
                        {
                            chatId:
                                chat._id.toString(),

                            message: aiMessage,

                            sources
                        }
                    );

                    console.log(
                        "AI STREAM COMPLETED:",
                        chat._id.toString()
                    );

                    console.log(
                        "RAG SOURCES:",
                        sources
                    );

                } catch (error) {

                    console.error(
                        "CHAT STREAM ERROR:",
                        error
                    );

                    socket.emit(
                        "chat:error",
                        {
                            message:
                                error.message ||
                                "Something went wrong while generating the response.",
                        }
                    );
                }
            }
        );

        socket.on(
            "disconnect",
            (reason) => {

                console.log(
                    "A User Disconnected:",
                    socket.id,
                    reason
                );
            }
        );
    });
}

export function getIO() {

    if (!io) {

        throw new Error(
            "Socket.io not initialized"
        );
    }

    return io;
}