'use client'

import AnimatedComponent from "@/app/components/AnimatedComponent";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ThirdAccount {
    server: string,
    nickname: string,
    identifier: string,
    from: string
}
let baseUrl = "https://assets2.lxns.net/maimai"


export default function BestPage() {
    const [token, setToken] = useState<string | null>()
    const [accounts, setAccounts] = useState<ThirdAccount[]>([])
    const [nowFrom, setNowFrom] = useState<string | null>('暂无数据源')
    const [best35, setBest35] = useState<any>()
    const [best15, setBest15] = useState<any>()
    const [rating35, setRating35] = useState<any>()
    const [rating15, setRating15] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        // const data = { "rating": 15468, "rating_b35": 10833, "rating_b15": 4635, "scores_b35": [{ "id": 1343, "song_name": "マツヨイナイトバグ", "level": "13+", "level_index": 3, "achievements": 100.5263, "fc": 3, "fs": 0, "dx_score": 2747, "dx_rating": 312.0, "rate": 0, "type": "dx" }, { "id": 400, "song_name": "デッドレッドガールズ", "level": "13+", "level_index": 3, "achievements": 100.6019, "fc": null, "fs": 0, "dx_score": 2494, "dx_rating": 312.0, "rate": 0, "type": "standard" }, { "id": 1096, "song_name": "モ°ルモ°ル", "level": "13+", "level_index": 3, "achievements": 100.6086, "fc": 3, "fs": 0, "dx_score": 2487, "dx_rating": 312.0, "rate": 0, "type": "dx" }, { "id": 1236, "song_name": "Last Samurai", "level": "13+", "level_index": 3, "achievements": 100.5609, "fc": 3, "fs": 2, "dx_score": 1200, "dx_rating": 312.0, "rate": 0, "type": "dx" }, { "id": 1466, "song_name": "群青シグナル", "level": "13+", "level_index": 3, "achievements": 100.5721, "fc": null, "fs": 0, "dx_score": 2661, "dx_rating": 312.0, "rate": 0, "type": "dx" }, { "id": 1310, "song_name": "Trick tear", "level": "14", "level_index": 3, "achievements": 100.2449, "fc": null, "fs": 0, "dx_score": 2246, "dx_rating": 311.0, "rate": 1, "type": "dx" }, { "id": 1461, "song_name": "#狂った民族２ PRAVARGYAZOOQA", "level": "14", "level_index": 3, "achievements": 100.1856, "fc": null, "fs": 0, "dx_score": 2513, "dx_rating": 311.0, "rate": 1, "type": "dx" }, { "id": 1573, "song_name": "Final Step!", "level": "13+", "level_index": 3, "achievements": 100.7084, "fc": null, "fs": 0, "dx_score": 2347, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1566, "song_name": "Knight Rider", "level": "13+", "level_index": 3, "achievements": 100.772, "fc": null, "fs": 0, "dx_score": 2414, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 701, "song_name": "Doll Judgment", "level": "13+", "level_index": 3, "achievements": 100.5674, "fc": null, "fs": 0, "dx_score": 2389, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 1288, "song_name": "Big Daddy", "level": "13+", "level_index": 3, "achievements": 100.5366, "fc": null, "fs": 0, "dx_score": 2705, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 841, "song_name": "終点", "level": "13+", "level_index": 3, "achievements": 100.7131, "fc": 3, "fs": 0, "dx_score": 1973, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 711, "song_name": "拝啓ドッペルゲンガー", "level": "13+", "level_index": 3, "achievements": 100.506, "fc": null, "fs": 0, "dx_score": 2815, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 288, "song_name": "六兆年と一夜物語", "level": "13+", "level_index": 3, "achievements": 100.8854, "fc": 3, "fs": 0, "dx_score": 2037, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 1453, "song_name": "Rainbow Rush Story", "level": "13+", "level_index": 3, "achievements": 100.7663, "fc": null, "fs": 0, "dx_score": 2514, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1459, "song_name": "You Mean the World to Me", "level": "13+", "level_index": 3, "achievements": 100.5134, "fc": null, "fs": 0, "dx_score": 1879, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 548, "song_name": "DETARAME ROCK&ROLL THEORY", "level": "13+", "level_index": 3, "achievements": 100.686, "fc": 3, "fs": 0, "dx_score": 2191, "dx_rating": 310.0, "rate": 0, "type": "standard" }, { "id": 1524, "song_name": "Alice's Suitcase", "level": "13+", "level_index": 3, "achievements": 100.6736, "fc": 3, "fs": 0, "dx_score": 2144, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1576, "song_name": "Cthugha", "level": "14", "level_index": 3, "achievements": 100.139, "fc": null, "fs": 0, "dx_score": 3095, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 1176, "song_name": "Climax", "level": "14", "level_index": 3, "achievements": 100.2156, "fc": null, "fs": 0, "dx_score": 3017, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 1475, "song_name": "SUPER AMBULANCE", "level": "14", "level_index": 3, "achievements": 100.0727, "fc": null, "fs": 0, "dx_score": 2760, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 379, "song_name": "Caliburne ～Story of the Legendary sword～", "level": "14", "level_index": 3, "achievements": 100.2489, "fc": null, "fs": 0, "dx_score": 2517, "dx_rating": 309.0, "rate": 1, "type": "standard" }, { "id": 1479, "song_name": "Hainuwele", "level": "14", "level_index": 3, "achievements": 100.0418, "fc": null, "fs": 0, "dx_score": 2685, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 1231, "song_name": "生命不詳", "level": "13+", "level_index": 3, "achievements": 100.8213, "fc": 3, "fs": 0, "dx_score": 2329, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1022, "song_name": "TwisteD! XD", "level": "13+", "level_index": 3, "achievements": 100.5343, "fc": null, "fs": 0, "dx_score": 2414, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1296, "song_name": "とびだせ！TO THE COSMIC!!", "level": "13+", "level_index": 3, "achievements": 100.724, "fc": 2, "fs": 0, "dx_score": 2564, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1447, "song_name": "エゴロック", "level": "13+", "level_index": 3, "achievements": 100.6095, "fc": null, "fs": 0, "dx_score": 1928, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 461, "song_name": "無敵We are one!!", "level": "13+", "level_index": 3, "achievements": 100.6059, "fc": 3, "fs": 0, "dx_score": 2525, "dx_rating": 308.0, "rate": 0, "type": "standard" }, { "id": 1143, "song_name": "アトロポスと最果の探究者", "level": "13+", "level_index": 3, "achievements": 100.6573, "fc": null, "fs": 0, "dx_score": 2194, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1445, "song_name": "遺伝子レベル∞スパイラル", "level": "13+", "level_index": 3, "achievements": 100.6425, "fc": 3, "fs": 0, "dx_score": 2263, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1159, "song_name": "Beautiful Future", "level": "13+", "level_index": 3, "achievements": 100.5278, "fc": 3, "fs": 0, "dx_score": 2236, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1195, "song_name": "マネマネサイコトロピック", "level": "13+", "level_index": 3, "achievements": 100.5842, "fc": 3, "fs": 2, "dx_score": 2290, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 561, "song_name": "いっしそう電☆舞舞神拳！", "level": "13+", "level_index": 3, "achievements": 100.5671, "fc": 3, "fs": 0, "dx_score": 2353, "dx_rating": 308.0, "rate": 0, "type": "standard" }, { "id": 1208, "song_name": "Cyaegha", "level": "13+", "level_index": 3, "achievements": 100.505, "fc": 3, "fs": 0, "dx_score": 2543, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 849, "song_name": "Kattobi KEIKYU Rider", "level": "13+", "level_index": 3, "achievements": 100.5978, "fc": 3, "fs": 2, "dx_score": 2319, "dx_rating": 308.0, "rate": 0, "type": "standard" }], "scores_b15": [{ "id": 1527, "song_name": "enchanted wanderer", "level": "13+", "level_index": 3, "achievements": 100.7009, "fc": 2, "fs": 0, "dx_score": 1653, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1588, "song_name": "Complex Mind", "level": "13+", "level_index": 3, "achievements": 100.6411, "fc": null, "fs": 0, "dx_score": 2357, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1587, "song_name": "Halfway(>∀<)", "level": "13+", "level_index": 3, "achievements": 100.6558, "fc": 3, "fs": 0, "dx_score": 2476, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1542, "song_name": "ここからはじまるプロローグ。 (Kanon Remix)", "level": "13+", "level_index": 3, "achievements": 100.578, "fc": null, "fs": 0, "dx_score": 2536, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1553, "song_name": "Last Kingdom", "level": "13+", "level_index": 3, "achievements": 100.7854, "fc": 2, "fs": 0, "dx_score": 2328, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1590, "song_name": "あつすぎの歌", "level": "13+", "level_index": 3, "achievements": 100.7567, "fc": 3, "fs": 2, "dx_score": 2217, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1633, "song_name": "OMAKENO Stroke", "level": "13+", "level_index": 3, "achievements": 100.8466, "fc": 2, "fs": 0, "dx_score": 2033, "dx_rating": 310.0, "rate": 0, "type": "dx" }, { "id": 1546, "song_name": "地球", "level": "14", "level_index": 3, "achievements": 100.2835, "fc": null, "fs": 0, "dx_score": 2351, "dx_rating": 309.0, "rate": 1, "type": "dx" }, { "id": 1561, "song_name": "おとせサンダー", "level": "13+", "level_index": 4, "achievements": 100.5527, "fc": null, "fs": 0, "dx_score": 2621, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1556, "song_name": "Hello, Hologram", "level": "13+", "level_index": 3, "achievements": 100.7926, "fc": 2, "fs": 0, "dx_score": 2430, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1539, "song_name": "リフヴェイン", "level": "13+", "level_index": 3, "achievements": 100.5441, "fc": 3, "fs": 2, "dx_score": 1772, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1584, "song_name": "コンティニュー！ feat. 藍月なくる", "level": "13+", "level_index": 3, "achievements": 100.6865, "fc": 3, "fs": 0, "dx_score": 2434, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1543, "song_name": "モ°ルモ°ル (MZK Skippin' Remix)", "level": "13+", "level_index": 3, "achievements": 100.6718, "fc": 2, "fs": 2, "dx_score": 1885, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1533, "song_name": "にゃーにゃー冒険譚", "level": "13+", "level_index": 3, "achievements": 100.5203, "fc": null, "fs": 0, "dx_score": 2934, "dx_rating": 308.0, "rate": 0, "type": "dx" }, { "id": 1604, "song_name": "『ウソテイ』 ～一回戦せりなvsしろなvsなずな～", "level": "13+", "level_index": 3, "achievements": 100.5811, "fc": 3, "fs": 0, "dx_score": 2406, "dx_rating": 308.0, "rate": 0, "type": "dx" }] }
        // setBest35(data.scores_b35)
        // setBest15(data.scores_b15)
        // setRating15(data.rating_b15)
        // setRating35(data.rating_b35)
        if (localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
    }, [])

    const GetBindAccount = () => {
        setIsLoading(true)
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };
        console.log("start fetch bind account")
        fetch("https://dev.maimai.moe/api/maimai/maiweb/accounts", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log("get data")
                const data = JSON.parse(result)
                if (data[0].server) {
                    const updatedAccounts = data.map((account: any) => {
                        let from = "";
                        if (!isNaN(Number(account.identifier))) {
                            from = "lxns";
                        } else {
                            if (account.identifier.length > 10) {
                                from = "arcaed";
                            } else {
                                from = "divingfish";
                            }
                        }
                        return {
                            server: account.server,
                            nickname: account.nickname,
                            identifier: account.identifier,
                            from: from
                        };
                    });
                    setAccounts(updatedAccounts);
                }
                console.log(data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.error(error)
                setIsLoading(false)
            });
    }



    const GetBest50 = () => {
        setIsLoading(true)
        let nickname = ""
        if (nowFrom == "divingfish") {
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i].from == "divingfish") {
                    nickname = accounts[i].nickname
                }
            }
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            fetch(`https://dev.maimai.moe/api/maimai/divingfish/bests?username=${nickname}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const data = JSON.parse(result);
                    if (data.rating) {
                        setBest35(data.scores_b35)
                        setBest15(data.scores_b15)
                        setRating15(Math.ceil(data.rating_b15))
                        setRating35(Math.ceil(data.rating_b35))
                        setIsLoading(false)
                    }
                })
                .catch((error) => {
                    console.error(error)
                    setIsLoading(false)
                });
        }
        else if (nowFrom == "lxns") {
            for (let i = 0; i < accounts.length; i++) {
                if (accounts[i].from == "lxns") {
                    nickname = accounts[i].identifier
                }
            }
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            fetch(`https://dev.maimai.moe/api/maimai/lxns/bests?friend_code=${nickname}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const data = JSON.parse(result);
                    if (data.rating) {
                        setBest35(data.scores_b35)
                        setBest15(data.scores_b15)
                        setRating15(Math.ceil(data.rating_b15))
                        setRating35(Math.ceil(data.rating_b35))
                        setIsLoading(false)
                    }
                })
                .catch((error) => {
                    console.error(error)
                    setIsLoading(false)
                });
        }

    }

    return (
        <>
                <AnimatedComponent isVisible={true}>
                    <div className="relative w-[900px] p-5 flex flex-col justify-center items-center mx-auto">
                        <h1 className="text-2xl font-bold">B50</h1>
                        <button className="rounded-2xl mb-12 bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out" onClick={GetBindAccount}>查询当前账号可用数据源</button>
                        <div className="relative w-[900px] flex flex-row justify-center flex-wrap mx-auto">
                            <div className="absolute -top-12 flex flex-row justify-center items-center space-x-5 p-1 px-4">
                                <div className="flex flex-row justify-center items-center space-x-5 p-1 px-4 bg-green-500 rounded-2xl">
                                    <b>当前账户可用数据源:</b>
                                    {accounts.map((account, index) => {
                                        return (
                                            <button key={index} className="text-center rounded-2xl bg-blue-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out" onClick={() => setNowFrom(account.from)}>
                                                {account.from}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="p-1 px-4 bg-green-500 rounded-2xl">当前数据源:<b>{nowFrom}</b></div>
                                <button className="rounded-2xl bg-purple-500 p-1 px-4 text-white font-bold hover:scale-105 hover:shadow-lg duration-300 ease-in-out" onClick={GetBest50}>更新B50</button>
                                <h1 className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-2xl p-1 px-4">Rating:{rating35 + rating15}</h1>
                            </div>
                            {best35 && best35.length > 0 ? best35.map((song: any, index: number) => {
                                return (
                                    <Link href={`/music/${song.id}`} key={index} className="w-[160px] h-48 break-words p-2 m-2 border border-gray-300 rounded-lg shadow-md hover:scale-105 hover:shadow-xl duration-300 ease-in-out backdrop-filter backdrop-blur-lg bg-white bg-opacity-30">
                                        <h1 className="w-full h-10 text-lg font-bold truncate">{song.song_name}</h1>
                                        <h2 className="text-md">{song.level}</h2>
                                        <h3 className="text-sm text-gray-600 font-bold">{song.achievements}</h3>
                                        <img className="size-20 mt-2" src={`${baseUrl}/jacket/${song.id}.png`} alt={song.song_name} />
                                    </Link>
                                );
                            }) : <div className="w-full text-black h-48 break-words p-2 m-2 border border-gray-300 rounded-lg shadow-md hover:scale-105 hover:shadow-xl duration-300 ease-in-out backdrop-filter backdrop-blur-lg bg-white bg-opacity-30">暂无数据</div>}
                        </div>
                        <div className="w-[900px] flex flex-row justify-    center flex-wrap mx-auto">
                            {best15 && best15.map((song: any, index: number) => {
                                return (
                                    <AnimatedComponent isVisible={true}>
                                        <Link href={`/music/${song.id}`} key={index} className="w-[160px] h-48 break-words p-2 m-2 border border-gray-300 rounded-lg shadow-md hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
                                            <h1 className="w-full h-10 text-lg font-bold truncate">{song.song_name}</h1>
                                            <h2 className="text-md">{song.level}</h2>
                                            <h3 className="text-sm text-gray-600">{song.achievements}</h3>
                                            <img className="size-20 mt-2" src={`${baseUrl}/jacket/${song.id}.png`} alt={song.song_name} />
                                        </Link>
                                    </AnimatedComponent>
                                );
                            })}
                        </div>

                            {/* {isLoading && ( */}
                                <AnimatedComponent isVisible={isLoading}>
                                    <div className="fixed z-[1000] inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="w-16 h-16 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
                                    </div>
                                </AnimatedComponent>
                            {/* )} */}
                    </div>
                </AnimatedComponent>
        </>
    )
}

