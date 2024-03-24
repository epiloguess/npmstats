import React from "react";
import SearchFromNpm from '@/_component/SearchFromNpm'
import Link from "next/link";


import {TAGS} from '@/_libs/func'
// import {TAGS} from '@/_libs/func'

// import NpmStatisticsSVG from '@/NpmStatisticsSVG'



export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      {/* <NpmStatisticsSVG  ></NpmStatisticsSVG> */}
      {/* <SearchFromNpm></SearchFromNpm> */}
      <div className="md:grid mb-2   md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TAGS.map((tag) => {

          if (tag.projects.length > 5 ){
          return <div className="   " key={tag.tag}>
            <Link href={`/tags/${tag.tag}`} className=" hover:underline font-bold">
              {tag.tag}
            </Link>
            <ul className=" flex flex-wrap gap-1 ">
              {tag.projects.slice(0, 5).map((pkg) => (
                <li key={pkg}>
                  <Link
                    className="text-[#0074d9] hover:underline"
                    href={`/package/${pkg}`}
                  >
                    {pkg},
                  </Link>
                </li>
              ))}
              {tag.projects.length > 5 && (
                <li>
                  and{" "}
                  <Link
                    className="text-blue-500 hover:underline"
                    href={`/tags/${tag.tag}`}
                  >
                    {tag.projects.length - 5 } more
                  </Link>{" "}
                </li>
              )}
            </ul>
          </div>}
})}
      </div>
    </main>
  );
}
