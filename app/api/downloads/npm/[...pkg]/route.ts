import { getRequestContext } from "@cloudflare/next-on-pages";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { dayDiff, formatDate, lastMonthRange } from "@utils/server";
import { Dailydownload, Downloads, npmDownloads } from "@type/npm";

export const runtime = "edge";

async function getNpmDownloads(
  pkg_name: string,
  lastMonthRange: string
): Promise<npmDownloads> {
  const res = await fetch(
    `https://api.npmjs.org/downloads/range/${lastMonthRange}/${pkg_name}`
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function GET(
  request: Request,
  { params }: { params: { pkg: string[] } }
) {
  const env = getRequestContext().env;
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter });

  const undecodedString = params.pkg.join("/");
  const pkg = decodeURIComponent(undecodedString);

  const DBquery = await prisma.totalDownloads.findMany({
    where: { pkg: pkg, source: "npm" },
    orderBy: {
      date: "desc",
    },
  });

  let [firstElem] = DBquery;
  const lastUpdate = DBquery.length === 0 ? "1900-01-01" : firstElem.date;
  const currentDate = formatDate(new Date());

  if (DBquery.length === 0) {
    const { downloads } = await getNpmDownloads(pkg, lastMonthRange);

    // insert to db

    async function createTotalDownload(pkg: string, item: Dailydownload) {
      const temp = {
        pkg: pkg,
        date: item.day,
        source: "npm",
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
      throw error;
    }

    let download = downloads.map(({ day, downloads }) => ({
      day,
      downloads: parseInt("" + downloads / 63),
    }));

    return Response.json({ package: pkg, downloads: download });
  } else if (dayDiff(currentDate, lastUpdate) > 2) {
    let range = `${lastUpdate}:${currentDate}`;
    const { downloads } = await getNpmDownloads(pkg, range);

    // insert to db

    async function createTotalDownload(
      pkg: string,
      { day, downloads }: Dailydownload
    ) {
      const temp = {
        pkg,
        date: day,
        source: "npm",
        download: downloads,
      };
      await prisma.totalDownloads.upsert({
        where: temp as any,
        update: {},
        create: temp,
      });
    }

    try {
      await Promise.all(
        downloads.map(async (item) => {
          await createTotalDownload(pkg, item);
        })
      );
    } catch (error) {
      throw error
    }

    const DBquery = await prisma.totalDownloads.findMany({
      where: { pkg: pkg, source: "npm" },
      orderBy: { date: "asc" },
    });
    let download = DBquery.map(({ date, download }) => ({
      day: date,
      downloads: parseInt("" + download / 63),
    }));

    return Response.json({ package: pkg, downloads: download });
  } else {
    const DBquery = await prisma.totalDownloads.findMany({
      where: { pkg: pkg, source: "npm" },
      orderBy: { date: "asc" },
    });
    let download = DBquery.map(({ date, download }) => ({
      day: date,
      downloads: parseInt("" + download / 63),
    }));

    return Response.json({ package: pkg, downloads: download });
  }
}
