"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import { IoInformationCircle } from 'react-icons/io5';

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
    const [string, setString] = useState<string>("暂无通知");


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
                            setString("如果您需要从神秘二维码更新B50到水鱼，请重新绑定水鱼账号");
                            setIsVisible(true);
                        }
                    } else {
                        setString("你好");
                    }
                })
                .catch(error => console.log('error', error));
        }
    }, [token])

    useEffect(() => {
        if (string == "暂无通知" || string == "你好") {
            setIsVisible(false);
        }
    }, [string]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border-l-4 px-4 py-3 shadow-lg ${typeStyles[type]}`}
                    role="alert"
                >
                    <div className="flex items-center">
                        <div className="mr-3">{icons[type]}</div>
                        <div className="flex-1 text-sm font-medium">{string}</div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-auto rounded-md p-1 hover:bg-gray-200 hover:bg-opacity-50 transition-colors focus:outline-none"
                            aria-label="关闭"
                        >
                            <IoMdClose className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notice;
