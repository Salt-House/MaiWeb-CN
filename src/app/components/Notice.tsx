"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { IoInformationCircle } from 'react-icons/io5';
import { ThirdAccount } from '../user/model';

interface NoticeProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number; // 自动关闭的时间（毫秒），如不设置则不自动关闭
}

const Notice: React.FC<NoticeProps> = ({
  type = 'info',
  duration,
}) => {
  const [token, setToken] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [string, setString] = useState<string>("");
  const [accounts, setAccounts] = useState<ThirdAccount[]>([]);
  const [notice, setNotice] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  let notice_index = 0;

  // 不同类型通知的样式
  const typeStyles = {
    info: 'bg-blue-50 border-blue-300 text-blue-700',
    success: 'bg-green-50 border-green-300 text-green-700',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-700',
    error: 'bg-red-50 border-red-300 text-red-700',
  };

  // 不同类型通知的图标
  const icons = {
    info: <IoInformationCircle className="h-5 w-5 text-blue-500" />,
    success: <IoInformationCircle className="h-5 w-5 text-green-500" />,
    warning: <IoInformationCircle className="h-5 w-5 text-yellow-500" />,
    error: <IoInformationCircle className="h-5 w-5 text-red-500" />,
  };

  const NextNotice = () => {
    if (notice.length > 0) {
      setString(notice[notice_index]);
      setNotice(notice.slice(1));
      notice_index++;
    } else {
      setIsVisible(false);
    }
  }

  useEffect(() => {
    let temp = localStorage.getItem("token");
    if (temp) {
      setToken(temp);
    }
  }, [])

  useEffect(() => {
    if (token != "") {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };

      fetch("https://dev.maimai.moe/api/user/me", requestOptions)
        .then(response => response.text())
        .then(result => {
          const data = JSON.parse(result);
          if (data?.id) {
            if (data.id <= 72) {
              setString("maimai.moe 关于近期账号安全问题的声明");
              setIsVisible(true);
            }
          } else {
            setString("你好");
          }
        })
        .catch(error => console.log('error', error));

      GetBindAccount();
    }
  }, [token])

  useEffect(() => {
    if (string == "暂无通知" || string == "你好" || string == "") {
      setIsVisible(false);
    }
  }, [string]);

  const GetBindAccount = () => {
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
              if (account.identifier.length > 40) {
                from = "maiweb";
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
      })
      .catch((error) => {
        console.error(error)
      });
  }

  const handleNoticeClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border-l-4 px-4 py-3 shadow-lg cursor-pointer ${typeStyles[type]}`}
            role="alert"
            onClick={handleNoticeClick}
          >
            <div className="flex items-center">
              <div className="mr-3">{icons[type]}</div>
              <div className="flex-1 text-sm font-medium">{string}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto max-h-[65vh] p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">maimai.moe 关于近期账号安全问题的声明</h3>
                  <button
                    onClick={closeModal}
                    className="rounded-md p-2 hover:bg-gray-100 transition-colors focus:outline-none flex-shrink-0 ml-4"
                    aria-label="关闭"
                  >
                    <IoMdClose className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="text-gray-700 leading-7 space-y-6">
                  <img
                    src="https://maimai.sega.jp/storage/root/chara.png"
                    alt="Banner Image"
                    className="mx-auto max-w-xs h-auto"
                  />
                  <p className="text-lg font-bold text-gray-800">尊敬的用户：</p>

                  <p className="text-sm leading-6">
                    近期我们注意到全国范围内出现大规模<strong>游戏账号</strong>异常情况，为保障用户权益并证明Maimaimoe提供的相关服务的安全性，特此发布安全声明。
                    我们的服务严格遵循只读原则，仅对数据进行读操作，未来也不会开发任何涉及<strong>游戏账号</strong>操作的写入服务。
                  </p>

                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">攻击手段猜测</h4>
                    <p className="text-sm leading-6 mb-2">
                      <strong>此内容涉及的所有数据均为游戏账号</strong>
                    </p>
                    <ul className="text-sm leading-6 list-disc list-inside space-y-1">
                      <li>出现对其他数据库进行恶意攻击窃取用户凭证</li>
                      <li>极其恶意的遍历用户ID进行攻击（近期机台网络加载极为缓慢）</li>
                    </ul>
                    <p className="text-sm leading-6 mt-2">
                      我们认为没有开发者或服务的相关数据的泄露问题，此次攻击行为为极其恶劣的遍历用户ID攻击
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">自查报告</h4>
                    <p className="text-sm leading-6 mb-2">
                      问题发生后，我们第一时间关闭了相关后端接口与前端功能。经过全面自查：
                    </p>
                    <ul className="text-sm leading-6 list-disc list-inside space-y-1">
                      <li>后端接口逻辑检查：未发现任何写入服务接口，无任何可能导致账号异常的安全漏洞</li>
                      <li>数据库访问日志审计：除正常的B50数据更新和用户查询操作外，未发现异常访问记录</li>
                    </ul>
                    <p className="text-sm leading-6 mt-2">
                      MaimaiMoe网站账号未出现泄露，且大概率其他服务开发者数据也未曾出现泄露。
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">安全建议</h4>
                    <p className="text-sm leading-6 mb-2">
                      鉴于可能存在的恶意攻击行为，建议您：
                    </p>
                    <ul className="text-sm leading-6 list-disc list-inside space-y-1">
                      <li>检查已绑定的第三方服务是否正常运行</li>
                      <li>及时解绑已停止服务的平台</li>
                    </ul>
                  </div>

                  <div className="text-center border-t pt-6 mt-8">
                    <p className="text-base font-medium text-gray-600">
                      感谢您对我们服务的信任与支持！
                    </p>

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
  );
};

export default Notice;
