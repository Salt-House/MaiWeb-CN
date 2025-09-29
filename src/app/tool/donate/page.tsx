"use client"

import { useEffect, useState } from "react"

export default function DonatePage() {
  const [plan, setPlan] = useState("/img/thanks/AlipayChino.png")
  const prePlan = [
    { name: "一瓶大水", src: "/img/thanks/AlipayChino3.png" },
    { name: "一把maimai", src: "/img/thanks/AlipayChino6.png" },
    { name: "一杯奶茶", src: "/img/thanks/AlipayChino12.png" },
    { name: "为熬夜修bug的程序🦍来一杯咖啡", src: "/img/thanks/AlipayChino24.png" },
  ]
  const [display, setDisplay] = useState("正在查询登录状态")
  const [isModalOpen, setIsModalOpen] = useState(false) // 控制弹窗状态
  const [checkUser, setCheckUser] = useState(false)
  const [token, setToken] = useState("")
  const [paycode, setPaycode] = useState("")

  useEffect(() => {
    openModal()
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (token) {
      closeModal()
    } else {
      setDisplay("您似乎没登录，捐赠将不会记录到账户")
    }
  }, [token])
  const openModal = () => setIsModalOpen(true) // 打开弹窗
  const closeModal = () => setIsModalOpen(false) // 关闭弹窗

  return (
    <>
      <div className="mt-20 max-sm:w-[400px] max-sm:flex-col w-[900px] max-sm:items-center max-sm:justify-start h-[700px] flex justify-center items-start mx-auto space-x-5">
        <div className="max-sm:w-[400px] max-sm:h-[260px] max-sm:p-2 max-sm:space-y-1 w-[200px] h-[500px] flex flex-col space-y-5 rounded-2xl bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg">
          {prePlan.map((item, index) => (
            <div
              key={index}
              className={`m-4 max-sm:w-full max-sm:text-center max-sm:m-1 rounded-2xl transition-all duration-300 ease-in-out bg-blue-500 p-4 cursor-pointer hover:bg-opacity-50 `}
              onClick={() => setPlan(item.src)}
            >
              <p
                className={` text-white font-bold hover:text-red-500 transition-all duration-300 ease-in-out ${plan == item.src ? "scale-110" : "scale-120"} `}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
        <div className="max-sm:w-[300px] max-sm:mt-2 max-sm:h-[100px] w-[400px] h-[500px] rounded-2xl bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg">
          <img src={plan} className="rounded-2xl" alt="" />
        </div>
        <div className="relative max-sm:hidden w-[300px] h-[300px] flex flex-col justify-start items-start p-3 space-y-5 rounded-2xl bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg">
          <label className="pl-4 font-bold text-black">请填入您的支付单号</label>
          <input
            className="w-11/12 mx-3  px-4 py-2 my-2 text-gray-700 bg-gradient-to-r from-gray-100 via-white to-gray-100 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-blue-400 hover:shadow-lg transition duration-300"
            type="text"
            name="paycode"
            value={paycode}
            onChange={e => setPaycode(e.target.value)}
          />
          <br></br>
          <button className="w-64 h-12 border-4 border-[rgb(0,108,196)] transition-all duration-300 ease-in-out shadow-sm hover:shadow-xl rounded-full bg-blue-500 text-xl font-bold">
            记录捐赠记录
          </button>
          <div className="absolute z-[1000] inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <h1 className="text-xl text-white font-bold tracking-wide">
              完善中，请保留好您的支付单号
            </h1>
          </div>
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
            <h2 className="text-xl  mb-4 text-gray-800">提醒</h2>
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
