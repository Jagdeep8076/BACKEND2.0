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

    function handleSendMessage({ message, chatId }) {

        dispatch(setLoading(true));
        dispatch(setError(null));

        if (chatId) {
            dispatch(addNewMessage({
                chatId,
                content: message,
                role: "user"
            }));
        }

        const cleanup = sendMessageStream({

            message,
            chatId,

            onStart: (data) => {

                console.log("CHAT START:", data);

                const newChatId = data.chatId;

                if (!chatId) {

                    dispatch(createNewChat({
                        chatId: newChatId,
                        title: data.title
                    }));

                    dispatch(addNewMessage({
                        chatId: newChatId,
                        content: message,
                        role: "user"
                    }));
                }

                dispatch(
                    setCurrentChatId(newChatId)
                );

                dispatch(
                    startStreamingMessage({
                        chatId: newChatId
                    })
                );
            },

            onToken: (data) => {

                console.log("AI TOKEN:", data.token);

                dispatch(
                    appendStreamingToken({
                        chatId: data.chatId,
                        token: data.token
                    })
                );
            },

            onComplete: (data) => {

    console.log("CHAT COMPLETE:", data);

    dispatch(
        finishStreamingMessage({
            chatId: data.chatId,
            content: data.message.content,
            sources: data.sources || []
        })
    );

    dispatch(
        setCurrentChatId(data.chatId)
    );

    dispatch(setLoading(false));

    cleanup();
},

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
                            lastUpdated: chat.updatedAt
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
                        role: msg.role
                    }));

                dispatch(
                    addMessages({
                        chatId,
                        messages: formattedMessages
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

        handleOpenChat
    };
};