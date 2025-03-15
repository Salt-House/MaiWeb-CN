'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <LoadingSpinner size="sm" message="加载编辑器..." />
})

interface params {
    id: string
}

interface author {
    id:number,
    username:string,
    privileges:number
}


export default function GuideDetailPage({ params }: { params: params }) {
    const [content, setContent] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [level, setLevel] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [author, setAuthor] = useState<author>({
        id:0,
        username:'',
        privileges:0
    })
    const [isAuthor, setIsAuthor] = useState(false)
    const [created_at, setCreated_at] = useState<string>('')
    const [isEdit, setIsEdit] = useState(false)
    const [token, setToken] = useState('')
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    }


    useEffect(() => {
        setToken(localStorage.getItem('token') || '')
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        fetch(`https://dev.maimai.moe/api/tutorial/${params.id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const data = JSON.parse(result)
                try {
                    setContent(data.content)
                    setTitle(data.title)
                    setLevel(data.level)
                    setId(data.id)
                    setAuthor({
                        id:data.author.id,
                        username:data.author.username,
                        privileges:data.author.privileges
                    })
                    console.log(data.author.id)
                    setCreated_at(data.created_at)
                } catch (e) {
                    console.log(e)
                }

            })
            .catch((error) => console.error(error));

    }, [])

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
                    const data = JSON.parse(result)
                    if (data.id == author.id) {
                        setIsAuthor(true)
                    } else {
                        setIsAuthor(false)
                    }
                })
                .catch((error) => console.error(error));
        }
    }, [author])
    const changeGuide=()=> {
        if (!title.trim()) {
            alert('请输入标题')
            return
        }
        if (!content.trim()) {
            alert('请输入内容')
            return
        }

        if (token == '') {
            alert('请先登录')
            return
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            "title": title,
            "level": level,
            "content": content
        });
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
        };
        console.log(requestOptions)
        fetch(`https://dev.maimai.moe/api/tutorial/${params.id}`, requestOptions)
            .then((response) => {
                if (response.status == 200) {
                    alert('修改成功')
                    setIsEdit(false)
                } else {
                    alert('修改失败，请反馈问题')
                    return
                }
            })
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }



    return (
        <>
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <div className="space-y-6">
                    {isEdit ? <>
                        <div className="max-w-4xl mx-auto px-4 py-8">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-white mb-6"
                                    style={{
                                        textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
                                    }}>
                                    修改文稿
                                </h1>
                                <input
                                    type="text"
                                    placeholder="请输入标题"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
                                />
                                <div className="mt-4">
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
                                    >
                                        <option value="入门">入门</option>
                                        <option value="进阶">进阶</option>
                                        <option value="高级">高级</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-4">
                                <ReactQuill
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    className="h-[500px] mb-12"
                                />
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={changeGuide}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200"
                                >
                                    保存文稿
                                </button>
                            </div>
                        </div>

                    </> :
                        <>
                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                                <h2 className="text-2xl font-bold mb-4 text-purple-800">{title}</h2>
                                <div className="text-sm text-gray-500 mb-4 flex space-x-5">
                                    <p>创建时间：{new Date(created_at).toLocaleString()}</p>
                                    <p>作者：{author.username}</p>
                                </div>
                                <div className="prose max-w-none">
                                    <ReactQuill
                                        value={content}
                                        readOnly={false}
                                        theme="bubble"
                                    />
                                </div>
                                {/* 判断是否为作者,如果是作者则显示编辑按钮 */}
                                {isAuthor && (
                                    <button 
                                        className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200" 
                                        onClick={() => setIsEdit(true)}
                                    >
                                        编辑
                                    </button>
                                )}
                            </div>
                        </>
                    }

                </div>
            </div>
        </>
    )
}

