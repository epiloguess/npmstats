import useSWR from "swr";

export const cnpm_url = "https://registry.npmmirror.com/downloads/range";
export const npm_url = "https://registry.npmjs.org";
export const range = "2023-02-01:2024-02-01";

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function multiFetcher(...urls) {
  return Promise.all(urls[0].map((url) => fetcher(url)));
}

export function useData(pkg: string) {
  const { data, error, isLoading } = useSWR(
    `${cnpm_url}${range}/${pkg}`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}