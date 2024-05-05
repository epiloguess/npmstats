import PieChart from '@componets/PieChart'
import { getVersions } from '@utils/server';

export default async function Page({ source,pkg }: { source:string,pkg:string }) {
  // const undecodedString = params.slug.join("/");

  // const pkg_name = decodeURIComponent(undecodedString);
  const pie_data = await getVersions(source,pkg)

  return (
    <div className='flex flex-col gap-2 '>
      <h3 className=' m-auto border px-2 rounded mt-4'>{source}</h3>

      <div
        className={
          pie_data.length < 10
            ? "h-[300px]"
            : pie_data.length < 15
            ? "h-[400px]"
            : pie_data.length < 20
            ? "h-[500px]"
            : pie_data.length < 30
            ? "h-[600px] md:h-[600px]"
            : ` h-[600px] md:h-[600px]`
        }>
        <PieChart data={pie_data}></PieChart>
      </div>
    </div>
  );
}
