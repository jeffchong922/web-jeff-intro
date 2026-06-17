import Terminal from "./components/Terminal";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-950 px-4 py-12">
      {/* ASCII Art 标题 */}
      <pre className="text-green-500/80 text-xs sm:text-sm font-mono mb-8 select-none leading-tight text-center">
{`
            ██╗ ███████╗ ███████╗ ███████╗
            ██║ ██╔════╝ ██╔════╝ ██╔════╝
          ██║ █████╗   █████╗   █████╗
     ██   ██║ ██╔══╝   ██╔══╝   ██╔══╝
  ╚█████╔╝ ██████╗  ██║      ██║
   ╚════╝  ╚═════╝  ╚═╝      ╚═╝
`}
      </pre>

      {/* 终端主体 */}
      <Terminal />

      {/* 底部信息 */}
      <p className="mt-8 text-zinc-600 text-xs font-mono">
        Built with Next.js 16 · Tailwind CSS v4
      </p>
    </div>
  );
}
