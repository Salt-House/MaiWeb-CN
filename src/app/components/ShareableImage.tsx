import { ReactNode, useEffect, useRef, useState } from 'react';
import domtoimage from 'dom-to-image';
import { UserProfile } from '../user/profile/page';
import { defaultUserProfile } from '../user/profile/page';

interface MusicGradeProps {
    id: number;
    song_name: string;
    level: string;
    level_index: number;
    achievements: number;
    fc: number | null;
    fs: number;
    dx_score: number;
    dx_rating: number;
    rate: number;
    type: string;
}


let baseUrl = "https://assets2.lxns.net/maimai"


export default function ShareableImage() {
    const contentRef = useRef<HTMLDivElement>(null);
    const [best, setBest] = useState<any>();
    const [ratings, setRatings] = useState<any>()
    const [rating15, setRating15] = useState<any>()
    const [rating35, setRating35] = useState<any>()
    const [imgUrl, setImgUrl] = useState<string>('');
    const [target, setTarget] = useState<string>("B50")
    const [best35, setBest35] = useState<any>()
    const [best15, setBest15] = useState<any>()
    const [token, setToken] = useState('')
    const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)
    const [imgDisplay, setImgDisplay] = useState(true)
    let ArcaedGradeB35: MusicGradeProps[] = []
    let ArcaedGradeB15: MusicGradeProps[] = []
    const [autoUpdate, setAutoUpdate] = useState(false);
    const [updateInterval, setUpdateInterval] = useState(2000);

    useEffect(()=>{
        setToken(localStorage.getItem('token') || '')
    },[])

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        intervalId = setInterval(() => {
            if (localStorage.getItem('best') != '' && localStorage.getItem('best') != null) {
                const temp = JSON.parse(localStorage.getItem('best') || '');
                if (temp.rating) {
                    setRatings(temp.rating)
                    setRating15(temp.rating_b15)
                    setRating35(temp.rating_b35)
                    setBest35(temp.scores_b35)
                    setBest15(temp.scores_b15)
                } else {
                    setRatings(temp.all_rating)
                    setRating15(temp.b15_rating)
                    setRating35(temp.b35_rating)
                    Array.isArray(temp.b15_scores) && temp.b15_scores.forEach((song: any, index: number) => {
                        ArcaedGradeB15.push({
                            id: Number(song.song_id),
                            song_name: song.song_name,
                            level: song.level,
                            level_index: song.level_index,
                            achievements: song.achievements,
                            fc: song.fc,
                            fs: song.fs,
                            dx_score: song.dx_score,
                            dx_rating: song.dx_rating,
                            rate: song.rate,
                            type: song.type
                        })
                    })
                    Array.isArray(temp.b35_scores) && temp.b35_scores.forEach((song: any, index: number) => {
                        ArcaedGradeB35.push({
                            id: Number(song.song_id),
                            song_name: song.song_name,
                            level: song.level,
                            level_index: song.level_index,
                            achievements: song.achievements,
                            fc: song.fc,
                            fs: song.fs,
                            dx_score: song.dx_score,
                            dx_rating: song.dx_rating,
                            rate: song.rate,
                            type: song.type
                        })
                    })
                }
            }
        }, updateInterval);
        return () => {
            if (localStorage.getItem('best') != '' && localStorage.getItem('best') != null) {
                clearInterval(intervalId);
                console.log(best)
            }
        };
    }, [autoUpdate, updateInterval])

    useEffect(() => {
        if (token != '') {
            const myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
            };

            fetch("https://dev.maimai.moe/api/user/me", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    setUserProfile(JSON.parse(result))
                })
                .catch((error) => console.error(error));
        }
    }, [token])


    const generateImage = async () => {
        if (!contentRef.current) return;
        try {
            // 生成 PNG
            const dataUrl = await domtoimage.toPng(contentRef.current, {
                width: 1480,  // 指定宽度
                height: 1480, // 指定高度
                style: {
                    visibility: 'visible',
                    transform: 'scale(1.0)',
                    opacity: '1'
                }
            });
            if (navigator.share) {
                // 转换 base64 为 Blob
                const blob = await fetch(dataUrl).then(res => res.blob());
                const file = new File([blob], 'share.png', { type: 'image/png' });

                navigator.share({
                    files: [file],
                }).catch(console.error);
            } else {
                // 下载图片
                const link = document.createElement('a');
                link.download = 'share.png';
                link.href = dataUrl;
                link.click();
            }
        } catch (error) {
            console.error('生成图片失败:', error);
        }
    };

    return (
        <>
            <div className="relative flex flex-col justify-center items-center p-4">
                <div className='w-[296px] h-[296px]' >
                    <div ref={contentRef} className={`relative w-[1480px] overflow-hidden h-[1480px] bg-[133, 144, 250] origin-top-left `}
                        style={{
                            transform: `scale(0.2)`,
                        }}>
                        <div className="absolute z-[-10] w-full h-full bg-gradient-to-b from-indigo-400 via-emerald-100 to-white">
                            <div className="absolute z-[-8] w-full h-full bg-[url('/img/bg_shines.png')]" >
                            </div>
                            <div className="w-full h-64 absolute -top-20 bg-[url('/img/aurora.png')] bg-no-repeat bg-cover"></div>
                            <div className="w-full h-64 absolute bottom-0 bg-[url('/img/bg_pc.png')] bg-no-repeat bg-cover"></div>
                        </div>
                        <div className='flex flex-row w-full mt-2 justify-around items-center mb-2'>
                            <img src="/img/logo.png" className='h-[120px]' alt="" />
                            <div className='w-[680px] h-[120px]'>
                                <div className='w-full p-2 flex flex-row items-center bg-no-repeat bg-contain bg-center rounded-xl  shadow-md' style={token == null ? { backgroundImage: `url(${baseUrl}/plate/1.png)` } : { backgroundImage: `url(${baseUrl}/plate/301.png)` }}>
                                    {/* 左侧头像 */}
                                    <div className='flex justify-center items-center mr-4' >
                                        {token == null || userProfile.mai_icon_id == null ?
                                            <img src={baseUrl + '/icon/1.png'} className='size-24 rounded-lg border-2 border-gray-300 shadow-lg' alt="用户头像" />
                                            :
                                            <img src={baseUrl + '/icon/' + userProfile.mai_icon_id + '.png'} className='size-24 rounded-lg border-2 border-gray-300 shadow-lg' alt="用户头像" />
                                        }
                                    </div>

                                    {/* 右侧信息区域 */}
                                    <div className='flex-1 flex flex-col justify-between h-24'>

                                        {/* Rating值 */}
                                        <div className='flex items-center'>
                                            <span className="relative bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-500 pl-2 pr-3 py-0.5 rounded-lg border-2 border-yellow-200 shadow-md text-left text-white overflow-clip">
                                                <span className="text-sm font-semibold text-white mr-2">Rating:</span>
                                                <span className="font-bold text-white">{userProfile.mai_rating}</span>
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent z-0"></div>
                                            </span>
                                        </div>

                                        {/* 姓名框 */}
                                        <div className='flex text-xl font-bold tracking-wider w-full'>
                                            <span className="bg-white pl-2 pr-2 py-0.5 rounded-lg border-2 border-gray-300 shadow-sm text-left w-64 truncate">
                                                {userProfile.username}
                                            </span>
                                        </div>

                                        {/* 称号 */}
                                        <div className='flex justify-start w-full'>
                                            <span className='inline-block bg-gradient-to-b from-gray-100 via-gray-300 to-gray-100 px-4 py-0 rounded-3xl border-2 border-gray-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.8)] text-center text-gray-700 italic text-sm w-64 truncate'>
                                                欢迎来到 maimai.moe!
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='h-[120px] w-[400px] flex flex-row space-x-4 justify-center items-center pr-10'>
                                <div className='flex'>
                                    <img src={'/img/momo.png'} className='h-20' alt="" />
                                    <img src={'/img/handblue.png'} alt="" />
                                    <img src={'/img/handpink.png'} alt="" />
                                </div>
                                <div className='flex flex-col items-end'>
                                    <div className='text-right'>
                                        <p className='text-sm text-white/80'>Powered by</p>
                                        <p className='text-lg font-bold text-white'>
                                            Salt House
                                        </p>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-sm text-white/80'>
                                            Offical Site
                                        </p>
                                        <p className='text-lg font-bold text-white'>
                                            www.maimai.moe
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {(() => {
                            switch (target) {
                                case 'B50':
                                    return (
                                        <>
                                            <div className="relative flex flex-row justify-center items-center flex-wrap">
                                                {best35 && best35.map((song: MusicGradeProps, index: number) => (
                                                    <ShareableImageSub
                                                        key={song.id}
                                                        {...song}
                                                        index={index}
                                                    />
                                                ))}
                                            </div>
                                            <div className='w-full h-[15px] my-2 px-10 flex justify-center items-center'>
                                                <hr className='w-full border-t-4 border-dotted border-blue-500' />
                                            </div>
                                            <div className="relative flex flex-row justify-center flex-wrap">
                                                {best15 && best15.map((song: MusicGradeProps, index: number) => (
                                                    <ShareableImageSub
                                                        key={song.id}
                                                        {...song}
                                                        index={index}
                                                    />))
                                                }
                                            </div>
                                        </>
                                    );
                                case 'B35':
                                    return (
                                        <div className="flex flex-col items-center justify-center">
                                            <h2 className="text-2xl font-bold mb-4">B35定数: {rating35}</h2>
                                            {best35 && best35.map((song: MusicGradeProps, index: number) => (
                                                <div key={index} className="mb-2">
                                                    {song.song_name} - {song.dx_rating}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                case 'B15':
                                    return (
                                        <div className="flex flex-col items-center justify-center">
                                            <h2 className="text-2xl font-bold mb-4">B15定数: {rating15}</h2>
                                            {best15 && best15.map((song: MusicGradeProps, index: number) => (
                                                <div key={index} className="mb-2">
                                                    {song.song_name} - {song.dx_rating}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        })()}
                    </div >
                </div>
                <div>
                    <button
                        onClick={generateImage}
                        className="mt-4 w-96 h-20 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        生成并分享图片
                    </button>

                </div>
            </div>
            <img src={imgUrl} alt="" />
        </>
    );
}

interface ShareableImageSubProps extends MusicGradeProps {
    index: number;
}

function ShareableImageSub(props: ShareableImageSubProps) {
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
    let bg = "bg-purple-500";
    switch (props.level_index) {
        case 0:
            levelColor = 'bg-green-500';
            nameColor = 'text-green-500';
            textstroke = {
                textShadow: '-2px -2px 4px rgba(34, 197, 94, 1), 2px -2px 4px rgba(34, 197, 94, 1), -2px 2px 2px rgba(34, 197, 94, 1), 2px 2px 2px rgba(34, 197, 94, 1)'
            };
            bg = "bg-green-500";
            break;
        case 1:
            levelColor = 'bg-yellow-500';
            nameColor = 'text-yellow-500';
            textstroke = {
                textShadow: '-2px -2px 4px rgba(234, 179, 8, 1), 2px -2px 4px rgba(234, 179, 8, 1), -2px 2px 2px rgba(234, 179, 8, 1), 2px 2px 2px rgba(234, 179, 8, 1)'
            };
            bg = "bg-yellow-500";
            break;
        case 2:
            levelColor = 'bg-red-500';
            nameColor = 'text-red-500';
            textstroke = {
                textShadow: '-2px -2px 4px rgba(239, 68, 68, 1), 2px -2px 4px rgba(239, 68, 68, 1), -2px 2px 2px rgba(239, 68, 68, 1), 2px 2px 2px rgba(239, 68, 68, 1)'
            };
            bg = "bg-red-500";
            break;
        case 3:
            levelColor = 'bg-purple-500';
            nameColor = 'text-white';
            textstroke = {
                textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
            };
            bg = "bg-purple-500";
            break;
        case 4:
            levelColor = 'bg-purple-500';
            nameColor = 'text-purple-500';
            textstroke = {
                textShadow: '-2px -2px 2px rgba(255, 255, 255, 1), 2px -2px 2px rgba(255, 255, 255, 1), -2px 2px 2px rgba(255, 255, 255, 1), 2px 2px 2px rgba(255, 255, 255, 1)'
            };
            bg = "bg-pink-500";
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
            <div className="w-[260px] h-[110px] m-2 border-white border-2 rounded-xl">
                <div className='relative w-full text-white h-full border-2 border-blue-500 rounded-xl flex'>
                    <div className={`absolute z-[-2] w-full h-full ${bg}`}></div>
                    <div className='absolute z-[-1] w-full h-full'>
                        <div className='absolute bottom-0 w-full h-[20px] bg-white'></div>
                    </div>
                    <div className='m-1 rounded-2xl border-white border-4'>
                        <div className=' border-4 rounded-xl bg-blue-500 border-blue-500'>
                            <img className="size-20 rounded-xl" src={`${baseUrl}/jacket/${props.id}.png`} alt={props.song_name} />
                        </div>
                    </div>
                    <div className='pt-1'>
                        <p className='w-[130px] truncate text-sm'>{props.song_name}</p>
                        <hr className="border-dashed" />
                        <p className='text-sm'>{props.id} {props.dx_score}</p>
                        <div className='text-2xl flex font-bold text-white '><p className='w-[100px] mr-1'>{props.achievements}</p><img src={`${achievements}`} className='w-[50px]' alt="" /> </div>
                        <div className='font-bold mt-1 flex items-center text-black'>
                            <p className='w-[30px]'>#{props.index + 1}</p>
                            <p className='w-[80px]'>{props.level}-{'>'}{props.dx_rating}</p>
                            {fc != null ?
                                <><img src={fc} className='w-[22px] h-[22px]' alt="" /></>
                                : <div className='w-[15px] h-[15px] rounded-full bg-gray-500'></div>}
                            {fs != null ?
                                <><img src={fs} className='w-[22px] h-[22px]' alt="" /></>
                                : <div className='w-[15px] h-[15px] rounded-full bg-gray-300'></div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}