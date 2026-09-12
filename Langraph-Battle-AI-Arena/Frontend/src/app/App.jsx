import { useState, useRef, useEffect } from 'react'
import { IconRobot, IconGavel, IconLoader } from '../components/icons'
import SolutionCard from '../components/chat/SolutionCard'
import JudgePanel from '../components/chat/JudgePanel'
import MessageInput from '../components/chat/MessageInput'
import { callAPI } from '../services/api'
import './App.css'

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages, loading])

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMsg = input.trim()

    setInput('')
    setError('')

    const newUserMsg = {
      type: 'user',
      content: userMsg
    }

    setMessages(prev => [
      ...prev,
      newUserMsg
    ])

    setLoading(true)

    try {
      const data = await callAPI(userMsg)

      if (!data.success) {
        throw new Error(
          data.message || 'AI Battle failed'
        )
      }

      const {
        solution_1,
        solution_2,
        judge_recommendation
      } = data.result

      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          solution_1,
          solution_2,
          judge: judge_recommendation
        }
      ])

    } catch (err) {
      console.error('Frontend API Error:', err)

      setError(
        err.message ||
        'Something went wrong while connecting to the backend.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

      <header className="flex-none bg-slate-900/50 backdrop-blur-md border-b border-slate-800/80 px-8 py-5 flex items-center justify-between z-10">

        <div className="flex items-center gap-4">

          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-inner">

            <IconRobot className="w-6 h-6" />

          </div>

          <div>

            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
              Battle AI Arena
            </h1>

            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5">
              Neural Evaluation Platform
            </p>

          </div>

        </div>

      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar relative">

        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-16 pb-40">

          {messages.length === 0 && (

            <div className="flex flex-col items-center justify-center mt-32 text-center max-w-2xl mx-auto opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">

              <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 border border-slate-800">

                <IconGavel className="w-10 h-10 text-indigo-400" />

              </div>

              <h2 className="text-4xl font-extrabold tracking-tight text-slate-100 mb-4">
                Start the Arena
              </h2>

              <p className="text-lg text-slate-400 leading-relaxed mb-10">
                Ask a question to see two AI models generate solutions side-by-side. Our automated judge will score them based on accuracy and completeness.
              </p>

              <div className="flex flex-wrap justify-center gap-3">

                {[
                  'What is the capital of Germany?',
                  'Explain how photosynthesis works in simple terms.'
                ].map(q => (

                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-sm font-medium text-slate-300 hover:text-indigo-300 hover:border-indigo-500/30 hover:bg-slate-800 transition-all shadow-sm"
                  >
                    {q}
                  </button>

                ))}

              </div>

            </div>

          )}

          {messages.map((msg, i) => (

            <div
              key={i}
              className="flex flex-col gap-8 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]"
            >

              {msg.type === 'user' ? (

                <div className="flex justify-end">

                  <div className="max-w-2xl bg-indigo-600 text-white px-7 py-5 rounded-3xl rounded-tr-sm shadow-md">

                    <p className="text-base leading-relaxed">
                      {msg.content}
                    </p>

                  </div>

                </div>

              ) : (

                <div className="flex flex-col gap-6 bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 shadow-sm">

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <SolutionCard
                      number="1"
                      title="Solution One"
                      text={msg.solution_1}
                      theme="indigo"
                    />

                    <SolutionCard
                      number="2"
                      title="Solution Two"
                      text={msg.solution_2}
                      theme="cyan"
                    />

                  </div>

                  <JudgePanel
                    score1={msg.judge.solution_1_score}
                    score2={msg.judge.solution_2_score}
                  />

                </div>

              )}

            </div>

          ))}

          {loading && (

            <div className="flex justify-start opacity-0 animate-[fadeIn_0.2s_ease-out_forwards]">

              <div className="bg-slate-900 border border-slate-800 shadow-sm px-6 py-4 rounded-3xl rounded-tl-sm flex items-center gap-3">

                <IconLoader className="w-5 h-5 text-indigo-400" />

                <span className="text-sm font-medium text-slate-400">
                  Generating responses and evaluating...
                </span>

              </div>

            </div>

          )}

          {error && (

            <div className="flex justify-center">

              <div className="max-w-xl px-5 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm text-center">

                {error}

              </div>

            </div>

          )}

          <div ref={messagesEndRef} />

        </div>

      </main>

      <MessageInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        loading={loading}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  )
}