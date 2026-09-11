import { IconGavel } from '../icons'

export default function JudgePanel({ score1, score2 }) {
  return (
    <div className="mt-4 pt-6 border-t border-slate-800">
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between bg-slate-950/50 rounded-2xl p-6 border border-slate-800">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-sm">
            <IconGavel className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-200 text-sm tracking-wide uppercase">Judge Verdict</h3>
            <p className="text-sm text-slate-500 mt-0.5">Automated Neural Evaluation</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Score 1 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="text-3xl font-black text-indigo-400 tracking-tighter">
              {score1}<span className="text-lg text-indigo-500/50 font-bold">/10</span>
            </div>
            <span className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest">Sol 1</span>
          </div>
          
          <div className="w-px h-10 bg-slate-800"></div>

          {/* Score 2 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="text-3xl font-black text-cyan-400 tracking-tighter">
              {score2}<span className="text-lg text-cyan-500/50 font-bold">/10</span>
            </div>
            <span className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-widest">Sol 2</span>
          </div>
        </div>

      </div>
    </div>
  )
}
