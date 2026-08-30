import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {

    if (socket) {
        return socket;
    }

    socket = io("http://localhost:3000", {
        withCredentials: true,
    });

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

    const socket = initializeSocketConnection();

    // Chat started
    socket.on("chat:start", onStart);

    // AI token received
    socket.on("chat:token", onToken);

    // AI response completed
    socket.on("chat:complete", onComplete);

    // Error
    socket.on("chat:error", onError);

    // Send message to backend
    socket.emit("chat:send", {
        message,
        chatId,
    });

    // Cleanup listeners
    return () => {

        socket.off("chat:start", onStart);
        socket.off("chat:token", onToken);
        socket.off("chat:complete", onComplete);
        socket.off("chat:error", onError);
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