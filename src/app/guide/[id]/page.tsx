'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import 'react-quill/dist/quill.snow.css'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <LoadingSpinner size="sm" message="加载编辑器..." />
})

interface params {
    id: string
}

export interface Author {
    id: number,
    username: string,
    privileges: number
}


export default function GuideDetailPage({ params }: { params: params }) {
    const [content, setContent] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [level, setLevel] = useState<string>('')
    const [id, setId] = useState<string>('')
    const [author, setAuthor] = useState<Author>({
        id: 0,
        username: '',
        privileges: 0
    })
    const textstroke = {
        textShadow: '-2px -2px 4px rgba(128, 90, 213, 1), 2px -2px 4px rgba(128, 90, 213, 1), -2px 2px 2px rgba(128, 90, 213, 1), 2px 2px 2px rgba(128, 90, 213, 1)'
    };
    const [isAuthor, setIsAuthor] = useState(false)
    const [created_at, setCreated_at] = useState<string>('')
    const [isEdit, setIsEdit] = useState(false)
    const [token, setToken] = useState('')
    const [modules, setModules] = useState<any>(null)
    const isValidBvId = (bvId: string): boolean => {
        const bvPattern = /^BV[0-9A-Za-z]{10}$/
        return bvPattern.test(bvId)
    }

    useEffect(() => {
        setToken(localStorage.getItem('token') || '')
        import('quill').then((Quill) => {
            const VideoBlot = Quill.default.import('formats/video')
            class CustomVideoBlot extends VideoBlot {
                static create(value: any) {
                    const node = super.create(value)
                    node.setAttribute('controls', 'true') // 添加视频控件
                    node.setAttribute('allowfullscreen', 'true') // 允许全屏
                    return node
                }
            }
            Quill.default.register('formats/video', CustomVideoBlot)

            setModules({
                toolbar: {
                    container: [
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    handlers: {
                        video: function (this: any) {
                            const bvId = prompt('请输入 Bilibili 的 BV 号：')
                            if (bvId && isValidBvId(bvId)) {
                                const range = this.quill.getSelection()
                                const iframeHtml = `
                              <div className="w-[100px] h-[100px]">
                              <iframe
                                src="https://player.bilibili.com/player.html?bvid=${bvId}"
                                style="width: 100%; height: 100%; border: none;"
                                allowFullScreen
                              ></iframe>
                              </div>`
                                this.quill.clipboard.dangerouslyPasteHTML(range.index, iframeHtml)
                            } else {
                                alert('请输入有效的 Bilibili BV 号！')
                            }
                        }
                    }
                }
            })
        })
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
                        id: data.author.id,
                        username: data.author.username,
                        privileges: data.author.privileges
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
    const changeGuide = () => {
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
                <Link href='/guide' className="inline-flex items-center text-white mb-5 hover:scale-105 transition-colors">
                    <FaArrowLeft className="mr-2" />
                    <span className="text-xl font-bold" style={textstroke}>返回教学列表</span>
                </Link>
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
                                    <p>{new Date(created_at).toLocaleString()}</p>
                                    <p>作者：{author.username}</p>
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

