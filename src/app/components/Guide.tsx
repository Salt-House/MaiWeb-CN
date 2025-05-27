"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { type Step, type CallBackProps, EVENTS } from 'react-joyride';

// 动态导入 Joyride 组件，禁用 SSR
const Joyride = dynamic(() => import('react-joyride'), {
    ssr: false
});

interface GuideProps {
    steps: Step[];
    run?: boolean;
    autoStart?: boolean;
}

const Guide = ({ steps, run = false, autoStart = true }: GuideProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [isBrowser, setIsBrowser] = useState(false);

    // 延迟启动引导的逻辑
    useEffect(() => {
        if (run && autoStart) {
            const timer = setTimeout(() => {
                setIsRunning(true);
            }, 800); // 0.8秒延迟

            return () => clearTimeout(timer); // 清理定时器
        }
    }, [run, autoStart]);

    useEffect(() => {
        setIsBrowser(true);
        // 如果设置了自动启动，则在浏览器环境下自动运行引导
        if (autoStart) {
            setIsRunning(run);
        }
    }, [autoStart, run]);


    const updateCustomSpotlight = (targetElement: HTMLElement | null) => {
        const spotlight = document.querySelector('.react-joyride__spotlight') as HTMLElement;
        if (targetElement && spotlight) {
            const rect = targetElement.getBoundingClientRect();
            spotlight.style.position = 'fixed';
            spotlight.style.top = `${rect.top - 2}px`;
            spotlight.style.left = `${rect.left - 2}px`;
            spotlight.style.width = `${rect.width + 4}px`;
            spotlight.style.height = `${rect.height + 4}px`;
        }
    };

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { action, index, step, type } = data;
        if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            let targetElement: HTMLElement | null = null;

            if (typeof step.target === 'string') {
                targetElement = document.querySelector(step.target);
            } else if (step.target instanceof HTMLElement) {
                targetElement = step.target;
            }

            if (targetElement) {
                updateCustomSpotlight(targetElement);
            }
        }
    };


    if (!isBrowser) return null;

    return (
        <Joyride
            steps={steps}
            run={isRunning}
            continuous={true}
            showSkipButton={true}
            showProgress={true}
            debug={true}
            locale={{
                back: '上一步',
                close: '关闭',
                last: '完成',
                next: '下一步',
                skip: '跳过'
            }}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#805AD5', // 紫色主题色，与网站风格一致
                    backgroundColor: '#ffffff',
                    arrowColor: '#ffffff',
                    textColor: '#333',
                    overlayColor: 'rgba(0, 0, 0, 0.6)', // 暗色背景
                    spotlightShadow: '0 0 0 4px rgba(255,255,255,0.9)', // 白色边缘高亮
                },
                tooltip: {
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(128, 90, 213, 0.25)',
                    padding: '12px',
                },
                tooltipTitle: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '6px',
                },
                tooltipContent: {
                    fontSize: '14px',
                    lineHeight: '1.5',
                    padding: '6px 0',
                },
                buttonNext: {
                    backgroundColor: '#805AD5', // 紫色按钮
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '14px',
                    padding: '8px 16px',
                },
                buttonBack: {
                    color: '#805AD5',
                    marginRight: '8px',
                },
                buttonSkip: {
                    color: '#666',
                    fontSize: '14px',
                },
            }}
            callback={handleJoyrideCallback}
        />
    );
};

export default Guide;
