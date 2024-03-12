import { range, getMonthList,delay } from "@/_libs/func";

const LOCAL_URL = "http://localhost:3000";

let tags_data;
try {
  tags_data = await fetch(`${LOCAL_URL}/api/tags`).then((res) => res.json());
  // 其他异步操作也可以添加 try...catch
} catch (error) {
  console.error("api/tags/[slug] tags_data:", error);
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const tag_name = decodeURIComponent(params.slug);

  const [tag_data] = tags_data.filter((e) => e.tag === tag_name);
  // const pkg_list = tag_data.projects.slice(0, 5);
  const pkg_list = tag_data.projects
  let datasets;
  try {
    datasets = await Promise.all(
      pkg_list.map(async (pkg, index) => {
        const pkg_data = await fetch(`${LOCAL_URL}/api/package/${pkg}`).then(
          (res) => res.json()
        );
        return pkg_data.main_chartdata.datasets[0];
      })
    );
  } catch (err) {
    console.error("api/tags/[slug],datasets", datasets);
  }
  const datasets_equal = datasets.flat();

  const monthList = getMonthList(range);
  const chartData = {
    labels: monthList,
    datasets: datasets_equal,
  };

  tag_data.chartData = chartData;
  return new Response(JSON.stringify(tag_data), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function generateStaticParams() {
  const arr = tags_data.map((tag) => {
    const encode_url = encodeURIComponent(tag.tag);
    return { slug: encode_url };
  });

  return arr;
}

// export const dynamic = "force-dynamic"; // defaults to auto
