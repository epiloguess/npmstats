import { PkgMeta } from "@componets/PkgMeta";
import { Suspense } from "react";
import { getPackges } from "@utils/server";

async function PopularPackages() {
  const data = await getPackges();
  return (
    <>
      {data.map((meta) => (
        <div key={meta.id} className=' border-b py-1'>
          <PkgMeta meta={meta}></PkgMeta>
        </div>
      ))}
    </>
  );
}

export default async function Home() {
  return (
    <section className=' flex flex-col gap-2 '>
      <h3 className=' text-xl font-bold'>Most Popular...</h3>
      <Suspense fallback={<div className=' m-auto w-fit '>Loading ...</div>}>
        <PopularPackages></PopularPackages>
      </Suspense>
    </section>
  );
}

export const runtime = "edge";
