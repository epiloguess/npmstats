import Link from "next/link";
import {  TAGS, getPkgTag } from "@/_libs/func";

import MultiPkgChart from '@/_component/MultiPkgChart'

export default async function App({ params }: { params: { slug: string } }) {
  const tag_name = decodeURIComponent(decodeURIComponent(params.slug));

  const tag_data = TAGS.find((tag) => tag.tag === tag_name)!;

  return (
    <div className=' flex  flex-col justify-center gap-2'>
      <div className=' text-orange-500 text-xl font-bold'># {tag_data?.tag}</div>
      <div
        className={
          tag_data?.projects.length < 10
            ? "h-[400px]"
            : tag_data.projects.length < 15
            ? "h-[500px]"
            : tag_data.projects.length < 20
            ? "h-[600px]"
            : tag_data.projects.length < 30
            ? "h-[800px] md:h-[600px]"
            : ` h-[1200px] md:h-[600px]`
        }>
        <MultiPkgChart pkg_list={tag_data.projects.slice(0,5)}></MultiPkgChart>
      </div>

      {tag_data.projects.map((project) => (
        <div key={project} className=' border-b px-2 py-1 rounded flex flex-col gap-2 '>
          <div className='md:flex justify-between gap-2 items-center'>
            <div className='py-1'>
              <Link prefetch={false} href={`/package/${project}`} className=' text-orange-400  font-bold'>
                {project}
              </Link>
            </div>

            <div className='flex md:flex-row-reverse gap-2 flex-wrap'>
              {getPkgTag(project).map((e) => (
                <Link prefetch={false} className=' bg-gray-300 hover:bg-gray-400 rounded px-2 ' href={`/tags/${e}`} key={e}>
                  {e}
                </Link>
              ))}
            </div>
          </div>

          {/* <p className=' overflow-auto'>{getPkgMeta(project)?.description}</p> */}
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
    title: `${tag_name} - Npm Stats`,
  };
}
