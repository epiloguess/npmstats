"use client";
import { fetcher, npm_url } from "../../_libs/func";
import useSWR from "swr";
import MajorReleaseChart from '../../_component/PkgMajorDetail'
import MinorREleaseChart from '../../_component/PkgMinorDetail'
export default function Page({ params }: { params: { slug: string[] } }) {
  const { data, isLoading } = useSWR(`${npm_url}/${params.slug[0]}`, fetcher);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div>{data.name}</div>
      <div>{data.description}</div>
      <div>{data.time.modified}</div>
      <div>{data.time.created}</div>
      <div>{data['dist-tags'].latest}</div>
      <div>{data.repository.type}</div>
      <div>{data.repository.url}</div>
      <div>{data.repository.type}</div>
      <div>{data.homepage}</div>
      <div className="w-[800px] ">
      <MajorReleaseChart name={params.slug[0]}></MajorReleaseChart>
      <MinorREleaseChart name={params.slug[0]}></MinorREleaseChart>
    
      </div>
   </div>
  );
}
