"use client";

import { remark } from 'remark';
import html from 'remark-html';

import { MDXRemote } from "next-mdx-remote/rsc";

import MdxLayout from "@/_component/MdxLayout";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function App({ pkg_name }) {
  const { data, isLoading } = useSWR(
    `https://registry.npmjs.org/vue`,
    fetcher
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <MdxLayout>
      <MDXRemote source={data.readme} />
    </MdxLayout>
  );
}
