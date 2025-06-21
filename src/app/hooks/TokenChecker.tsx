"use client";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";



/**
 * 自动检查 token 是否有效，并返回提示信息
 */
export default function TokenChecker() {
    const [statusMessage, setStatusMessage] = useState<string>("验证登录状态中");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string>("");
    useEffect(() => {
        let temp = localStorage.getItem("token");
        if (temp) {
            setToken(temp);
        }
    }, []);

    useEffect(() => {
        if (!token) return;
        const checkToken = async () => {
            try {
                const response = await fetch("https://dev.maimai.moe/api/user/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                    mode: "cors"
                });

                if (response.status !== 200) {
                    setStatusMessage("您的登录凭证已过期或者尚未登录。");
                    setIsLoading(false);
                } else {
                    setStatusMessage("已登录");
                    setIsLoading(false);

                }
            } catch (error) {
                setStatusMessage("");
                setIsLoading(false);
            }
        };
        checkToken();
    }, [token]);

    return (
        <div className="text-black text-lg">
            {isLoading == true ? (<>
                <div className="flex space-x-5">
                    <LoadingSpinner size={"ultrasm"} message={""} description={""} />
                    <h1>"验证中"</h1>
                </div>
            </>) :
                <div>🟢{statusMessage}</div>
            }
        </div>
    );
}
