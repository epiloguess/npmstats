"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Select, Spin } from "antd";
import useSWR from "swr";

let timeout: ReturnType<typeof setTimeout> | null;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const debounceFetch = (
  value: string,
  callback: Function,
  setFetching: Function
) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  setFetching(true);
  if (value) {
    timeout = setTimeout(callback(value), 500);
  } else {
    callback("");
    setFetching(false);
  }
};

const SearchInput: React.FC<{}> = (props) => {
  const [fetching, setFetching] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter(); // 获取路由对象

  const { data, error } = useSWR(
    query ? `https://registry.npmjs.org/-/v1/search?text=${query}` : null,
    fetcher
  );

  const handleChange = (newValue: string) => {
    router.push(`/package/${newValue}`); // 根据您的路由配置，这里可能会有所不同
  };

  const handleSearch = (newValue: string) => {
    debounceFetch(newValue, setQuery, setFetching); // 传递 setLoading
  };
  return (
    <Select
      className='w-[300px] md:w-[400px] lg:w-[600px] my-2'
      showSearch
      suffixIcon={null}
      filterOption={false}
      onChange={handleChange}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      optionLabelProp='name'
      listHeight={384}
      virtual={false}
      onSearch={handleSearch}
      defaultActiveFirstOption={false}>
      {data &&
        !error &&
        data.objects.map((item: any) => (
          <Select.Option key={item.package.name} value={item.package.name}>
            <div>{item.package.name}</div>
            <div>{item.package.description}</div>
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
