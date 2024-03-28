import Link from "next/link";
import { TAGS } from "@/_libs/func";

export default async function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between '>
      <div className='md:grid mb-2   md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {TAGS.map(({ tag, projects }) => {
          if (projects.length > 5) {
            return (
              <div className='   ' key={tag}>
                <Link prefetch={false} href={`/tags/${tag}`} className=' hover:underline font-bold'>
                  {tag}
                </Link>
                <ul className=' flex flex-wrap gap-1 '>
                  {projects.slice(0, 5).map((pkg) => (
                    <li key={pkg}>
                      <Link prefetch={false} className='text-[#0074d9] hover:underline' href={`/package/${pkg}`}>
                        {pkg},
                      </Link>
                    </li>
                  ))}
                  {projects.length > 5 && (
                    <li>
                      and{" "}
                      <Link prefetch={false} className='text-blue-500 hover:underline' href={`/tags/${tag}`}>
                        {projects.length - 5} more
                      </Link>{" "}
                    </li>
                  )}
                </ul>
              </div>
            );
          }
        })}
      </div>
    </main>
  );
}
