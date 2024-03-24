import { getPkgTag } from "../../_libs/func";
import { Suspense } from "react";
import Cnpm from "./Cnpm";
import Npm from "./Npm";
import NpmMeta from './NpmMeta'
async function getNpmMeta(pkg_name: string) {
  const res = await fetch(
    `https://registry.npmjs.org/-/v1/search?text=${pkg_name}`
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch NpmMeta");
  }
  return res.json();
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const undecodedString = params.slug.join("/");
  const pkg_name = decodeURIComponent(undecodedString);

  let tags = getPkgTag(pkg_name);
  let { objects: npm_meta } = await getNpmMeta(pkg_name);
  let { package: real_meta } = npm_meta.find(
    (e) => e.package.name === pkg_name
  );

  return (
    <div className='flex flex-col gap-2'>
      <div className=''>
        <h2>
          <a
            className=' text-orange-500 text-2xl font-bold '
            href={`https://www.npmjs.com/package/${pkg_name}`}>
            {pkg_name}
          </a>
        </h2>
      </div>
        <div className='flex gap-2 flex-wrap'>
          {tags &&
            tags.map((tag) => (
              <div
                key={tag}
                className=' bg-gray-300 hover:bg-gray-400  px-2 rounded'>
                <p>
                  <a href={`/tags/${tag}`}>{tag}</a>
                </p>
              </div>
            ))}
        </div>

        <div>{real_meta.description}</div>
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
      {/* <NpmMeta></NpmMeta> */}
    </div>
  );
}
// export async function generateStaticParams() {
//   const arr = projects_data.map((project) => {
//     const project_name = project.name?.split("/");
//     return { slug: project_name };
//   });
//   return arr;
// }
