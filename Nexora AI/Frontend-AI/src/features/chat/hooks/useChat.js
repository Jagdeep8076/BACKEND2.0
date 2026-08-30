import {
    initializeSocketConnection,
    disconnectSocket,
    sendMessageStream
} from "../service/chat.socket";

import {
    getChats,
    getMessages,
    deleteChat
} from "../service/chat.api";

import {
    setChats,
    setCurrentChatId,
    setError,
    setLoading,
    createNewChat,
    addNewMessage,
    addMessages,
    startStreamingMessage,
    appendStreamingToken,
    finishStreamingMessage
} from "../chat.slice";

import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch();


    // ==========================================
    // SEND MESSAGE WITH STREAMING
    // ==========================================

    function handleSendMessage({ message, chatId }) {

        dispatch(setLoading(true));
        dispatch(setError(null));

        // User message immediately UI mein show karo
        if (chatId) {

            dispatch(addNewMessage({
                chatId,
                content: message,
                role: "user",
            }));

        }


        const cleanup = sendMessageStream({

            message,
            chatId,


            // ==================================
            // CHAT START
            // ==================================

            onStart: (data) => {

                console.log(
                    "CHAT START:",
                    data
                );

                const newChatId = data.chatId;


                // New chat create hua
                if (!chatId) {

                    dispatch(createNewChat({
                        chatId: newChatId,
                        title: data.title,
                    }));


                    dispatch(addNewMessage({
                        chatId: newChatId,
                        content: message,
                        role: "user",
                    }));
                }


                dispatch(
                    setCurrentChatId(newChatId)
                );
            },


            // ==================================
            // AI TOKEN
            // ==================================

            onToken: (data) => {

                console.log(
                    "AI TOKEN:",
                    data.token
                );

                // TODO:
                // Next step mein Redux ke andar
                // streaming message update karenge.

            },


            // ==================================
            // CHAT COMPLETE
            // ==================================

            onComplete: (data) => {

                console.log(
                    "CHAT COMPLETE:",
                    data
                );


                dispatch(addNewMessage({
                    chatId: data.chatId,
                    content: data.message.content,
                    role: "ai",
                }));


                dispatch(
                    setCurrentChatId(data.chatId)
                );

                dispatch(setLoading(false));

                cleanup();
            },


            // ==================================
            // CHAT ERROR
            // ==================================

            onError: (error) => {

                console.error(
                    "Socket Chat Error:",
                    error
                );

                dispatch(
                    setError(
                        error?.message ||
                        "Something went wrong while sending message"
                    )
                );

                dispatch(setLoading(false));

                cleanup();
            }
        });
    }


    // ==========================================
    // GET CHATS
    // ==========================================

    async function handleGetChats() {

        try {

            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await getChats();

            const { chats } = data;

            dispatch(
                setChats(
                    chats.reduce((acc, chat) => {

                        acc[chat._id] = {
                            id: chat._id,
                            title: chat.title,
                            messages: [],
                            lastUpdated: chat.updatedAt,
                        };

                        return acc;

                    }, {})
                )
            );

        } catch (error) {

            console.error(
                "Get Chats Error:",
                error
            );

            dispatch(
                setError(
                    error.response?.data?.message ||
                    "Unable to load chats"
                )
            );

        } finally {

            dispatch(setLoading(false));
        }
    }


    // ==========================================
    // OPEN CHAT
    // ==========================================

    async function handleOpenChat(
        chatId,
        chats
    ) {

        try {

            console.log(
                "Messages already loaded:",
                chats[chatId]?.messages.length
            );


            if (
                chats[chatId]?.messages.length === 0
            ) {

                dispatch(setLoading(true));

                const data =
                    await getMessages(chatId);

                const { messages } = data;


                const formattedMessages =
                    messages.map((msg) => ({
                        content: msg.content,
                        role: msg.role,
                    }));


                dispatch(
                    addMessages({
                        chatId,
                        messages:
                            formattedMessages,
                    })
                );
            }


            dispatch(
                setCurrentChatId(chatId)
            );

        } catch (error) {

            console.error(
                "Open Chat Error:",
                error
            );

            dispatch(
                setError(
                    error.response?.data?.message ||
                    "Unable to open chat"
                )
            );

        } finally {

            dispatch(setLoading(false));
        }
    }


    return {

        initializeSocketConnection,

        disconnectSocket,

        handleSendMessage,

        handleGetChats,

        handleOpenChat,
    };
};