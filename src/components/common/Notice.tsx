"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IoMdClose } from "react-icons/io"
import { IoInformationCircle } from "react-icons/io5"
import { ThirdAccount } from "@/types/user" // Updated import path assumption, will fix later if needed
import http from "@/services/request" // Updated import path assumption
import Image from "next/image"

interface NoticeProps {
  type?: "info" | "success" | "warning" | "error"
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  duration?: number // 自动关闭的时间（毫秒），如不设置则不自动关闭
}

interface RawAccount {
  server: string
  nickname: string
  identifier: string
}

const Notice: React.FC<NoticeProps> = ({ type = "info" }) => {
  const [token, setToken] = useState<string>("")
  const [isVisible, setIsVisible] = useState(false)
  const [string, setString] = useState<string>("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accounts, setAccounts] = useState<ThirdAccount[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notice, setNotice] = useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showModal, setShowModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notice_index = 0

  // 不同类型通知的样式
  const typeStyles = {
    info: "bg-blue-50 border-blue-300 text-blue-700",
    success: "bg-green-50 border-green-300 text-green-700",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-700",
    error: "bg-red-50 border-red-300 text-red-700",
  }

  // 不同类型通知的图标
  const icons = {
    info: <IoInformationCircle className="h-5 w-5 text-blue-500" />,
    success: <IoInformationCircle className="h-5 w-5 text-green-500" />,
    warning: <IoInformationCircle className="h-5 w-5 text-yellow-500" />,
    error: <IoInformationCircle className="h-5 w-5 text-red-500" />,
  }

  /*
  const NextNotice = () => {
    if (notice.length > 0) {
      setString(notice[notice_index])
      setNotice(notice.slice(1))
      notice_index++
    } else {
      setIsVisible(false)
    }
  }
  */

  useEffect(() => {
    setIsVisible(true)
    const temp = localStorage.getItem("token")
    if (temp) {
      setToken(temp)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (token !== "") {
        try {
          // 并行请求用户信息和账号绑定信息，提高效率
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [userResult, accountsData] = await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            http.get<any>("/api/user/me", null, { retry: 3 }),
            http.get<RawAccount[]>("/api/maimai/maiweb/accounts", null, { retry: 3 }),
          ])

          // 处理用户信息请求结果
          // const data = userResult // 已经在http拦截器中处理了response.data
          const msg = ""
          setString(msg)
          setIsVisible(true)

          // 处理账号绑定信息
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          if (Array.isArray(accountsData) && accountsData.length > 0 && accountsData[0].server) {
            const updatedAccounts: ThirdAccount[] = accountsData.map(account => {
              let from = ""
              if (!isNaN(Number(account.identifier))) {
                from = "lxns"
              } else {
                if (account.identifier.length > 40) {
                  from = "maiweb"
                } else {
                  from = "divingfish"
                }
              }
              return {
                server: account.server,
                nickname: account.nickname,
                identifier: account.identifier,
                from: from,
              }
            })
            setAccounts(updatedAccounts)
          }
        } catch {
          // 错误处理，已移除调试日志
        }
      } else {
        setIsVisible(true)
      }
    }

    fetchData()
  }, [token])

  useEffect(() => {
    if (string == "暂无通知" || string == "") {
      setIsVisible(false)
    }
  }, [string])

  const handleNoticeClick = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 z-[1000] max-w-md rounded-lg border-l-4 px-4 py-3 shadow-lg cursor-pointer ${typeStyles[type]}`}
            role="alert"
            onClick={handleNoticeClick}
          >
            <div className="flex items-center">
              <div className="mr-3">{icons[type]}</div>
              <div className="flex-1 text-sm font-medium">{string}</div>
              <button
                onClick={e => {
                  e.stopPropagation()
                  setIsVisible(false)
                }}
                className="ml-auto rounded-md p-1 hover:bg-gray-200 hover:bg-opacity-50 transition-colors focus:outline-none"
                aria-label="关闭"
              >
                <IoMdClose className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 弹窗模态框 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="overflow-y-auto max-h-[65vh] p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">全站通知</h3>
                  <button
                    onClick={closeModal}
                    className="rounded-md p-2 hover:bg-gray-100 transition-colors focus:outline-none flex-shrink-0 ml-4"
                    aria-label="关闭"
                  >
                    <IoMdClose className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="text-gray-700 leading-7 space-y-6">
                  <Image
                    src="https://maimai.sega.jp/storage/root/chara.png"
                    alt="Banner Image"
                    width={320}
                    height={320}
                    className="mx-auto max-w-xs h-auto"
                  />
                  <p className="text-lg font-bold text-gray-800">尊敬的用户：</p>

                  <p className="text-sm leading-6">
                    当前查分器手动导入不可用，自动导入将在每天上午9点与下午18点进行。
                  </p>
                  <p className="text-sm leading-6">
                    下周完成国内域名备案后将迁移至国内，网站整体速度与服务稳定性将有明显提升。
                  </p>

                  <div className="text-center border-t pt-6 mt-8">
                    <p className="text-base font-medium text-gray-600">感谢您的理解与支持！</p>

                    <div className="mt-6">
                      <a
                        href="https://github.com/Salt-House"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block py-4 px-10 bg-blue-400 text-white text-base font-bold no-underline rounded-md shadow-lg hover:bg-blue-500 transition-colors duration-300"
                      >
                        Salt House
                      </a>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                      © 2025 Salt House. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Notice
