import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model .js"


export async function sendMessage(req, res) {

    try {

        const { message, chatId } = req.body;

        let chat;
        let title = null;

        if (!chatId) {

            title = await generateChatTitle(message);

            chat = await chatModel.create({
                user: req.user.id,
                title
            });

        }

        else {

            chat = await chatModel.findOne({
                _id: chatId,
                user: req.user.id
            });

            if (!chat) {

                return res.status(404).json({
                    message: "Chat not found"
                });

            }

        }

        const userMessage = await messageModel.create({
            chat: chat._id,
            content: message,
            role: "user"
        });

        const messages = await messageModel
            .find({
                chat: chat._id
            })
            .sort({
                createdAt: 1
            });

        const result = await generateResponse(messages);

        const AIMessage = await messageModel.create({
            chat: chat._id,
            content: result,
            role: "ai"
        });

        res.status(201).json({

            message: "Message sent successfully",

            chat,

            title,

            aiMessage: AIMessage

        });

    } catch (error) {

        console.error("Send Message Error:", error);

        res.status(500).json({

            message: "Something went wrong",

            error: error.message

        });

    }

}


export async function getChats(req, res) {

    try {

        const user = req.user;

        const chats = await chatModel
            .find({
                user: user.id
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({

            message: "Chats Retrieved Successfully",

            chats

        });

    } catch (error) {

        console.error("Get Chats Error:", error);

        res.status(500).json({

            message: "Something went wrong",

            error: error.message

        });

    }

}


export async function getMessages(req, res) {

    try {

        const { chatId } = req.params;

        const chat = await chatModel.findOne({

            _id: chatId,

            user: req.user.id

        });

        if (!chat) {

            return res.status(404).json({

                message: "Chat not found"

            });

        }

        const messages = await messageModel
            .find({
                chat: chatId
            })
            .sort({
                createdAt: 1
            });

        res.status(200).json({

            message: "Chat Found Successfully",

            messages

        });

    } catch (error) {

        console.error("Get Messages Error:", error);

        res.status(500).json({

            message: "Something went wrong",

            error: error.message

        });

    }

}


export async function deleteChat(req, res) {

    try {

        const { chatId } = req.params;

        const chat = await chatModel.findOneAndDelete({

            _id: chatId,

            user: req.user.id

        });

        if (!chat) {

            return res.status(404).json({

                message: "Chat not found"

            });

        }

        await messageModel.deleteMany({

            chat: chatId

        });

        res.status(200).json({

            message: "Chat deleted successfully"

        });

    } catch (error) {

        console.error("Delete Chat Error:", error);

        res.status(500).json({

            message: "Something went wrong",

            error: error.message

        });

    }

}