'use client'

import AnimatedComponent from "@/app/components/AnimatedComponent";
import { useEffect, useState } from "react";


export default function FeedbackPage() {
    const [nickname, setName] = useState("") //称呼
    const [contact, setContact] = useState("") //联系方式
    const [category, setCategory] = useState("") //类别
    const [content, setContent] = useState("") //内容
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制弹窗状态
    const openModal = () => setIsModalOpen(true); // 打开弹窗
    const closeModal = () => setIsModalOpen(false); // 关闭弹窗
    const [display, setDisplay] = useState("正在提交中，请稍等");


    const sendFeedback = () => {
        openModal();
        let SendContent = "称呼：" + nickname + "\n联系方式：" + contact + "\n类别：" + category + "\n内容：" + content
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            "to": "e2544733@outlook.com",
            "subject": category + "反馈",
            "text": SendContent
        });
        console.log(raw)
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };
        fetch("https://dev.maimai.moe/dev/api/send-email", requestOptions)
            .then((response) => {
                const statusCode = response.status;
                console.log(`Status Code: ${statusCode}`);
                if (statusCode === 200) {
                    setDisplay("提交成功，感谢您的反馈")
                } else {
                    setDisplay("提交失败，请稍后再试")
                }
            })
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    return (
        <>
            <AnimatedComponent isVisible={true}>
                <img src="/img/bg_shines.png" className="fixed" alt="" />
                <div className="relative w-full">
                    <div className="w-[400px] h-[200px] max-sm:w-[180px] bg-[url('/img/moon.png')] bg-no-repeat bg-contain bg-center z-10 mx-auto mt-20 max-sm:mt-10 max-sm:pt-10">
                        <div>
                            <img src="/img/logo.png" alt="" onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                    <div className="w-[750px] h-[1200px] max-sm:w-[375px] max-sm:h-[700px] mx-auto bg-[url('/img/main_bg.png')] bg-no-repeat bg-contain rounded-2xl mt-10 max-sm:mt-0 mb-10 p-20 max-sm:p-10 z-10 text-blue-600  tracking-wider ">
                        <form className="max-sm:h-[500px] overflow-auto scrollbar-hide">
                            <label>1、我们如何称呼您？🤩</label><br></br>
                            <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="text" name="name" value={nickname} onChange={(e) => setName(e.target.value)} /><br></br>
                            <label>2、您的邮箱📮</label><br></br>
                            <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="email" name="email" value={contact} onChange={(e) => setContact(e.target.value)} /><br></br>
                            <label>3、您想要反馈的问题类别</label><br></br>
                            <div className="flex items-center justify-start space-x-10">
                                <div><input className="text-black mr-4 my-2" type="radio" name="identity" value="bug" onChange={(e) => setCategory(e.target.value)} /><label>Bug🐞</label></div>
                                <div><input className="text-black mr-4" type="radio" name="identity" value="function" onChange={(e) => setCategory(e.target.value)} /><label>功能💡</label></div>
                                <div><input className="text-black mr-4" type="radio" name="identity" value="optimize" onChange={(e) => setCategory(e.target.value)} /><label>优化😭</label><br></br></div>
                            </div>
                            <label>4、您要反馈的内容是</label><br></br>
                            <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="email" name="email" value={content} onChange={(e) => setContent(e.target.value)} /><br></br>
                            <label>5、我们的吹水群群号为734304941，欢迎各位加入。当然您也可以在此反馈问题</label><br></br>
                            {/* <label>6、关于我们乌蒙大象中国站，有什么想说的🧐</label><br></br> */}
                            {/* <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="text" name="else" value={contact} onChange={(e) => setContact(e.target.value)} /><br></br> */}
                            <div className="flex justify-center">
                                <button
                                    type="button" // 修改为 type="button" 以避免表单提交
                                    onClick={sendFeedback} // 点击按钮打开弹窗
                                    className="w-36 h-10 bg-[url('/img/bg_button.png')] bg-no-repeat bg-cover rounded-2xl flex items-center justify-center text-white  text-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 active:shadow-md transition duration-300 ease-in-out"
                                >
                                    提交反馈
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-[90%] md:w-[400px] rounded-lg shadow-lg p-6 relative">
                            <button
                                onClick={closeModal} // 点击关闭按钮
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-200"
                            >
                                ✕
                            </button>
                            <h2 className="text-xl  mb-4 text-gray-800">Thank you </h2>
                            <img src="/img/chara.png" alt="" />
                            <p className="text-gray-600 mt-10 mb-4 text-center">{display}</p>
                            <button
                                onClick={closeModal} // 点击关闭按钮
                                className="w-full py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
                            >
                                确定
                            </button>
                        </div>
                    </div>
                )}
            </AnimatedComponent>ƒ
        </>

    )
}