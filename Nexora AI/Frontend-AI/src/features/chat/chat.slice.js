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

        // ==========================================
        // CREATE NEW CHAT
        // ==========================================

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


        // ==========================================
        // ADD NORMAL MESSAGE
        // ==========================================

        addNewMessage: (state, action) => {

            const {
                chatId,
                content,
                role
            } = action.payload;

            // Safety check
            if (!state.chats[chatId]) {
                return;
            }

            state.chats[chatId].messages.push({
                content,
                role,
            });
        },


        // ==========================================
        // ADD MULTIPLE MESSAGES
        // ==========================================

        addMessages: (state, action) => {

            const {
                chatId,
                messages
            } = action.payload;

            // Safety check
            if (!state.chats[chatId]) {
                return;
            }

            state.chats[chatId]
                .messages
                .push(...messages);
        },


        // ==========================================
        // START AI STREAM
        // ==========================================

        startStreamingMessage: (
            state,
            action
        ) => {

            const { chatId } =
                action.payload;

            // Safety check
            if (!state.chats[chatId]) {
                return;
            }

            state.chats[chatId]
                .messages
                .push({
                    content: "",
                    role: "ai",
                });
        },


        // ==========================================
        // APPEND AI TOKEN
        // ==========================================

        appendStreamingToken: (
            state,
            action
        ) => {

            const {
                chatId,
                token
            } = action.payload;

            // Safety check
            if (!state.chats[chatId]) {
                return;
            }

            const messages =
                state.chats[chatId].messages;

            const lastMessage =
                messages[messages.length - 1];

            // Make sure last message is AI
            if (
                lastMessage &&
                lastMessage.role === "ai"
            ) {

                lastMessage.content += token;
            }
        },


        // ==========================================
        // FINISH STREAM
        // ==========================================

        finishStreamingMessage: (
            state,
            action
        ) => {

            const {
                chatId,
                content
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

            }
        },


        // ==========================================
        // SET CHATS
        // ==========================================

        setChats: (state, action) => {

            state.chats =
                action.payload;
        },


        // ==========================================
        // SET CURRENT CHAT
        // ==========================================

        setCurrentChatId: (
            state,
            action
        ) => {

            state.currentChatId =
                action.payload;
        },


        // ==========================================
        // LOADING
        // ==========================================

        setLoading: (
            state,
            action
        ) => {

            state.isLoading =
                action.payload;
        },


        // ==========================================
        // ERROR
        // ==========================================

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