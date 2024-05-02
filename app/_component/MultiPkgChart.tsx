import NpmLineChart from "@/_component/NpmLineChart";
import { Downloads } from "@type/npm";

async function getCnpmData(pkg: string): Promise<Downloads> {
  try {
    let res = await fetch(`https://api.npmstats.com/downloads/cnpm/${pkg}`);
    if (!res) {
      throw new Error("something wrong");
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}

async function getNpmData(pkg: string) {
  try {
    let res = await fetch(`https://api.npmstats.com/downloads/npm/${pkg}`);
    if (!res) {
      throw new Error("something wrong");
    }
    let npm_data: Downloads = await res.json();
    return npm_data;
  } catch (err) {
    throw err;
  }
}
export default async function App({ pkg_list }: { pkg_list: string[] }) {
  const promises = pkg_list.flatMap((pkg) => [
    getCnpmData(pkg),
    getNpmData(pkg),
  ]);

  const data = await Promise.all(promises);
  // const data_sorted = data.sort(
  //   (a, b) => b.downloads.at(-1)?.downloads! - a.downloads.at(-1)?.downloads!
  // );

  return <NpmLineChart data={data}></NpmLineChart>;
}
