import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({

    name: "chat",

    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },

    reducers: {

        createNewChat: (state, action) => {

            const { chatId, title } =
                action.payload;

            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated:
                    new Date().toISOString(),
            };
        },

        addNewMessage: (state, action) => {

            const {
                chatId,
                content,
                role,
                sources = []
            } = action.payload;

            if (!state.chats[chatId]) {
                return;
            }

            state.chats[chatId].messages.push({
                content,
                role,
                sources
            });
        },

        addMessages: (state, action) => {

            const {
                chatId,
                messages
            } = action.payload;

            if (!state.chats[chatId]) {
                return;
            }

            state.chats[chatId]
                .messages
                .push(...messages);
        },

        startStreamingMessage: (
            state,
            action
        ) => {

            const { chatId } =
                action.payload;

            if (!state.chats[chatId]) {
                return;
            }

            state.chats[chatId]
                .messages
                .push({
                    content: "",
                    role: "ai",
                    sources: []
                });
        },

        appendStreamingToken: (
            state,
            action
        ) => {

            const {
                chatId,
                token
            } = action.payload;

            if (!state.chats[chatId]) {
                return;
            }

            const messages =
                state.chats[chatId].messages;

            const lastMessage =
                messages[messages.length - 1];

            if (
                lastMessage &&
                lastMessage.role === "ai"
            ) {

                lastMessage.content += token;
            }
        },

        finishStreamingMessage: (
            state,
            action
        ) => {

            const {
                chatId,
                content,
                sources = []
            } = action.payload;

            if (!state.chats[chatId]) {
                return;
            }

            const messages =
                state.chats[chatId].messages;

            const lastMessage =
                messages[messages.length - 1];

            if (
                lastMessage &&
                lastMessage.role === "ai"
            ) {

                lastMessage.content =
                    content;

                lastMessage.sources =
                    sources;
            }
        },

        setChats: (state, action) => {

            state.chats =
                action.payload;
        },

        setCurrentChatId: (
            state,
            action
        ) => {

            state.currentChatId =
                action.payload;
        },

        setLoading: (
            state,
            action
        ) => {

            state.isLoading =
                action.payload;
        },

        setError: (
            state,
            action
        ) => {

            state.error =
                action.payload;
        },
    },
});

export const {
    setChats,
    setCurrentChatId,
    setLoading,
    setError,

    createNewChat,

    addNewMessage,
    addMessages,

    startStreamingMessage,
    appendStreamingToken,
    finishStreamingMessage,

} = chatSlice.actions;

export default chatSlice.reducer;