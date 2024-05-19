import { Suspense } from "react";
import Npm_logo from "@public/npm-logo.svg";
import Github_logo from "@public/github-mark.svg";
import { Package } from "@type/npm";
import Link from "next/link";

export async function PkgMeta({ meta }: { meta: Package }) {
  let { pkg, description } = meta;
  return (
    <div className='flex flex-col gap-2 '>
      <div className='flex items-center gap-2'>
        <Link href={`/package/${pkg}`}>
          <h2 className=' text-orange-500 font-medium'>{pkg}</h2>
        </Link>
      </div>
      <Suspense fallback={<div className=''>Loading ...</div>}>
        <div className="">{description}</div>
      </Suspense>
    </div>
  );
}
