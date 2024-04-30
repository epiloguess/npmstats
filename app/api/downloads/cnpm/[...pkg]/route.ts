import { getRequestContext } from "@cloudflare/next-on-pages";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

import { lastMonthRange } from "@utils/server";

export const runtime = "edge";

import { cnpm_data } from "@type/npm";

async function getCnpmDownloads(
  range: string,
  pkg_name: string
): Promise<cnpm_data> {
  const res = await fetch(
    `https://registry.npmmirror.com/downloads/range/${range}/${pkg_name}`
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

function getCnpmMonthData(
  range: string,
  data: cnpm_data["downloads"],
  pkg_name: string
) {
  const [range_start, range_end] = range.split(":");
  const range_start_index = data.findIndex((e) => e.day === range_start);
  const range_end_index = data.findIndex((e) => e.day === range_end);
  const ranged_downloads = data.slice(range_start_index, range_end_index + 1);
  return {
    // start: range_start,
    // end: range_end,
    package: `${pkg_name} - cnpm`,
    downloads: ranged_downloads,
  };
}

import { formatDate, dayDiff } from "@utils/server";
export async function GET(
  request: Request,
  { params }: { params: { pkg: string[] } }
) {
  const env = getRequestContext().env;
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  const undecodedString = params.pkg.join("/");
  const pkg = decodeURIComponent(undecodedString);

  const currentDate = formatDate(new Date());
  const DBquery = await prisma.totalDownloads.findMany({
    where: { pkg_name: pkg,source:"cnpm" },
    orderBy: {
      date: "desc",
    },
  });

  let [firstElem] = DBquery;
  const lastUpdate = DBquery.length === 0 ? "1900-01-01" : firstElem.date;

  if (DBquery.length === 0) {
    // this is the first time, we get data from cnpm
    const { downloads } = await getCnpmDownloads(lastMonthRange, pkg);

    // insert to db
    interface item {
      day: string;
      downloads: number;
    }

    async function createTotalDownload(pkg: string, item: item) {
      const temp = {
        pkg_name: pkg,
        date: item.day,
        source: "cnpm",
        download: item.downloads,
      };
      await prisma.totalDownloads.create({ data: temp });
    }

    try {
      await Promise.all(
        downloads.map(async (item) => {
          await createTotalDownload(pkg, item);
        })
      );
    } catch (error) {
      console.error("Error occurred during creation:", error);
    }

    // creataMany can not work right now ,see https://github.com/prisma/prisma/issues/23743

    // const data = downloads.map((item) => ({
    //   pkg_name: pkg,
    //   date: item.day,
    //   source: "cnpm",
    //   download: item.downloads,
    // }));
    // await prisma.totalDownloads.createMany({ data: data });

    // also send it to the client
    return Response.json({ package: pkg, downloads });
  } else if (dayDiff(currentDate, lastUpdate) > 2) {
    // data is out-of-date
    let range = `${lastUpdate}:${currentDate}`;
    const { downloads } = await getCnpmDownloads(range, pkg);

    // insert to db
    interface item {
      day: string;
      downloads: number;
    }

    async function createTotalDownload(pkg: string, item: item) {
      const temp = {
        pkg_name: pkg,
        date: item.day,
        source: "cnpm",
        download: item.downloads,
      };
      await prisma.totalDownloads.create({ data: temp });
    }

    try {
      await Promise.all(
        downloads.map(async (item) => {
          await createTotalDownload(pkg, item);
        })
      );
    } catch (error) {
      console.error("Error occurred during creation:", error);
    }

    const DBquery = await prisma.totalDownloads.findMany({
      where: { pkg_name: pkg,source:'cnpm' },
    });
    let download = DBquery.map(({ date, download }) => ({
      day: date,
      downloads: download,
    }));
    return Response.json({ package: pkg, downloads: download });
  } else {
    const DBquery = await prisma.totalDownloads.findMany({
      where: { pkg_name: pkg,source:"cnpm" },
    });
    let download = DBquery.map(({ date, download }) => ({
      day: date,
      downloads: download,
    }));
    return Response.json({ package: pkg, downloads: download });
  }

  // const cnpm_month_data = getCnpmMonthData(lastMonthRange, downloads, pkg);
  // return Response.json(cnpm_month_data);
}
