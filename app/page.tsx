export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="text-6xl mb-8">🚧</div>
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-4">
          正在施工中
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          敬请期待...
        </p>
      </main>
    </div>
  );
}