import { RenderText } from '../../services/utils/formatters.jsx'

export default function SolutionCard({ number, title, text, theme = "indigo" }) {
  const themes = {
    indigo: {
      container: "bg-indigo-950/20 border-indigo-500/10 hover:bg-indigo-950/30",
      iconBg: "bg-indigo-500/20 border-indigo-500/20",
      iconText: "text-indigo-400",
      titleText: "text-indigo-300"
    },
    cyan: {
      container: "bg-cyan-950/20 border-cyan-500/10 hover:bg-cyan-950/30",
      iconBg: "bg-cyan-500/20 border-cyan-500/20",
      iconText: "text-cyan-400",
      titleText: "text-cyan-300"
    }
  }

  const currentTheme = themes[theme]

  return (
    <div className={`flex flex-col gap-5 p-6 rounded-2xl relative overflow-hidden group transition-colors border ${currentTheme.container}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${currentTheme.iconBg} ${currentTheme.iconText}`}>
            <span className="font-bold text-sm">{number}</span>
          </div>
          <span className={`font-semibold tracking-wide uppercase text-xs ${currentTheme.titleText}`}>
            {title}
          </span>
        </div>
      </div>
      <div className="text-[15px]">
        <RenderText text={text} />
      </div>
    </div>
  )
}
