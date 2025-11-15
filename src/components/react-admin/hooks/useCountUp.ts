import { useEffect, useState } from 'react';

interface UseCountUpOptions {
    end: number;
    duration?: number;
    start?: number;
    decimals?: number;
    separator?: string;
    trigger?: any; // 이 값이 변경되면 애니메이션 재시작
}

export const useCountUp = ({
    end,
    duration = 2000,
    start = 0,
    decimals = 0,
    separator = ',',
    trigger,
}: UseCountUpOptions) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
        setCount(start); // 시작값으로 리셋
        
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutExpo easing function
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentCount = Math.floor(easedProgress * (end - start) + start);
            setCount(currentCount);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [end, duration, start, trigger]); // trigger가 변경되면 애니메이션 재시작

    // 숫자 포맷팅 (천 단위 구분)
    const formatNumber = (num: number): string => {
        const fixed = num.toFixed(decimals);
        const parts = fixed.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
        return parts.join('.');
    };

    return formatNumber(count);
};
