"use client";
import React, { useState } from "react";
import { Select, Spin } from "antd";
import Link from "next/link";
let timeout: ReturnType<typeof setTimeout> | null;
import useSWRImmutable from "swr/immutable";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const debounceFetch = (value: string, setQuery: Function, setFetching: Function) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  setFetching(true);
  if (value) {
    timeout = setTimeout(() => setQuery(value), 300); // 包装在函数中传递
  } else {
    setFetching(false);
  }
};

const SearchInput: React.FC<{}> = (props) => {
  const [fetching, setFetching] = useState(false);
  const [query, setQuery] = useState("");
  const { data, error } = useSWRImmutable(query ? `https://registry.npmjs.org/-/v1/search?text=${query}` : null, fetcher);

  const handleSearch = (newValue: string) => {
    debounceFetch(newValue, setQuery, setFetching); // 传递 setLoading
  };
  return (
    <Select
      className='w-[300px] md:w-[400px] lg:w-[600px] my-2'
      showSearch
      suffixIcon={null}
      filterOption={false}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      optionLabelProp='name'
      listHeight={384}
      virtual={false}
      onSearch={handleSearch}
      defaultActiveFirstOption={false}>
      {data &&
        !error &&
        data.objects.slice(0, 7).map((item: any) => (
          <Select.Option key={item.package.name} value={item.package.name}>
            <Link className=' hover:text-black hover:no-underline' href={`/package/${item.package.name}`}>
              <div>{item.package.name}</div>
              <div>{item.package.description}</div>
            </Link>
          </Select.Option>
        ))}
    </Select>
  );
};

const App: React.FC = () => (
  <div className='flex justify-center'>
    <SearchInput />
  </div>
);

export default App;
