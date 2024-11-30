'use client'
import { useEffect, useState } from "react"
import AnimatedComponent from "../components/AnimatedComponent";


export default function QuestionnairePage() {
  const [dataDict, setDataDict] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制弹窗状态
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    document.title = "问卷 - maimai中国玩家站";
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDataDict({ ...dataDict, [name]: value })
  }
  const submitButton = async () => {
    const jsonData = JSON.stringify(dataDict);
    console.log(jsonData);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: jsonData,
      redirect: "follow" as RequestRedirect,
    };

    try {
      const response = await fetch(
        "https://api.maimai.moe:8000/survey/2/report",
        requestOptions
      );
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }


    openModal();
  }

  const openModal = () => setIsModalOpen(true); // 打开弹窗
  const closeModal = () => setIsModalOpen(false); // 关闭弹窗

  return (
    <>

      <AnimatedComponent>
        <img src="/img/bg_shines.png" className="fixed" alt="" />
        <div className="relative w-full">
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]">
            <div className="flex justify-center mt-10">
              <div className="w-[1000px] h-[400px]  max-sm:h-[200px] max-sm:w-[180px] max-md:w-[200px] max-md:h-[200px] max-lg:w-[260px] max-lg:h-[220px] max-xl:w-[400px] max-xl:h-[300px] max-2xl:h-[300px]  bg-[url('/img/front_left.png')] bg-no-repeat bg-contain bg-left"></div>
              <div className="w-[1000px] h-[400px]  max-sm:h-[100px] max-sm:w-[60px]  max-md:w-[200px] max-md:h-[200px] max-lg:w-[260px] max-lg:h-[220px] max-xl:w-[400px] max-xl:h-[300px] max-2xl:h-[300px]  bg-no-repeat bg-contain bg-left"></div>
              <div className="w-[1000px] h-[400px]  max-sm:h-[200px] max-sm:w-[180px] max-md:w-[200px] max-md:h-[200px] max-lg:w-[260px] max-lg:h-[220px] max-xl:w-[400px] max-xl:h-[300px] max-2xl:h-[300px]  bg-[url('/img/front_right.png')] bg-no-repeat bg-contain bg-left"></div>
            </div>
            <div className="flex justify-center max-sm:hidden max-md:hidden max-lg:hidden">
              <div className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px]  bg-[url('/img/chara-left.png')] bg-no-repeat bg-contain bg-left"></div>
              <div className="w-[1200px]"></div>
              <div className="w-[1000px] h-[600px] max-xl:h-[400px] max-xl:w-[300px] bg-[url('/img/chara-right.png')] bg-no-repeat bg-contain bg-right"></div>
            </div>
          </div>
          <div className="w-[400px] h-[200px] max-sm:w-[180px] bg-[url('/img/moon.png')] bg-no-repeat bg-contain bg-center z-10 mx-auto mt-20 max-sm:mt-10 max-sm:pt-10">
            <div>
              <img src="/img/logo.png" alt="" />
            </div>
          </div>
          <div className="w-[750px] h-[1200px] max-sm:w-[375px] max-sm:h-[700px] mx-auto bg-[url('/img/main_bg.png')] bg-no-repeat bg-contain rounded-2xl mt-10 max-sm:mt-0 mb-10 p-20 max-sm:p-10 z-10 text-blue-600 font-bold tracking-wider ">
            <form className="max-sm:h-[500px] overflow-auto scrollbar-hide">
              <label>1、我们如何称呼您？🤩</label><br></br>
              <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="text" name="name" onChange={handleChange} /><br></br>
              <label>2、您的邮箱📮</label><br></br>
              <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="email" name="email" onChange={handleChange} /><br></br>
              <label>3、您认为我们需要添加什么样的功能🤔</label><br></br>
              <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="text" name="addFunction" onChange={handleChange} /><br></br>
              <label>4、您是否愿意参加到我们的开发中?🤗</label><br></br>
              <label >(如果您选择了除不愿意之外的任何选项，您将在两天之内收到来自SaltHouse的邀请)</label><br></br>
              <input className="text-black my-2" type="radio" name="identity" value="QA" onChange={handleChange} />QA(测试)
              <input className="text-black" type="radio" name="identity" value="MainDevelop" onChange={handleChange} />主要功能开发
              <input className="text-black" type="radio" name="identity" value="derice" onChange={handleChange} />衍生功能开发<br></br>
              <input className="text-black my-2" type="radio" name="identity" value="Art" onChange={handleChange} />美工支持
              <input className="text-black mb-5" type="radio" name="identity" value="NO" onChange={handleChange} />不愿意<br></br>
              <label>5、如果您希望加入我们的吹水群，请留下QQ号</label><br></br>
              <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="text" name="qq" onChange={handleChange} /><br></br>
              <label>6、关于我们乌蒙大象中国站，有什么想说的🧐</label><br></br>
              <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="text" name="else" onChange={handleChange} /><br></br>
              <div className="flex justify-center">
                <button
                  type="button" // 修改为 type="button" 以避免表单提交
                  onClick={submitButton} // 点击按钮打开弹窗
                  className="w-36 h-10 bg-[url('/img/bg_button.png')] bg-no-repeat bg-cover rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 active:shadow-md transition duration-300 ease-in-out"
                >
                  提交问卷
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 弹窗 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] md:w-[400px] rounded-lg shadow-lg p-6 relative">
              <button
                onClick={closeModal} // 点击关闭按钮
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-200"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-800">弹窗内容</h2>
              <img src="/img/chara.png" alt="" />
              <p className="text-gray-600 mt-10 mb-4 text-center">感谢您的提交</p>
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