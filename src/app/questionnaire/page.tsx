'use client'
import { use, useEffect, useState } from "react"
import AnimatedComponent from "../components/AnimatedComponent";


export default function QuestionnairePage() {
  const [dataDict, setDataDict] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制弹窗状态
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState(null);
  const [display, setDisplay] = useState("正在提交中，请稍等");
  const [bonus, setBonus] = useState("请先选择第四项")
  const [bonusSingle, setBonusSingle] = useState(false)

  useEffect(() => {
    const now = new Date();
    const hours = now.getUTCHours() + 8; // Convert to East 8th timezone
    if (hours >= 22 && hours < 23) {
      alert("系统正处于开发阶段，每天22:30-23:00为部署测试时间，网站不稳定，您的数据可能不会被记录\n请注意，本问卷仅限于中国大陆地区，如果您不在中国大陆地区，请不要填写");
    }
  }, []);

  useEffect(() => {
    document.title = "问卷 - maimai中国玩家站";
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDataDict({ ...dataDict, [name]: value })
    if (name == 'identity' && value != "NO") {
      setBonus("参与我们的开发，您可以获得由我们提供的二级域名，不过请遵循国家法律法规")
      setBonusSingle(true)
    } else if (name == 'identity') {
      setBonusSingle(false)
      setBonus("参与我们的抽奖获取其立牌")
    }
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
    openModal();
    try {
      const response = await fetch(
        "https://www.maimai.moe/apisurvey/2/report",
        requestOptions
      );
      const result = await response.text();
      console.log(result);
      setDisplay("提交成功，感谢您")
    } catch (error) {
      console.error("Error:", error);
      setDisplay("提交失败")
    }


  }

  const openModal = () => setIsModalOpen(true); // 打开弹窗
  const closeModal = () => setIsModalOpen(false); // 关闭弹窗

  return (
    <>
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
              <img src="/img/logo.png" alt="" onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }} />
            </div>
          </div>
          <div className="w-[750px] h-[1200px] max-sm:w-[375px] max-sm:h-[700px] mx-auto bg-[url('/img/main_bg.png')] bg-no-repeat bg-contain rounded-2xl mt-10 max-sm:mt-0 mb-10 p-20 max-sm:p-10 z-10 text-blue-600  tracking-wider ">
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
              <input className="text-black" type="radio" name="identity" value="Derive" onChange={handleChange} />衍生功能开发<br></br>
              <input className="text-black my-2" type="radio" name="identity" value="Art" onChange={handleChange} />美工支持
              <input className="text-black mb-5" type="radio" name="identity" value="NO" onChange={handleChange} />不愿意<br></br>
              <label>5、我们的吹水群群号为734304941，欢迎各位加入</label><br></br>
              <label>6、关于我们乌蒙大象中国站，有什么想说的🧐</label><br></br>
              <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="text" name="else" onChange={handleChange} /><br></br>
              <label>7、福利<br></br>{bonus}</label>
              {bonusSingle ? (
                <div>
                  <label>请输入您需要的二级域名</label>
                  <input className="w-full px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300" type="text" name="domain" onChange={handleChange} /><br></br>
                  <label>请从下列图片中选择一个作为您的立牌图案，如果您被抽中，将其作为立牌奖励邮寄给您</label>
                  <div className=" h-48 overflow-x-auto scrollbar-hide flex space-x-10">
                    <div className="size-40 flex mt-5 flex-col justify-center items-center">
                      <img className="w-[160px] object-contain" src="/img/chara-left.png" alt="" />
                      <label className="mt-2">
                        <input className="mr-2 text-blue-600" type="radio" name="goods" value="salt" onChange={handleChange} />
                        Salt
                      </label>
                    </div>
                    <div className="size-40 flex mt-5 flex-col justify-center items-center">
                      <img className="w-[160px] object-contain" src="/img/chara-right.png" alt="" />
                      <label className="mt-2">
                        <input className="mr-2 text-blue-600" type="radio" name="goods" value="milk" onChange={handleChange} />
                        Milk
                      </label>
                    </div>
                    <div className="size-40 flex mt-5 flex-col justify-center items-center">
                      <img className="w-[160px] object-contain" src="/img/chara.png" alt="" />
                      <label className="mt-2">
                        <input className="mr-2 text-blue-600" type="radio" name="goods" value="SaltMilk" onChange={handleChange} />
                        Salt&Milk
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label>请从下列图片中选择一个作为您的立牌图案，如果您被抽中，将其作为立牌奖励邮寄给您</label>
                  <div className=" h-48 overflow-x-auto scrollbar-hide flex space-x-10">
                    <div className="size-40 flex mt-5 flex-col justify-center items-center">
                      <img className="w-[160px] object-contain" src="/img/chara-left.png" alt="" />
                      <label className="mt-2">
                        <input className="mr-2 text-blue-600" type="radio" name="goods" value="salt" onChange={handleChange} />
                        Salt
                      </label>
                    </div>
                    <div className="size-40 flex mt-5 flex-col justify-center items-center">
                      <img className="w-[160px] object-contain" src="/img/chara-right.png" alt="" />
                      <label className="mt-2">
                        <input className="mr-2 text-blue-600" type="radio" name="goods" value="milk" onChange={handleChange} />
                        Milk
                      </label>
                    </div>
                    <div className="size-40 flex mt-5 flex-col justify-center items-center">
                      <img className="w-[160px] object-contain" src="/img/chara.png" alt="" />
                      <label className="mt-2">
                        <input className="mr-2 text-blue-600" type="radio" name="goods" value="SaltMilk" onChange={handleChange} />
                        Salt&Milk
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  type="button" // 修改为 type="button" 以避免表单提交
                  onClick={submitButton} // 点击按钮打开弹窗
                  className="w-36 h-10 bg-[url('/img/bg_button.png')] bg-no-repeat bg-cover rounded-2xl flex items-center justify-center text-white  text-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 active:shadow-md transition duration-300 ease-in-out"
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
    </>
  )
}