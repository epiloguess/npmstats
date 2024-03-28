"use client";
import { useState, Suspense, lazy } from "react";
// 懒加载搜索框组件
const SearchFromNpm = lazy(() => import("./SearchFromNpm"));

function HomePage() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // 当点击搜索图标时，切换搜索框的可见状态
  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div>
      {/* 搜索图标 */}
      {!isSearchVisible && (
        <div
          className=' m-auto border rounded-lg   w-[300px] md:w-[400px] lg:w-[600px] py-1
      '>
          <input className='w-full' onClick={toggleSearchVisibility}></input>
        </div>
      )}

      {/* 当搜索框可见时，加载搜索框组件 */}
      {isSearchVisible && (
        <Suspense fallback={<div className=' m-auto max-w-fit'>Loading...</div>}>
          <SearchFromNpm />
        </Suspense>
      )}
    </div>
  );
}

export default HomePage;
