"use client";
import { useEffect, useState } from "react";

/**
 * 自动检查 token 是否有效，并返回提示信息
 */
export default function useTokenChecker(token: string) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const checkToken = async () => {
            try {
                const response = await fetch("https://dev.maimai.moe/api/user/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    setStatusMessage("您的登陆凭证已过期或者尚未登陆。");
                } else {
                    setStatusMessage("已登陆");
                }
            } catch (error) {
                setStatusMessage("网络错误，无法验证登录状态。");
            }
        };

        checkToken();
    }, [token]);

    return (
        <>
            <div className="size-40 text-black">{statusMessage}</div>
        </>
    );
}
