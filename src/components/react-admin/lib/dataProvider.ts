import { provider } from "./client";
import { DataProvider } from "react-admin";

// 기본 API URL (로그인 등 다른 라우트들을 위해)
const url = process.env.ADMIN_SERVER_URL || process.env.NEXT_PUBLIC_ADMIN_SERVER_URL || 'http://localhost:3001';

const settings = {
    total: "total", // 서버 응답의 meta.total 필드명
    getManyKey: "id_in",
    arrayFormat: "comma",
};

// 요청 중복 제거를 위한 캐시
const requestCache = new Map<string, Promise<any>>();
const CACHE_TTL = 100; // 100ms 동안 동일한 요청 캐시

const originalProvider = provider({
    url: url,
    settings,
});

// 요청 캐시 키 생성
const createCacheKey = (method: string, resource: string, params: any): string => {
    return `${method}:${resource}:${JSON.stringify(params)}`;
};

// 중복 요청 방지를 위한 래퍼
const createCachedMethod = (methodName: string, originalMethod: any) => {
    return async (...args: any[]) => {
        const cacheKey = createCacheKey(methodName, args[0], args[1]);
        
        // 기존 요청이 진행 중인지 확인
        if (requestCache.has(cacheKey)) {
            return requestCache.get(cacheKey);
        }
        
        // 새 요청 시작
        const promise = originalMethod(...args);
        requestCache.set(cacheKey, promise);
        
        // TTL 후 캐시에서 제거
        setTimeout(() => {
            requestCache.delete(cacheKey);
        }, CACHE_TTL);
        
        return promise;
    };
};

export const dataProvider: DataProvider = {
    ...originalProvider,
    getList: createCachedMethod('getList', originalProvider.getList),
    getOne: createCachedMethod('getOne', originalProvider.getOne),
    getMany: createCachedMethod('getMany', originalProvider.getMany),
    getManyReference: createCachedMethod('getManyReference', originalProvider.getManyReference),
};