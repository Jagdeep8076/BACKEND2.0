import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {

    if (socket) {
        return socket;
    }

    socket = io(
        import.meta.env.VITE_API_URL,
        {
            withCredentials: true,
        }
    );

    socket.on("connect", () => {
        console.log(
            "Connected to Socket.IO server:",
            socket.id
        );
    });

    socket.on("disconnect", (reason) => {
        console.log(
            "Disconnected from Socket.IO server:",
            reason
        );
    });

    socket.on("connect_error", (error) => {
        console.error(
            "Socket connection error:",
            error.message
        );
    });

    return socket;
};


// ==========================================
// SEND CHAT MESSAGE
// ==========================================

export const sendMessageStream = ({
    message,
    chatId,
    onStart,
    onToken,
    onComplete,
    onError,
}) => {

    const socket =
        initializeSocketConnection();

    socket.on(
        "chat:start",
        onStart
    );

    socket.on(
        "chat:token",
        onToken
    );

    socket.on(
        "chat:complete",
        onComplete
    );

    socket.on(
        "chat:error",
        onError
    );

    socket.emit(
        "chat:send",
        {
            message,
            chatId,
        }
    );

    return () => {

        socket.off(
            "chat:start",
            onStart
        );

        socket.off(
            "chat:token",
            onToken
        );

        socket.off(
            "chat:complete",
            onComplete
        );

        socket.off(
            "chat:error",
            onError
        );
    };
};


// ==========================================
// DISCONNECT SOCKET
// ==========================================

export const disconnectSocket = () => {

    if (!socket) {
        return;
    }

    socket.disconnect();

    socket = null;
};