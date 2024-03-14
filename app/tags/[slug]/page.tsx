import MultiPkgChart from "../../_component/MultiPkgChart";
import {getTag,TAGS} from '@/_libs/func'
// import {getTag,TAGS} from '@/_libs/func'
export default async function App({ params }) {
  const tag_name = decodeURIComponent(decodeURIComponent(params.slug));
  let tag_data;
  try {
    tag_data = await getTag(tag_name);
  } catch (err) {
    console.error("/tags/[slug],tag_data", err);
  }
  return (
    <div className="flex">
      <div>
      {tag_data.rank.map((project) => (
        <div key={project.pkg_name}>
          <a href={`/package/${project.pkg_name}`}>{project.pkg_name}</a>
        </div>
      ))}
      </div>

      <div className="w-[800px] h-[600px] ">
        <MultiPkgChart data={tag_data.chartData}></MultiPkgChart>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const arr = TAGS.map((tag) => {
    const encode_url = encodeURIComponent(tag.tag);
    return { slug: encode_url };
  });

  return arr;
}
