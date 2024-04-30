import Link from "next/link";
import { TAGS } from '@utils/server'

export default async function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between '>
      <div className='md:grid mb-2   md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {TAGS.map(({ tag, packages }) => {
          if (packages.length > 5) {
            return (
              <div className='   ' key={tag}>
                <Link
                  prefetch={false}
                  href={`/tags/${tag}`}
                  className=' hover:underline font-bold'>
                  {tag}
                </Link>
                <ul className=' flex flex-wrap gap-1 '>
                  {packages.slice(0, 5).map((pkg) => (
                    <li key={pkg}>
                      <Link
                        prefetch={false}
                        className='text-[#0074d9] hover:underline'
                        href={`/package/${pkg}`}>
                        {pkg},
                      </Link>
                    </li>
                  ))}
                  {packages.length > 5 && (
                    <li>
                      and{" "}
                      <Link
                        prefetch={false}
                        className='text-blue-500 hover:underline'
                        href={`/tags/${tag}`}>
                        {packages.length - 5} more
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
