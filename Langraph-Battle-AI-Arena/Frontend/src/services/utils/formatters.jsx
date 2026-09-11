export function RenderText({ text }) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span className="leading-relaxed text-slate-300">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>
          : part
      )}
    </span>
  )
}
