import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


   async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await sendMessage({
                message,
                chatId
            });

            console.log("SEND MESSAGE RESPONSE:", data);

            const { chat, aiMessage } = data;

            if (!chatId) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }));
            }

            dispatch(addNewMessage({
                chatId: chat._id,
                content: message,
                role: "user",
            }));

            dispatch(addNewMessage({
                chatId: chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }));

            dispatch(setCurrentChatId(chat._id));

        } catch (error) {
            console.error("Send Message Error:", error);

            dispatch(setError(
                error.response?.data?.message ||
                "Something went wrong while sending message"
            ));

        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await getChats();
            const { chats } = data;

            dispatch(setChats(
                chats.reduce((acc, chat) => {
                    acc[chat._id] = {
                        id: chat._id,
                        title: chat.title,
                        messages: [],
                        lastUpdated: chat.updatedAt,
                    };

                    return acc;
                }, {})
            ));

        } catch (error) {
            console.error("Get Chats Error:", error);

            dispatch(setError(
                error.response?.data?.message ||
                "Unable to load chats"
            ));

        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            console.log(
                "Messages already loaded:",
                chats[chatId]?.messages.length
            );

            if (chats[chatId]?.messages.length === 0) {
                dispatch(setLoading(true));

                const data = await getMessages(chatId);
                const { messages } = data;

                const formattedMessages = messages.map((msg) => ({
                    content: msg.content,
                    role: msg.role,
                }));

                dispatch(addMessages({
                    chatId,
                    messages: formattedMessages,
                }));
            }

            dispatch(setCurrentChatId(chatId));

        } catch (error) {
            console.error("Open Chat Error:", error);

            dispatch(setError(
                error.response?.data?.message ||
                "Unable to open chat"
            ));

        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    };
};