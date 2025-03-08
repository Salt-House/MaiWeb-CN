import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface MusicGradeProps {
  id: string,
  song_name: string,
  level: string,
  level_index: number,
  achievements: number,
  fc: number,
  fs: number,
  dx_score: number,
  dx_rating: number,
  rate: number,
  type: string,
}
let baseUrl = "https://assets2.lxns.net/maimai"

export default function MusicGrade(props: MusicGradeProps) {

  let levelColor: string = 'bg-green-500';
  let nameColor: string = 'bg-green-500';
  let fc = null;
  let fs = null;
  let achievements = null;
  let textstroke: React.CSSProperties = {
    textShadow: '-1px -1px 2px rgba(128, 90, 213, 1), 1px -1px 2px rgba(128, 90, 213, 1), -1px 1px 1px rgba(128, 90, 213, 1), 1px 1px 1px rgba(128, 90, 213, 1)'
  };
  let GradeColor = {
    textShadow: `
      -1px -1px 1px rgba(255, 215, 0, 1),
      1px -1px 1px rgba(255, 215, 0, 1),
      -1px 1px 0.5px rgba(255, 69, 0, 1),
      1px 1px 0.5px rgba(255, 69, 0, 1)
    `
  }
  switch (props.level_index) {
    case 0:
      levelColor = 'bg-green-500';
      nameColor = 'text-green-500';
      textstroke = {
        textShadow: '-2px -2px 4px rgba(34, 197, 94, 1), 2px -2px 4px rgba(34, 197, 94, 1), -2px 2px 2px rgba(34, 197, 94, 1), 2px 2px 2px rgba(34, 197, 94, 1)'
      };
      break;
    case 1:
      levelColor = 'bg-yellow-500';
      nameColor = 'text-yellow-500';
      textstroke = {
        textShadow: '-2px -2px 4px rgba(234, 179, 8, 1), 2px -2px 4px rgba(234, 179, 8, 1), -2px 2px 2px rgba(234, 179, 8, 1), 2px 2px 2px rgba(234, 179, 8, 1)'
      };
      break;
    case 2:
      levelColor = 'bg-red-500';
      nameColor = 'text-red-500';
      textstroke = {
        textShadow: '-2px -2px 4px rgba(239, 68, 68, 1), 2px -2px 4px rgba(239, 68, 68, 1), -2px 2px 2px rgba(239, 68, 68, 1), 2px 2px 2px rgba(239, 68, 68, 1)'
      };
      break;
    case 3:
      levelColor = 'bg-purple-500';
      nameColor = 'text-white';
      textstroke = {
        textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
      };
      break;
    case 4:
      levelColor = 'bg-purple-500';
      nameColor = 'text-purple-500';
      textstroke = {
        textShadow: '-2px -2px 2px rgba(255, 255, 255, 1), 2px -2px 2px rgba(255, 255, 255, 1), -2px 2px 2px rgba(255, 255, 255, 1), 2px 2px 2px rgba(255, 255, 255, 1)'
      };
      break;
  }
  switch (props.fc) {
    case 0:
      fc = '/img/grade/app.webp';
      break;
    case 1:
      fc = '/img/grade/ap.webp';
      break;
    case 2:
      fc = '/img/grade/fcp.webp';
      break;
    case 3:
      fc = '/img/grade/fc.webp';
      break;
    default:
      fc = null;
      break;
  }
  switch (props.fs) {
    case 0:
      fs = '/img/grade/sync.webp';
      break;
    case 1:
      fs = '/img/grade/fs.webp';
      break;
    case 2:
      fs = '/img/grade/fsp.webp';
      break;
    case 3:
      fs = '/img/grade/fsd.webp';
      break;
    default:
      fs = '/img/grade/fsdp.webp';
      break;
  }
  switch (true) {
    case props.achievements >= 100.5:
      achievements = '/img/grade/sssp.webp';
      break;
    case props.achievements >= 100:
      achievements = '/img/grade/sss.webp';
      break;
    case props.achievements >= 99.5:
      achievements = '/img/grade/ssp.webp';
      break;
    case props.achievements >= 99:
      achievements = '/img/grade/ss.webp';
      break;
    case props.achievements >= 98:
      achievements = '/img/grade/sp.webp';
      break;
    case props.achievements >= 97:
      achievements = '/img/grade/s.webp';
      break;
    case props.achievements >= 94:
      achievements = '/img/grade/aaa.webp';
      break;
    case props.achievements >= 90:
      achievements = '/img/grade/aa.webp';
      break;
    case props.achievements >= 80:
      achievements = '/img/grade/a.webp';
      break;
    default:
      achievements = null;
      break;
  }

  return (
    <>
      <Link href={`/music/${props.id}`} className={`w-[160px] h-52 break-words p-2 m-2 border border-gray-300 rounded-lg shadow-md hover:scale-105 hover:shadow-xl duration-300 ease-in-out backdrop-filter backdrop-blur-lg ${levelColor} bg-opacity-30`}>
        <h1
          className={`w-full text-xl pl-1 font-bold truncate ${nameColor}`}
          style={textstroke}
        >
          {props.song_name}
        </h1>
        <div className='flex flex-row space-x-2'>
          <div className='flex flex-col justify-center items-center'>
            <h2 className={`text-md pl-1 font-bold ${nameColor}`} style={textstroke}>{props.level}</h2>
            <h2 className='pl-1 text-black font-bold'>{props.dx_rating.toString().substring(0, 3)}</h2>
          </div>
          <img src={`${achievements}`} className='w-24' alt="" />
        </div>
        <h3 className={`text-xl pl-1 tracking-[0.2em] font-bold text-white`} style={GradeColor}>{props.achievements}</h3>
        <div className='flex h-24 flex-row justify-center items-center '>
          <div className='border-4 border-white'>
            <img className="size-20" src={`${baseUrl}/jacket/${props.id}.png`} alt={props.song_name} />
          </div>
          <div className='relative h-full flex flex-col justify-center items-center space-y-1'>
            {fc != null ?
              <div className='size-10 bg-no-repeat bg-center bg-[length:50px_50px]' style={{ backgroundImage: `url(${fc})` }}></div>
              : <div className='m-2 size-10 rounded-full bg-gray-500'></div>}
            {fs != null ?
              <div className='size-10 bg-no-repeat bg-center bg-[length:50px_50px]' style={{ backgroundImage: `url(${fs})` }}></div>
              : <div className='m-2 size-10 rounded-full bg-gray-500'></div>}
          </div>
        </div>
      </Link >
    </>

  );
}
