import PieChart from '@componets/PieChart'
import { getVersions } from '@utils/server';

async function getData(pkg:string) {
  const res = await fetch(`https://api.npmstats.com/versions/npm/${pkg}`)
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}


export default async function Page({ params }: { params: { slug: string[] } }) {
  const undecodedString = params.slug.join("/");

  const pkg_name = decodeURIComponent(undecodedString);
  const pie_data = await getVersions('npm',pkg_name)

  return (
    <div className='flex flex-col gap-2 '>
      <h3 className=' m-auto bg-gray-50 border-2 px-2 rounded mt-4'>NPM</h3>

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
        <PieChart data={pie_data.sort((a,b)=>(b.downloads - a.downloads))}></PieChart>
      </div>
    </div>
  );
}
