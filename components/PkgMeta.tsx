import { Suspense } from "react";
import Npm_logo from "@public/npm-logo.svg";
import Github_logo from "@public/github-mark.svg";
import { Package } from "@type/npm";
import Link from "next/link";

export async function PkgMeta({ meta }: { meta: Package }) {
  let { pkg, description, repository } = meta;
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <Link href={`/package/${pkg}`}>
        <h2 className=' text-orange-500 text-xl font-bold '>{pkg}</h2>

        </Link>
        <a target='_blank' href={`https://www.npmjs.com/package/${pkg}`}>
          <Npm_logo width='24' height='24'></Npm_logo>
        </a>
        <Suspense fallback={<div className=''>Loading ...</div>}>
          {repository && (
            <a target='_blank' href={repository}>
              <Github_logo width='24' height='24'></Github_logo>
            </a>
          )}
        </Suspense>
      </div>
      <Suspense fallback={<div className=''>Loading ...</div>}>
        <div>{description}</div>
      </Suspense>
    </div>
  );
}
