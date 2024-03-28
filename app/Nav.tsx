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
        [Early Stage] An unofficial, well-maintained site of npm package download
        statistics, used for technical reference.<Link className="text-[#0074d9]" href='/about'>=&gt;More</Link>
      </p>
    </header>
  );
}
