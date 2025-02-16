
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
  type: string
}
let baseUrl = "https://assets2.lxns.net/maimai"

export default function MusicGrade(props: MusicGradeProps) {

  let levelColor: string = 'bg-green-500';
  let nameColor: string = 'bg-green-500';
  let textstroke = {
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
      levelColor = 'bg-white-500';
      nameColor = 'text-white';
      textstroke = {
        textShadow: '-2px -2px 4px rgba(255, 255, 255, 1), 2px -2px 4px rgba(255, 255, 255, 1), -2px 2px 2px rgba(255, 255, 255, 1), 2px 2px 2px rgba(255, 255, 255, 1)'
      };
      break;
  }

  return (
    <>
      <Link href={`/music/${props.id}`} className={`w-[160px] h-48 break-words p-2 m-2 border border-gray-300 rounded-lg shadow-md hover:scale-105 hover:shadow-xl duration-300 ease-in-out backdrop-filter backdrop-blur-lg ${levelColor} bg-opacity-30`}>
        <h1
          className={`w-full text-xl pl-1 font-bold truncate ${nameColor}`}
          style={textstroke}
        >
          {props.song_name}
        </h1>
        <h2 className={`text-md pl-1 font-bold ${nameColor}`} style={textstroke}>{props.level}</h2>
        <h3 className={`text-xl pl-1 tracking-[0.2em] text-gray-600 font-bold ${nameColor}`} style={GradeColor}>{props.achievements}</h3>
        <img className="size-20 mt-2" src={`${baseUrl}/jacket/${props.id}.png`} alt={props.song_name} />
        
      </Link >
    </>

  );
}
