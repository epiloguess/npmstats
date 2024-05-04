import Link from "next/link";
import GithubLogo from "@public/github-mark.svg";
export default function App() {
  return (
    <header className='pt-2 pb-4 '>
      <div className=' flex gap-2  items-center'>
        <h1 className='  py-2'>
          <Link
            className='  tracking-wider font-bold  hover:underline text-orange-500 text-xl'
            href='/'>
            NPM STATS
          </Link>
        </h1>
        <a href='https://github.com/epiloguess/npm-stats' target='_blank'>
          <GithubLogo width='28' height='28'></GithubLogo>
        </a>
      </div>

      <p className=' md:block italic'>
        An unofficial site of npm package download statistics, used for technical reference.
        <Link prefetch={false} className='text-[#0074d9]' href='/about'>
          =&gt;More
        </Link>
      </p>
    </header>
  );
}
