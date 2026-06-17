"use client";

import { useState, useEffect, useCallback } from "react";

// 打字机效果 Hook
function useTypingAnimation(text: string, speed = 50, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      timeout = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timeout);
          setIsDone(true);
        }
      }, speed);
    };

    const delay = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(delay);
      clearInterval(timeout);
    };
  }, [text, speed, startDelay]);

  return { displayed, isDone };
}

// 命令输出内容
const COMMANDS: Record<string, { description: string; output: string[] }> = {
  about: {
    description: "关于我",
    output: [
      "嗨！我是 Jeff，一个热爱技术的开发者。",
      "",
      "我喜欢探索新技术、构建有趣的项目，",
      "并通过博客分享我的学习心得和思考。",
      "",
      "这个网站是我的数字花园 🌱",
    ],
  },
  skills: {
    description: "技术栈",
    output: [
      "┌─────────────────────────────────────┐",
      "│  Languages    │ TypeScript, Rust     │",
      "│  Frontend     │ React, Next.js, Vue  │",
      "│  Backend      │ Node.js, Go          │",
      "│  Database     │ PostgreSQL, Redis    │",
      "│  DevOps       │ Docker, K8s, CI/CD   │",
      "└─────────────────────────────────────┘",
    ],
  },
  blog: {
    description: "最新文章",
    output: [
      "📝 2026-06-15  如何构建终端风格的个人网站",
      "📝 2026-06-10  Next.js 16 新特性速览",
      "📝 2026-06-01  用 Rust 重写我的 CLI 工具",
      "",
      "输入 'blog' 查看所有文章 →",
    ],
  },
  contact: {
    description: "联系方式",
    output: [
      "📧  email   → hi@jeffchong.dev",
      "🐙  github  → github.com/jeffchong",
      "💼  linkedin → linkedin.com/in/jeffchong",
      "",
      "欢迎随时联系我！",
    ],
  },
  help: {
    description: "查看可用命令",
    output: [
      "可用命令：",
      "",
      "  about     - 关于我",
      "  skills    - 技术栈",
      "  blog      - 最新文章",
      "  contact   - 联系方式",
      "  clear     - 清空终端",
      "  help      - 显示此帮助",
    ],
  },
};

export default function Terminal() {
  const [history, setHistory] = useState<
    { type: "input" | "output"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const welcomeText =
    "Welcome to Jeff's digital space. Type 'help' to get started.";
  const { displayed: welcomeDisplayed, isDone: welcomeDone } =
    useTypingAnimation(welcomeText, 40, 500);

  // 欢迎信息完成后自动聚焦
  useEffect(() => {
    if (welcomeDone) {
      const el = document.getElementById("terminal-input");
      el?.focus();
    }
  }, [welcomeDone]);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      const newHistory = [...history, { type: "input" as const, text: cmd }];

      if (trimmed === "clear") {
        setHistory([]);
        setInput("");
        return;
      }

      if (trimmed === "") {
        setHistory(newHistory);
        setInput("");
        return;
      }

      const command = COMMANDS[trimmed];
      if (command) {
        const output = command.output.map((line) => ({
          type: "output" as const,
          text: line,
        }));
        newHistory.push(...output);
      } else {
        newHistory.push({
          type: "output",
          text: `command not found: ${trimmed}. Type 'help' for available commands.`,
        });
      }

      newHistory.push({ type: "output", text: "" });
      setHistory(newHistory);
      setCommandHistory((prev) => [cmd, ...prev]);
      setHistoryIndex(-1);
      setInput("");
    },
    [history]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      const matches = Object.keys(COMMANDS).filter((c) =>
        c.startsWith(partial)
      );
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  return (
    <div
      className="w-full max-w-3xl mx-auto cursor-text"
      onClick={() => {
        if (welcomeDone) {
          document.getElementById("terminal-input")?.focus();
        }
      }}
    >
      {/* 终端窗口 */}
      <div className="rounded-xl overflow-hidden shadow-2xl border border-zinc-700/50">
        {/* 标题栏 */}
        <div className="bg-zinc-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-zinc-400 text-sm font-mono">
              jeff@terminal ~ %
            </span>
          </div>
        </div>

        {/* 终端内容 */}
        <div className="bg-zinc-900 p-6 min-h-[400px] max-h-[600px] overflow-y-auto font-mono text-sm leading-relaxed">
          {/* 欢迎信息 */}
          <div className="text-green-400 mb-4">
            <span className="text-emerald-500">$</span>{" "}
            <span>{welcomeDisplayed}</span>
            {!welcomeDone && <span className="animate-pulse">▌</span>}
          </div>

          {/* 命令历史 */}
          {history.map((entry, i) => (
            <div key={i} className={entry.type === "input" ? "" : "pl-0"}>
              {entry.type === "input" ? (
                <div className="text-green-400">
                  <span className="text-emerald-500">$</span>{" "}
                  <span>{entry.text}</span>
                </div>
              ) : (
                <div className="text-zinc-300 whitespace-pre">
                  {entry.text}
                </div>
              )}
            </div>
          ))}

          {/* 输入行 */}
          {welcomeDone && (
            <div className="flex items-center text-green-400">
              <span className="text-emerald-500 mr-2">$</span>
              <input
                id="terminal-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 bg-transparent outline-none text-green-400 caret-green-400 font-mono"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              {isFocused && (
                <span className="animate-pulse text-green-400">▌</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 快捷命令按钮 */}
      {welcomeDone && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {Object.entries(COMMANDS).map(
            ([cmd, { description }]) =>
              cmd !== "help" &&
              cmd !== "clear" && (
                <button
                  key={cmd}
                  onClick={() => executeCommand(cmd)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono hover:bg-zinc-700 hover:text-green-400 hover:border-green-500/30 transition-all duration-200 cursor-pointer"
                >
                  <span className="text-emerald-500">$</span> {cmd}
                  <span className="text-zinc-500 ml-2 text-xs hidden sm:inline">
                    {description}
                  </span>
                </button>
              )
          )}
        </div>
      )}
    </div>
  );
}
