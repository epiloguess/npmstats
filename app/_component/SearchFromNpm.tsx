"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const myfetch = (value: string, callback: Function) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const fake = () => {
    const str = `${value}`;
    fetch(`https://registry.npmjs.org/-/v1/search?text=${str}`)
      .then((response: any) => response.json())
      .then((d: any) => {
        if (currentValue === value) {
          if (d.total === 0) {
            callback([]);
          }
          const result = d.objects.sort((a, b) => b.score.detail.popularity - a.score.detail.popularity);
          const data = result.map((item: any) => ({
            name: item.package.name,
            description: item.package.description,
          }));
          callback(data);
        }
      });
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
  const [data, setData] = useState<SelectProps["options"]>([]);
  const [value, setValue] = useState<string>();
  const router = useRouter(); // 获取路由对象

  const handleSearch = (newValue: string) => {
    myfetch(newValue, setData);
  };

  const handleChange = (newValue: string) => {
    // setValue(newValue);
    router.push(`/package/${newValue}`); // 根据您的路由配置，这里可能会有所不同
  };

  return (
    <Select
      className="w-[300px] md:w-[400px] lg:w-[600px] my-2"
      showSearch
      value={value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      optionLabelProp='name'
      listHeight={384}
      virtual={false}
      // options={(data || []).map((d) => ({
      //   value: d.value,
      //   label: d.text,
      // }))}
    >
      {(data || []).map((e) => (
        <Option key={e.name} >
          <div>{e.name}</div>
          <div>{e.description}</div>
        </Option>
      ))}
    </Select>
  );
};

const App: React.FC = () => (
  <div className=" flex  justify-center">
    <SearchInput placeholder="Search From NPM" style={{}} />
  </div>
);

export default App;
