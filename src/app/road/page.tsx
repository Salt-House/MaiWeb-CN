'use client'

import { getRoadList } from "@/utils/need"
import NeedItem, { NeedItemProps } from "./components/NeedItem"
import SvgStrokedText from "../components/SvgStrokedText"
import LoadingSpinner from "../components/LoadingSpinner"
import {useEffect, useState} from "react"


/**
 * 开发路线页面组件
 */
export default function RoadPage(){
    const [needs,setNeeds] = useState<NeedItemProps[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true);
        getRoadList().then(res => {
            const apiData = JSON.parse(res).list;
            const transformedData = apiData.map((item: any) => ({
                rid: item.rid || 0,
                title: item.need_name || '',
                content: item.content || '',
                star: item.star || 0,
                latestTime: new Date().toISOString().split('T')[0],
                priority: item.priority || 0,
                progress: item.progress || 0,
                tags: item.tags ? JSON.parse(item.tags) : [],
                comment: item.comment && item.comment.trim() !== "" ? JSON.parse(item.comment) : [], // 修复后的解析逻辑
                status: item.status || 0
            }));
            setNeeds(transformedData);
            setIsLoading(false);
        }).catch(error => {
            console.error('加载开发路线数据失败:', error);
            setIsLoading(false);
        });
    }, []);

    // useEffect(() => {
    //     setNeeds([
    //         {
    //             title: "基础功能",
    //             content: "实现用户注册、登录、个人资料管理等基础功能，为整个应用提供用户身份验证和基本信息管理能力。",
    //             star: 3,
    //             latestTime: "2023-12-31",
    //             priority: 1,
    //             progress: 0,
    //             tags: ["基础功能"],
    //             comment: [],
    //             status:0
    //         },
    //         {
    //             title: "数据分析",
    //             content: "提供用户行为分析、内容统计等数据分析功能，帮助优化产品体验。",
    //             star: 3,
    //             latestTime: "2023-12-31",
    //             priority: 1,
    //             progress: 0,
    //             tags: ["数据分析"],
    //             comment: [],
    //             status: 1
    //         }
    //     ])
    // }, []);

    const transformStatus = (status: number) => {
        switch (status) {
            case 0:
                return "已完成";
            case 1:
                return "进行中";
            case 2:
                return "评估中";
            default:
                return "未知状态";
        }
    }

    const transformColorStatus = (status: number) => {
        switch (status) {
            case 0:
                return "text-green-500";
            case 1:
                return "text-red-500";
            case 2:
                return "text-gray-500";
            default:
                return "text-gray-500";
        }
    }

    useEffect(() => {
        console.log(needs)
    }, [needs])
    return(
        <>
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center w-[60vw] mx-auto">
                    <SvgStrokedText text="开发路线" width={300} height={200} letterSpacing={"2px"} fontSize={25} strokeColor="#ec4899" ></SvgStrokedText>
                </div>
                <div className="space-y-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <LoadingSpinner size="lg" message="加载中..." description="正在获取开发路线数据" />
                        </div>
                    ) : (
                        Object.entries(
                            needs.reduce((groups, item) => {
                                const status = item.status ?? -1;
                                // @ts-ignore
                                if (!groups[status]) {
                                    // @ts-ignore
                                    groups[status] = [];
                                }
                                // @ts-ignore
                                // @ts-ignore
                                groups[status].push(item);
                                return groups;
                            }, {} as Record<number, NeedItemProps[]>)
                        ).map(([statusStr, items]) => (
                            <div key={statusStr} className="w-full">
                                <h2 className={`text-xl font-bold mb-6 ${transformColorStatus(parseInt(statusStr))}`}>{transformStatus(parseInt(statusStr))}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                                    {items.map((item, index) => (
                                        <NeedItem
                                            key={`${statusStr}-${index}`}
                                            title={item.title}
                                            content={item.content}
                                            star={item.star}
                                            latestTime={item.latestTime}
                                            priority={item.priority}
                                            progress={item.progress}
                                            tags={item.tags}
                                            comment={item.comment}
                                            status={item.status}
                                            rid= {item.rid}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        </>
    )
}