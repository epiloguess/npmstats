import Link from "next/link";
export default function App() {
  return (
    <header className="pt-2 pb-4 ">
      <h1 className="  py-2">
        <Link className="  tracking-wider font-bold  hover:underline text-orange-500 text-2xl" href="/">
          NPM STATS
        </Link>
      </h1>

      <p className=" md:block italic">
        [Early Stage] An unofficial, well-maintained list of npm package download
        statistics, used for technical reference.<a className="text-[#0074d9]" href="https://wunhao.com/docs/todo/meet%20npmstats.md/">=&gt;More</a>
      </p>
    </header>
  );
}
