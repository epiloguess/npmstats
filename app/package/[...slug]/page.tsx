import { getPkgTag } from "../../_libs/func";
import { Suspense } from "react";
import Cnpm from "./Cnpm";
import Npm from "./Npm";
import Link from "next/link";
import Npm_logo from "./n.svg";
import Github_logo from "./github-mark.svg";
import MultiPkgChart from "@/_component/MultiPkgChart";
interface NpmPackage {
  name: string;
  description: string;
  links: {
    npm: string;
    homepage: string;
    repository?: string;
    bugs: string;
  };
}

interface NpmSearchResult {
  objects: {
    package: NpmPackage;

    score: {
      detail: {
        popularity: number;
      };
    };
  }[];
  total: number;
}

async function getNpmMeta(pkg_name: string): Promise<NpmSearchResult> {
  const res = await fetch(`https://registry.npmjs.org/-/v1/search?text=${pkg_name}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch NpmMeta");
  }
  return res.json();
}
async function getRealMeta(pkg_name: string) {
  let { objects: npm_meta } = await getNpmMeta(pkg_name);
  let package_meta = npm_meta.find((e) => e.package.name === pkg_name)!;
  let {
    description,
    links: { repository },
  } = package_meta.package;
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <h2 className=' text-orange-500 text-2xl font-bold '>{pkg_name}</h2>
        <a href={`https://www.npmjs.com/package/${pkg_name}`}>
          <Npm_logo width='24' height='24'></Npm_logo>
        </a>
        {repository && (
          <a href={repository}>
            <Github_logo width='24' height='24'></Github_logo>
          </a>
        )}
      </div>

      <div>{description}</div>
    </div>
  );
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const undecodedString = params.slug.join("/");
  const pkg_name = decodeURIComponent(undecodedString);

  let tags = getPkgTag(pkg_name);

  return (
    <div className='flex flex-col gap-2'>
      <section className='flex flex-col gap-2'>
        <Suspense fallback={<div className='text-center'>Loading ...</div>}>{await getRealMeta(pkg_name)}</Suspense>

        <div className='flex gap-2 flex-wrap'>
          {tags &&
            tags.map((tag: string) => (
              <div key={tag} className=' bg-gray-300 hover:bg-gray-400  px-2 rounded'>
                <p>
                  <Link prefetch={false} href={`/tags/${tag}`}>{tag}</Link>
                </p>
              </div>
            ))}
        </div>
      </section>
      <Suspense fallback={<div className='text-center'>Loading ...</div>}>
        <div className=' h-[300px]'>
          <MultiPkgChart pkg_list={[pkg_name]}></MultiPkgChart>
        </div>
        <section>
          <div className='md:flex gap-2'>
            <div className='md:w-1/2'>
              <Suspense fallback={<div className='text-center'>Loading ...</div>}>
                <Cnpm params={params}></Cnpm>
              </Suspense>
            </div>
            <div className='md:w-1/2 '>
              <Suspense fallback={<div className=' text-center'>Loading ...</div>}>
                <Npm params={params}></Npm>
              </Suspense>
            </div>
          </div>
        </section>
      </Suspense>
    </div>
  );
}

import type { Metadata } from "next";

type Props = {
  params: { slug: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const undecodedString = params.slug.join("/");
  const pkg_name = decodeURIComponent(undecodedString);

  return {
    title: `${pkg_name} - Npm Stats`,
  };
}
