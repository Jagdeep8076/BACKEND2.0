import { IconLoader, IconSend } from '../icons'

export default function MessageInput({ input, setInput, handleSend, loading }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-none bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/80 px-6 py-6 absolute bottom-0 left-0 w-full z-20">
      <div className="max-w-4xl mx-auto relative flex items-end gap-3 bg-slate-900 p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-700 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
        <textarea
          className="flex-1 bg-transparent border-none outline-none resize-none px-5 py-3 text-[15px] leading-relaxed text-slate-200 placeholder-slate-500 min-h-[56px] max-h-32 no-scrollbar"
          placeholder="Enter your prompt for the models..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading}
        />
        <button
          className={`flex-none w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            !input.trim() || loading 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md hover:-translate-y-0.5'
          }`}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          {loading ? <IconLoader className="w-5 h-5" /> : <IconSend className="w-5 h-5" />}
        </button>
      </div>
      <p className="text-center text-[11px] text-slate-500 mt-3 font-medium">
        Press <kbd className="font-sans px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded mx-0.5 text-slate-300">Enter</kbd> to send, <kbd className="font-sans px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded mx-0.5 text-slate-300">Shift</kbd> + <kbd className="font-sans px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded mx-0.5 text-slate-300">Enter</kbd> for new line
      </p>
    </div>
  )
}
