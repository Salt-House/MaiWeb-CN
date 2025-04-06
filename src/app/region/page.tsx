'use client'

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

interface Area {
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
  const [page_size, setPageSize] = useState(10);
  const [areas, setAreas] = useState<Area[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [expandedCharacter, setExpandedCharacter] = useState<{ [key: string]: boolean }>({});
  const [expandedSong, setExpandedSong] = useState<{ [key: string]: boolean }>({});

  const textstroke = {
    textShadow: '-1px -1px 3px rgba(108, 70, 193, 0.8), 1px -1px 3px rgba(108, 70, 193, 0.8), -1px 1px 3px rgba(108, 70, 193, 0.8), 1px 1px 3px rgba(108, 70, 193, 0.8)'
  };

  const toggleDescription = (areaId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [areaId]: !prev[areaId]
    }));
  };

  const toggleCharacter = (characterKey: string) => {
    setExpandedCharacter(prev => ({
      ...prev,
      [characterKey]: !prev[characterKey]
    }));
  };

  const toggleSong = (songId: string) => {
    setExpandedSong(prev => ({
      ...prev,
      [songId]: !prev[songId]
    }));
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
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    GetArea(lang, page, page_size);
  }, [])

  useEffect(() => {
    console.log(areas);
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
              <div key={area.id} className=" rounded-xl  transition-all">
                {/* Area Image - 1:1 Aspect Ratio */}
                <div className="relative w-full pt-[100%]  ">
                  <img src={"/img/version/" + area.id + ".png"} className="w-96 absolute animate-floatUpDown top-0 left-0 object-cover mx-au transition-opacity" />
                  <div className="mx-auto w-[298px] h-[86px] bg-[url('/img/bg_name.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    <h1 className="text-white font-bold text-xl sm:text-2xl px-8 text-center truncate max-w-[250px]" style={textstroke}>
                      {area.name}
                    </h1>
                  </div>
                </div>
                <div className="p-5 max-sm:p-3">
                  <p className="text-purple-700 italic mb-3 max-sm:text-sm">{area.comment}</p>
                  {/* 描述部分 - 长文本处理 */}
                  <div>
                    <p className={`text-gray-700 mb-1 max-sm:text-sm ${!expandedDescriptions[area.id] && 'line-clamp-3'}`}>
                      {area.description}
                    </p>
                    {area.description && area.description.length > 150 && (
                      <button
                        onClick={() => toggleDescription(area.id)}
                        className="text-purple-600 hover:text-purple-800 text-sm max-sm:text-xs flex items-center mt-1"
                      >
                        {expandedDescriptions[area.id] ? (
                          <>收起 <FaChevronUp className="ml-1" /></>
                        ) : (
                          <>展开 <FaChevronDown className="ml-1" /></>
                        )}
                      </button>
                    )}
                  </div>
                  {/* 角色信息 */}
                  {area.characters && area.characters.length > 0 && (
                    <div className="mt-4 max-sm:mt-3">
                      <h3 className="text-xl font-semibold text-purple-700 mb-2 max-sm:text-lg max-sm:mb-1">角色</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-sm:gap-2">
                        {area.characters.map((character, idx) => {
                          const characterKey = `${area.id}-char-${idx}`;
                          return (
                            <div key={idx} className="bg-purple-50 p-3 max-sm:p-2 rounded-md border border-purple-100">
                              <div className="flex flex-col">
                                {/* 角色图标区域 */}
                                <div className="w-full mb-2 aspect-square bg-purple-100 rounded-md overflow-hidden">
                                  <img
                                    src={`/img/chara/${area.id}/0${idx + 1}.png`}
                                    alt={character.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.className += " p-4";
                                    }}
                                  />
                                </div>

                                {/* 角色信息 */}
                                <div className="font-bold text-purple-800 max-sm:text-sm truncate">{character.name}</div>
                                <div className="text-sm text-purple-600 max-sm:text-xs">{character.team}</div>
                                <div className="text-sm text-gray-600 mt-1 max-sm:text-xs">插画师: {character.illustrator}</div>

                                {/* 角色描述 - 长文本处理 */}
                                <div className="mt-2 max-sm:mt-1">
                                  <p className={`text-sm text-gray-700 max-sm:text-xs ${!expandedCharacter[characterKey] && 'line-clamp-2'}`}>
                                    {character.description1}
                                  </p>
                                  {character.description1 && character.description1.length > 80 && (
                                    <button
                                      onClick={() => toggleCharacter(characterKey)}
                                      className="text-purple-500 hover:text-purple-700 text-xs max-sm:text-[10px] flex items-center mt-1"
                                    >
                                      {expandedCharacter[characterKey] ? (
                                        <>收起 <FaChevronUp className="ml-1" /></>
                                      ) : (
                                        <>展开 <FaChevronDown className="ml-1" /></>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* 歌曲信息 */}
                  {area.songs && area.songs.length > 0 && (
                    <div className="mt-5 max-sm:mt-3">
                      <h3 className="text-xl font-semibold text-purple-700 mb-2 max-sm:text-lg max-sm:mb-1">歌曲</h3>
                      <div className="space-y-2">
                        {area.songs.map((song) => (
                          <div key={song.id} className="bg-purple-50 p-3 max-sm:p-2 rounded-md border border-purple-100">
                            <div className="font-bold text-purple-800 max-sm:text-sm">{song.title}</div>
                            <div className="text-sm text-purple-600 max-sm:text-xs">艺术家: {song.artist}</div>
                            <div className="text-sm text-gray-600 max-sm:text-xs">插画师: {song.illustrator}</div>

                            {/* 歌曲描述 - 长文本处理 */}
                            <div className="mt-1">
                              <p className={`text-sm text-gray-700 max-sm:text-xs ${!expandedSong[song.id] && 'line-clamp-2'}`}>
                                {song.description}
                              </p>
                              {song.description && song.description.length > 80 && (
                                <button
                                  onClick={() => toggleSong(song.id)}
                                  className="text-purple-500 hover:text-purple-700 text-xs max-sm:text-[10px] flex items-center mt-1"
                                >
                                  {expandedSong[song.id] ? (
                                    <>收起 <FaChevronUp className="ml-1" /></>
                                  ) : (
                                    <>展开 <FaChevronDown className="ml-1" /></>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* 视频展示按钮 */}
                  {area.video_id && (
                    <div className="mt-4 text-center max-sm:mt-3">
                      <button
                        className="px-4 py-2 max-sm:px-3 max-sm:py-1 max-sm:text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors shadow-sm"
                        onClick={() => window.open(`https://www.youtube.com/watch?v=${area.video_id}`, '_blank')}
                      >
                        观看区域视频
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}