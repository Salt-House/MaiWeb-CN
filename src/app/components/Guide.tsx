"use client";

import {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {type Step, type CallBackProps, EVENTS, STATUS} from 'react-joyride';

// 动态导入 Joyride 组件，禁用 SSR
const Joyride = dynamic(() => import('react-joyride'), {
    ssr: false
});

interface GuideProps {
    steps: Step[];
    run?: boolean;
    autoStart?: boolean;
}

const Guide = ({steps, autoStart = true}: GuideProps) => {
    const [isRunning, setIsRunning] = useState(false);
    const [isBrowser, setIsBrowser] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [run, setRun] = useState(true);

    useEffect(() => {
        const hideTour = localStorage.getItem('hideTour');
        if (hideTour !== 'true') {
            setRun(true);
            setStepIndex(0);
            setIsBrowser(true);
            setIsRunning(true);
        }
    }, []);



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
        const {action, index, step, type, status} = data;

        // 处理自定义 spotlight 更新
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

            // 👉 控制 stepIndex 手动推进
            if (action === 'prev') {
                setStepIndex(index - 1);
            } else {
                setStepIndex(index + 1);
            }
        }

        // 处理 tour 结束
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            setRun(false);
            setStepIndex(0);
            localStorage.setItem('hideTour', 'true'); // 👈 加这个
        }
    };


    if (!isBrowser) return null;

    return (
        <Joyride
            steps={steps}
            run={isRunning}
            continuous={true}
            showSkipButton={true}
            stepIndex={stepIndex}
            showProgress={true}
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
