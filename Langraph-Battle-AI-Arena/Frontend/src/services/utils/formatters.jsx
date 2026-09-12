import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function RenderText({ text }) {
    if (!text) return null

    return (
        <div className="text-slate-300 leading-7 space-y-4">

            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{ 

                    h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-slate-100 mt-2 mb-4">
                            {children}
                        </h1>
                    ),

                    h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-slate-100 mt-5 mb-3">
                            {children}
                        </h2>
                    ),

                    h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-slate-200 mt-5 mb-2">
                            {children}
                        </h3>
                    ),

                    p: ({ children }) => (
                        <p className="text-[15px] leading-7 text-slate-300">
                            {children}
                        </p>
                    ),

                    ul: ({ children }) => (
                        <ul className="list-disc pl-6 space-y-2">
                            {children}
                        </ul>
                    ),

                    ol: ({ children }) => (
                        <ol className="list-decimal pl-6 space-y-2">
                            {children}
                        </ol>
                    ),

                    li: ({ children }) => (
                        <li className="text-slate-300">
                            {children}
                        </li>
                    ),

                    strong: ({ children }) => (
                        <strong className="font-semibold text-slate-100">
                            {children}
                        </strong>
                    ),

                    em: ({ children }) => (
                        <em className="italic text-slate-200">
                            {children}
                        </em>
                    ),

                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-indigo-500/50 pl-4 py-1 text-slate-400 italic">
                            {children}
                        </blockquote>
                    ),

                    code: ({ children, className }) => {
                        const isBlock = className?.includes("language-")

                        if (!isBlock) {
                            return (
                                <code className="px-1.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-sm">
                                    {children}
                                </code>
                            )
                        }

                        return (
                            <code className="text-sm text-slate-200">
                                {children}
                            </code>
                        )
                    },

                    pre: ({ children }) => (
                        <pre className="my-5 p-5 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto shadow-inner">
                            {children}
                        </pre>
                    ),

                    hr: () => (
                        <hr className="border-slate-800 my-6" />
                    ),

                    table: ({ children }) => (
                        <div className="overflow-x-auto my-5">
                            <table className="w-full border-collapse border border-slate-800 text-sm">
                                {children}
                            </table>
                        </div>
                    ),

                    th: ({ children }) => (
                        <th className="border border-slate-800 bg-slate-900 px-4 py-3 text-left text-slate-100 font-semibold">
                            {children}
                        </th>
                    ),

                    td: ({ children }) => (
                        <td className="border border-slate-800 px-4 py-3 text-slate-300">
                            {children}
                        </td>
                    )
                }}
            >
                {text}
            </ReactMarkdown>

        </div>
    )
}