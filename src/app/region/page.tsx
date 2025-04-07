'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTools } from "react-icons/fa"
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface AreaCharacters {
  name: string;
  illustrator: string;
  description1: string;
  description2: string;
  team: string;
  props: any;
}

interface AreaSong {
  id: "string";
  title: "string";
  artist: "string";
  description: "string";
  illustrator: "string";
  movie: "string";
}

export interface Area {
  id: "string";
  name: "string";
  comment: "string";
  description: "string";
  video_id: "string";
  characters: AreaCharacters[];
  songs: AreaSong[]
}

export default function RegionPage() {
  const [lang, setLang] = useState("ja");
  const [page, setPage] = useState(1);
  const [page_size, setPageSize] = useState(100);
  const [areas, setAreas] = useState<Area[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [expandedCharacter, setExpandedCharacter] = useState<{ [key: string]: boolean }>({});
  const [expandedSong, setExpandedSong] = useState<{ [key: string]: boolean }>({});
  const [checkAreaData, setCheckAreaData] = useState<boolean>(false);

  const textstroke = {
    textShadow: '-1px -1px 3px rgba(108, 70, 193, 0.8), 1px -1px 3px rgba(108, 70, 193, 0.8), -1px 1px 3px rgba(108, 70, 193, 0.8), 1px 1px 3px rgba(108, 70, 193, 0.8)'
  };

  const GetArea = (lang: string, page: number, page_size: number) => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    fetch(`https://dev.maimai.moe/api/maimai/areas?lang=${lang}&page=${page}&page_size=${page_size}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const temp = JSON.parse(result);
        setAreas(temp);
        localStorage.setItem('area_data', JSON.stringify(temp));
      })
      .catch((error) => console.error(error));
  }

  const CheckAreaData = () => {
    const storedData = localStorage.getItem('area_data');
    if (!storedData || storedData === '[]' || storedData === '""') {
      return true; // 需要获取数据
    }
    try {
      const parsedData = JSON.parse(storedData);
      if (parsedData.length <= 12) {
        return true;
      }
      return Array.isArray(parsedData) && parsedData.length === 0;
    } catch (error) {
      console.error("解析缓存的区域数据时出错:", error);
      return true; // 解析错误，需要重新获取数据
    }
  }

  useEffect(() => {
    const shouldFetchData = CheckAreaData();

    if (shouldFetchData) {
      GetArea(lang, page, page_size);
    } else {
      try {
        const storedData = localStorage.getItem('area_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          // 检查是否已经是数组格式
          if (Array.isArray(parsedData)) {
            setAreas(parsedData);
          } else {
            // 可能存储的是JSON字符串的字符串
            setAreas(JSON.parse(parsedData));
          }
        }
      } catch (error) {
        console.error("解析存储的区域数据时出错:", error);
        GetArea(lang, page, page_size); // 出错时重新获取数据
      }
    }
  }, [lang, page, page_size]);

  // 数据加载后的日志记录
  useEffect(() => {
    if (areas && areas.length > 0) {
      console.log("区域数据已加载:", areas.length);
    }
  }, [areas])

  return (
    <>
      <div className="flex flex-col items-center p-8 max-sm:p-4 min-h-screen">
        <p className="text-3xl font-bold mb-8 max-sm:text-2xl max-sm:mb-6 text-white" style={textstroke}>区域</p>

        {areas.length === 0 ? (
          <div className="flex items-center justify-center w-full p-12 max-sm:p-8">
            <div className="animate-spin mr-3 text-purple-600">
              <svg className="w-8 h-8 max-sm:w-6 max-sm:h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <span className="text-lg text-purple-800 max-sm:text-base">加载中...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-sm:gap-4 w-full max-w-7xl">
            {areas.map((area) => (
              <Link href={`/region/${area.name}`} key={area.id} className=" rounded-xl  transition-all">
                <div className="w-[298px] h-[86px] bg-[url('/img/bg_name.png')] bg-no-repeat bg-cover bg-center mx-auto flex items-center justify-center">
                  <div className="w-[195px] overflow-hidden ">
                    <h1 className={`text-white w-[195px] text-center ${area.name.length > 9 ? "animate-text-scroll-region" : ""} whitespace-nowrap font-bold text-xl sm:text-2xl`} style={textstroke}>
                      {area.name}
                    </h1>
                  </div>
                </div>
                {/* Area Image - 1:1 Aspect Ratio */}
                <div className="relative w-full flex-col items-center justify-center ">
                  <img src={"/img/version/" + area.id + ".png"} className="mx-auto w-96 animate-floatUpDown transition-all duration-300 ease-in-out object-cover" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}