import Link from "next/link";
import { getPkgTag, TAGS } from "@utils/server"
import { getRealMeta } from "@utils/edge";
import { Suspense } from "react";

import MultiPkgChart from "@/_component/MultiPkgChart";

export const runtime = 'edge';
function RealMeta({ description }: { description: string }) {
  return <p className=' overflow-auto'>{description}</p>;
}
export default async function App({ params }: { params: { slug: string } }) {
  const tag_name = decodeURIComponent(decodeURIComponent(params.slug));

  const { packages } = TAGS.find(({ tag }) => tag === tag_name)!;
  const packages_meta = await Promise.all(
    packages.map(async (pkg_name) => await getRealMeta(pkg_name))
  );
  let sorted_packages_meta = packages_meta.toSorted(
    (a, b) => b.popularity - a.popularity
  );
  const pkg_list = sorted_packages_meta.map((pkg) => pkg.pkg);

  return (
    <div className=' flex  flex-col justify-center gap-2'>
      <div className=' text-orange-500 text-xl font-bold'># {tag_name}</div>
      <div
        className={
          packages.length < 10
            ? "h-[400px]"
            : packages.length < 15
            ? "h-[500px]"
            : packages.length < 20
            ? "h-[600px]"
            : packages.length < 30
            ? "h-[800px] md:h-[600px]"
            : ` h-[1200px] md:h-[600px]`
        }>
        <Suspense fallback={<div className=' m-auto w-fit'>Loading ...</div>}>
          <MultiPkgChart pkg_list={pkg_list.slice(0, 5)}></MultiPkgChart>
        </Suspense>
      </div>

      {sorted_packages_meta.map(({ pkg, description }) => (
        <div
          key={pkg}
          className=' border-b px-2 py-1 rounded flex flex-col gap-2 '>
          <div className='md:flex justify-between gap-2 items-center'>
            <div className='py-1'>
              <Link
                prefetch={false}
                href={`/package/${pkg}`}
                className=' text-orange-400  font-bold'>
                {pkg}
              </Link>
            </div>

            <div className='flex md:flex-row-reverse gap-2 flex-wrap'>
              {getPkgTag(pkg).map((e) => (
                <Link
                  prefetch={false}
                  className=' bg-gray-300 hover:bg-gray-400 rounded px-2 '
                  href={`/tags/${e}`}
                  key={e}>
                  {e}
                </Link>
              ))}
            </div>
          </div>
          <RealMeta description={description}></RealMeta>
        </div>
      ))}
    </div>
  );
}

import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag_name = decodeURIComponent(decodeURIComponent(params.slug));

  return {
    title: `${tag_name} | npmstats`,
  };
}
