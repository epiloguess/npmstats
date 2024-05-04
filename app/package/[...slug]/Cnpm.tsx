import PieChart from "@componets/PieChart";
import { getVersions } from "@utils/server";



export default async function Page({ params }: { params: { slug: string[] } }) {
  const undecodedString = params.slug.join("/");
  const pkg_name = decodeURIComponent(undecodedString);

  const cnpm_week_data = await getVersions('cnpm',pkg_name);
  return (
    <div className='flex flex-col gap-2'>
      <h3 className=' m-auto bg-gray-50 border-2 px-2 rounded mt-4'>CNPM</h3>

      <div
        className={
          cnpm_week_data.length < 10
            ? "h-[300px]"
            : cnpm_week_data.length < 15
            ? "h-[400px]"
            : cnpm_week_data.length < 20
            ? "h-[500px]"
            : cnpm_week_data.length < 30
            ? "h-[600px] md:h-[600px]"
            : ` h-[600px] md:h-[600px]`
        }>
        <PieChart data={cnpm_week_data.sort((a,b)=>(b.downloads - a.downloads))}></PieChart>
      </div>
    </div>
  );
}
