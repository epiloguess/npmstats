import MainVersionChart from "../../_component/MainVersionChart";
import { delay } from "@/_libs/func";
const LOCAL_URL = "http://localhost:3000";
import { getPkgData, getTags, getTag,TAGS } from "@/_libs/server";

export default async function App({ params }) {
  const tag_name = decodeURIComponent(params.slug);

  let tag_data;
  try {
    tag_data = await getTag(`${tag_name}`)
  } catch (err) {
    console.error("/tags/[slug],tag_data", err);
  }

  return (
    <div>
      {tag_data.projects.map((project) => (
        <div key={project}>
          <a href={`/package/${project}`}>{project}</a>
        </div>
      ))}
      <div className="w-[800px] h-[800px]">
        <MainVersionChart data={tag_data.chartData}></MainVersionChart>
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
