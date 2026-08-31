import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../../auth/hook/useAuth.js";
import { dashboardAnimation } from "../../../Animations/Dashboard.animation.js";
import { setCurrentChatId } from "../chat.slice";
import { deleteChat } from "../service/chat.api";

const Dashboard = () => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const chat = useChat();
  const { handleLogout } = useAuth();

  const { user } = useSelector((state) => state.auth);

  const chats = useSelector((state) => state.chat.chats);

  const currentChatId = useSelector(
    (state) => state.chat.currentChatId
  );

  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    chat.initializeSocketConnection();

    chat.handleGetChats();

    const cleanup = dashboardAnimation(containerRef);

    return () => {
      cleanup?.();
      chat.disconnectSocket();
    };
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
    });

    setChatInput("");
  };

  const handleNewChat = () => {
    setChatInput("");
    dispatch(setCurrentChatId(null));
  };

  const handleOpenChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  const handleDeleteChat = async (chatId, event) => {
    event.stopPropagation();

    try {
      await deleteChat(chatId);

      if (currentChatId === chatId) {
        dispatch(setCurrentChatId(null));
      }

      await chat.handleGetChats();
    } catch (error) {
      console.error("Delete Chat Error:", error);
    }
  };

  const chatList = Object.values(chats || {});

  const currentChat = chats?.[currentChatId];

  const messages = currentChat?.messages || [];

  return (
    <main
      ref={containerRef}
      className="relative flex h-screen w-full overflow-hidden bg-[#030712] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

      <aside className="dashboard-sidebar relative z-20 flex h-full w-[270px] shrink-0 flex-col border-r border-white/[0.07] bg-[#050b14]/90 backdrop-blur-2xl">
        <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/[0.06] px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <span className="text-lg font-bold text-cyan-300">
              N
            </span>
          </div>

          <div>
            <h1 className="text-lg font-semibold">
              Nexora
              <span className="text-cyan-400">AI</span>
            </h1>

            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-600">
              Intelligent Workspace
            </p>
          </div>
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex w-full items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-3 text-sm text-gray-200 transition hover:bg-cyan-400/10"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-lg text-cyan-300">
              +
            </span>

            New Chat
          </button>
        </div>

        <nav className="px-3">
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.25em] text-gray-600">
            Workspace
          </p>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg bg-white/[0.06] px-3 py-2.5 text-sm text-white"
          >
            <span className="text-cyan-400">◉</span>
            Dashboard
          </button>
        </nav>

        <div className="mt-7 flex-1 overflow-y-auto px-3">
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.25em] text-gray-600">
            Recent Chats
          </p>

          <div className="space-y-1">
            {chatList.map((chatItem) => (
              <div
                key={chatItem.id}
                className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                  currentChatId === chatItem.id
                    ? "bg-white/[0.07] text-white"
                    : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleOpenChat(chatItem.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="text-xs text-gray-700">
                    ◇
                  </span>

                  <span className="truncate">
                    {chatItem.title}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={(event) =>
                    handleDeleteChat(chatItem.id, event)
                  }
                  className="shrink-0 rounded-md px-2 py-1 text-xs text-gray-600 opacity-0 transition hover:bg-red-400/10 hover:text-red-400 group-hover:opacity-100"
                  title="Delete chat"
                >
                  ×
                </button>
              </div>
            ))}

            {!chatList.length && (
              <p className="px-3 py-2 text-xs text-gray-700">
                No recent chats
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-200">
                {user?.username || "User"}
              </p>

              <p className="text-[10px] uppercase tracking-wider text-gray-600">
                Free Plan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-left text-sm text-gray-400 transition hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </aside>

      <section className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="dashboard-topbar flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#030712]/60 px-5 backdrop-blur-xl md:px-8">
          <div className="text-sm text-gray-500">
            Workspace
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-300">
              Dashboard
            </span>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 md:px-10 lg:py-14">
            <div className="dashboard-greeting mb-10">
              <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-cyan-400">
                Intelligent Workspace
              </p>

              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                How can I help you
                <span className="text-cyan-400">
                  {" "}
                  today?
                </span>
              </h2>

              <p className="mt-3 text-sm text-gray-600">
                Ask Nexora AI anything. Create,
                analyze, code or explore.
              </p>
            </div>

            {!currentChatId && (
              <div className="dashboard-core relative mb-10 flex min-h-[250px] items-center justify-center overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.018]">
                <div className="dashboard-core-glow absolute h-48 w-48 rounded-full bg-cyan-400/10 blur-[80px]" />

                <div className="dashboard-core-light absolute inset-0 rounded-full bg-cyan-400/[0.03] blur-3xl" />

                <div className="dashboard-ring-one absolute h-40 w-40 rounded-full border border-cyan-400/10">
                  <span className="dashboard-orbit-dot absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

                  <span className="dashboard-orbit-dot absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
                </div>

                <div className="dashboard-ring-two absolute h-56 w-56 rounded-full border border-cyan-400/[0.07]">
                  <span className="dashboard-orbit-dot absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.9)]" />

                  <span className="dashboard-orbit-dot absolute bottom-8 left-6 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                </div>

                <div className="dashboard-ring-three absolute h-72 w-72 rounded-full border border-blue-400/[0.05]">
                  <span className="dashboard-orbit-dot absolute bottom-4 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_15px_rgba(103,232,249,0.9)]" />

                  <span className="dashboard-orbit-dot absolute left-6 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                </div>

                <span className="dashboard-particle absolute left-[38%] top-[35%] h-1.5 w-1.5 rounded-full bg-cyan-300" />

                <span className="dashboard-particle absolute right-[38%] top-[42%] h-1 w-1 rounded-full bg-blue-400" />

                <span className="dashboard-particle absolute bottom-[32%] left-[43%] h-1 w-1 rounded-full bg-cyan-200" />

                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-[#07111f] shadow-[0_0_60px_rgba(34,211,238,0.15)]">
                  <div className="dashboard-core-light absolute inset-0 rounded-full bg-cyan-400/10 blur-xl" />

                  <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl" />

                  <div className="relative z-10 text-center">
                    <div className="mx-auto mb-2 flex justify-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    </div>

                    <span className="text-[10px] font-semibold tracking-widest text-cyan-200">
                      NEXORA
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-5 text-[9px] uppercase tracking-[0.3em] text-gray-700">
                  AI SYSTEM ONLINE
                </div>
              </div>
            )}

            {currentChatId && (
              <div className="messages mb-8 flex-1 space-y-4 overflow-y-auto pr-2">
                {messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`w-fit max-w-[82%] rounded-2xl px-4 py-3 text-sm md:text-base ${
                      message.role === "user"
                        ? "ml-auto rounded-br-none bg-white/10 text-white"
                        : "mr-auto text-white/90"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap">
                        {message.content}
                      </p>
                    ) : (
                      <>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">
                                {children}
                              </p>
                            ),

                            ul: ({ children }) => (
                              <ul className="mb-2 list-disc pl-5">
                                {children}
                              </ul>
                            ),

                            ol: ({ children }) => (
                              <ol className="mb-2 list-decimal pl-5">
                                {children}
                              </ol>
                            ),

                            code: ({ children }) => (
                              <code className="rounded bg-white/10 px-1 py-0.5">
                                {children}
                              </code>
                            ),

                            pre: ({ children }) => (
                              <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>

                        {message.sources?.length > 0 && (
                          <div className="mt-4 border-t border-white/[0.06] pt-3">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="text-xs text-cyan-400">
                                ◈
                              </span>

                              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                                Sources
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              {message.sources.map(
                                (source, sourceIndex) => (
                                  <div
                                    key={`${source.source}-${source.page}-${sourceIndex}`}
                                    className="flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.025] px-3 py-2 text-xs"
                                  >
                                    <span className="text-cyan-400">
                                      ◇
                                    </span>

                                    <span className="min-w-0 flex-1 truncate text-gray-400">
                                      {source.source ||
                                        "Unknown document"}
                                    </span>

                                    {source.page && (
                                      <span className="shrink-0 text-gray-600">
                                        Page {source.page}
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!currentChatId && (
              <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["✦", "Ask Nexora", "Ask anything"],
                  ["◇", "Create", "Generate content"],
                  ["</>", "Code", "Build & debug"],
                  ["◈", "Analyze", "Understand data"],
                ].map(([icon, title, text]) => (
                  <button
                    type="button"
                    key={title}
                    className="dashboard-action rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4 text-left transition hover:border-cyan-400/20"
                  >
                    <div className="dashboard-action-icon mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/[0.07] text-cyan-300">
                      {icon}
                    </div>

                    <p className="text-sm font-medium text-gray-200">
                      {title}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      {text}
                    </p>
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmitMessage}
              className="dashboard-chatbox mt-auto"
            >
              <div className="rounded-2xl border border-white/[0.09] bg-[#070d17]/90 p-2 transition focus-within:border-cyan-400/25">
                <div className="flex items-end gap-2">
                  <textarea
                    value={chatInput}
                    onChange={(event) =>
                      setChatInput(event.target.value)
                    }
                    placeholder="Message Nexora AI..."
                    rows={1}
                    className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-gray-700"
                  />

                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↑
                  </button>
                </div>
              </div>

              <p className="dashboard-disclaimer mt-3 text-center text-[10px] text-gray-700">
                Nexora AI can make mistakes. Verify important information.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;