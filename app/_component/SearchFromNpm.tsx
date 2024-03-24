"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";
import useSWR from "swr";

let timeout: ReturnType<typeof setTimeout> | null;

const { Option } = Select;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const fetchRemote = (value: string, callback: Function) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  const fake = () => {
    callback(value);
  };
  if (value) {
    timeout = setTimeout(fake, 500);
  } else {
    callback([]);
  }
};

const SearchInput: React.FC<{
  placeholder: string;
  style: React.CSSProperties;
}> = (props) => {
  const [value, setValue] = useState<string>("");
  const router = useRouter(); // 获取路由对象

  const { data, error } = useSWR(value ? `https://registry.npmjs.org/-/v1/search?text=${value}` : null, fetcher);

  const handleChange = (newValue: string) => {
    // setValue(newValue);

    router.push(`/package/${newValue}`); // 根据您的路由配置，这里可能会有所不同
  };

  const handleSearch = (newValue: string) => {
    fetchRemote(newValue, setValue); // 传递 setLoading
  };
  return (
    <Select
      className='w-[300px] md:w-[400px] lg:w-[600px] my-2'
      showSearch
      value={value}
      placeholder={props.placeholder}
      style={props.style}
      suffixIcon={null}
      filterOption={false}
      onChange={handleChange}
      notFoundContent={null}
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
  <div className=' flex  justify-center'>
    <SearchInput placeholder='Search From NPM' style={{}} />
  </div>
);

export default App;
