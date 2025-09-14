import { AuthProvider } from "react-admin";
import { requester } from "./client";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */

const url = process.env.ADMIN_SERVER_URL || process.env.NEXT_PUBLIC_ADMIN_SERVER_URL || '';


const api = {
    signin: `${url}/users/sign/in`,
    signout: `${url}/users/sign/out`,
    refresh: `${url}/users/sign/refresh`,
    check: `${url}/users/me`
};


// 캐시된 인증 확인 (중복 요청 방지)
let lastCheckTime = 0;
let lastCheckResult: Promise<void> | null = null;
const CHECK_CACHE_DURATION = 30 * 1000; // 30초

// 로그아웃 중복 방지 플래그
let isLoggingOut = false;

export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        // 현재 페이지 정보 저장 (로그인 페이지가 아닌 경우에만)
        const currentPath = window.location.pathname + window.location.search + window.location.hash;
        if (currentPath !== '/login' && !currentPath.includes('/login')) {
            localStorage.setItem("redirectAfterLogin", currentPath);
        }

        // ====== 테스트용 로그인 (서버 연결 문제 해결용) ======
        if (username === 'test' && password === '1234' && false) {
            const testUser = {
                id: '999',
                username: 'test',
                email: 'test@example.com',
                name: '테스트 관리자',
                role: 'admin',
                avatar: null,
                accessToken: 'test-access-token-12345',
                refreshToken: 'test-refresh-token-67890'
            };

            localStorage.setItem("user", JSON.stringify(testUser));
            localStorage.setItem("accessToken", testUser.accessToken);
            localStorage.setItem("refreshToken", testUser.refreshToken);

            return Promise.resolve();
        }
        // ====== 테스트용 로그인 끝 ======

        try {
            const response = await requester(api.signin, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: username,
                    password: password
                }),
            });

            if (!response) {
                return Promise.reject(new Error('서버 응답이 없습니다.'));
            }

            if (response.status === 200) {
                const { data } = response.body;
                const user = {
                    id: data.id,
                    ...data.attributes
                };

                // JWT 토큰들과 만료시간 저장
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("accessToken", data.attributes.accessToken);
                localStorage.setItem("refreshToken", data.attributes.refreshToken);
                
                // 만료시간 저장 (ISO 문자열로 저장)
                if (data.attributes.accessTokenExpiresAt) {
                    localStorage.setItem("accessTokenExpiresAt", data.attributes.accessTokenExpiresAt);
                }
                if (data.attributes.refreshTokenExpiresAt) {
                    localStorage.setItem("refreshTokenExpiresAt", data.attributes.refreshTokenExpiresAt);
                }

                return Promise.resolve();
            } else if (response.status === 401) {
                return Promise.reject(new Error('아이디 또는 비밀번호가 잘못되었습니다.'));
            } else {
                return Promise.reject(new Error(`로그인 실패: ${response.status}`));
            }
        } catch (error) {
            console.error('Login error:', error);
            return Promise.reject(new Error('로그인 중 오류가 발생했습니다.'));
        }
    },
    logout: () => {
        // 이미 로그아웃 중이면 중복 실행 방지
        if (isLoggingOut) {
            console.log('Logout already in progress, skipping...');
            return Promise.resolve();
        }

        isLoggingOut = true;
        console.log('Starting logout process...');

        try {
            requester(api.signout, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).catch(error => {
                // 로그아웃 API 실패는 무시 (이미 서버에서 세션이 만료된 경우)
                console.warn('Logout API failed:', error);
            });

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessTokenExpiresAt");
            localStorage.removeItem("refreshTokenExpiresAt");
            localStorage.removeItem("redirectAfterLogin"); // 리다이렉트 정보도 제거
            
            // 캐시 초기화
            lastCheckTime = 0;
            lastCheckResult = null;
            
            console.log('Logout completed successfully');
            return Promise.resolve();
        } finally {
            // 로그아웃 완료 후 플래그 리셋 (1초 후)
            setTimeout(() => {
                isLoggingOut = false;
            }, 1000);
        }
    },
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            // 현재 페이지 정보 저장
            const currentPath = window.location.pathname + window.location.search + window.location.hash;
            if (currentPath !== '/login' && !currentPath.includes('/login')) {
                localStorage.setItem("redirectAfterLogin", currentPath);
            }
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: async () => {
        const now = Date.now();
        
        // 최근 30초 이내에 체크했다면 캐시된 결과 반환
        if (lastCheckResult && (now - lastCheckTime) < CHECK_CACHE_DURATION) {
            return lastCheckResult;
        }

        const user = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        
        // 로컬 토큰이 없으면 바로 인증 실패
        if (!user || !accessToken) {
            // 현재 페이지 정보 저장
            const currentPath = window.location.pathname + window.location.search + window.location.hash;
            if (currentPath !== '/login' && !currentPath.includes('/login')) {
                localStorage.setItem("redirectAfterLogin", currentPath);
            }
            lastCheckTime = 0;
            lastCheckResult = null;
            return Promise.reject({ message: 'No authentication token found' });
        }

        // 새로운 체크 시작
        lastCheckTime = now;
        lastCheckResult = (async () => {
            try {
                // 서버에서 인증 상태 확인
                const response = await requester(api.check, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                if (response && response.status === 200) {
                    // 인증 성공 - 사용자 정보 업데이트
                    const { data } = response.body;
                    const updatedUser = {
                        id: data.id,
                        ...data.attributes
                    };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    return;
                } else {
                    // 인증 실패 - 현재 페이지 정보 저장
                    const currentPath = window.location.pathname + window.location.search + window.location.hash;
                    if (currentPath !== '/login' && !currentPath.includes('/login')) {
                        localStorage.setItem("redirectAfterLogin", currentPath);
                    }
                    
                    localStorage.removeItem("user");
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("accessTokenExpiresAt");
                    localStorage.removeItem("refreshTokenExpiresAt");
                    lastCheckTime = 0;
                    lastCheckResult = null;
                    throw new Error('Authentication failed');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                // 네트워크 오류나 401 등의 경우 인증 실패로 처리
                const currentPath = window.location.pathname + window.location.search + window.location.hash;
                if (currentPath !== '/login' && !currentPath.includes('/login')) {
                    localStorage.setItem("redirectAfterLogin", currentPath);
                }
                
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("accessTokenExpiresAt");
                localStorage.removeItem("refreshTokenExpiresAt");
                lastCheckTime = 0;
                lastCheckResult = null;
                throw new Error('Authentication check failed');
            }
        })();

        return lastCheckResult;
    },
    getPermissions: () => {
        return Promise.resolve(undefined);
    },
    getIdentity: () => {
        const persistedUser = localStorage.getItem("user");
        const user = persistedUser ? JSON.parse(persistedUser) : null;

        return Promise.resolve(user);
    },
};

// JWT 토큰 갱신 함수 (React Admin 외부에서도 사용 가능)
export const refreshTokens = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!accessToken || !refreshToken) {
            return { success: false, error: 'Access Token 또는 Refresh Token이 없습니다.' };
        }

        const response = await requester(api.refresh, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                refreshToken: refreshToken
            }),
        });

        if (!response) {
            return { success: false, error: '서버 응답이 없습니다.' };
        }

        if (response.status === 200) {
            const { data } = response.body;
            
            // 새로운 토큰들과 만료시간 저장
            localStorage.setItem("accessToken", data.attributes.accessToken);
            localStorage.setItem("refreshToken", data.attributes.refreshToken);
            
            if (data.attributes.accessTokenExpiresAt) {
                localStorage.setItem("accessTokenExpiresAt", data.attributes.accessTokenExpiresAt);
            }
            if (data.attributes.refreshTokenExpiresAt) {
                localStorage.setItem("refreshTokenExpiresAt", data.attributes.refreshTokenExpiresAt);
            }

            return { success: true };
        } else if (response.status === 401) {
            // Refresh Token도 만료된 경우 - 재로그인 필요
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessTokenExpiresAt");
            localStorage.removeItem("refreshTokenExpiresAt");
            return { success: false, error: '인증이 만료되었습니다. 다시 로그인해주세요.' };
        } else {
            return { success: false, error: `토큰 갱신 실패: ${response.status}` };
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        return { success: false, error: '토큰 갱신 중 오류가 발생했습니다.' };
    }
};

// 토큰 만료시간까지 남은 시간을 계산하는 함수
export const getTokenTimeRemaining = (): { 
    accessToken: { remaining: number; expired: boolean; expiresAt: string | null };
    refreshToken: { remaining: number; expired: boolean; expiresAt: string | null };
} => {
    const now = new Date().getTime();
    
    const accessTokenExpiresAt = localStorage.getItem("accessTokenExpiresAt");
    const refreshTokenExpiresAt = localStorage.getItem("refreshTokenExpiresAt");
    
    // 디버깅: localStorage 토큰 정보 확인
    // console.log('=== Token Info Debug ===');
    // console.log('Current time:', new Date(now).toISOString());
    // console.log('AccessToken expiresAt from localStorage:', accessTokenExpiresAt);
    // console.log('RefreshToken expiresAt from localStorage:', refreshTokenExpiresAt);
    
    const accessToken = {
        remaining: 0,
        expired: true,
        expiresAt: accessTokenExpiresAt
    };
    
    const refreshToken = {
        remaining: 0,
        expired: true,
        expiresAt: refreshTokenExpiresAt
    };
    
    if (accessTokenExpiresAt) {
        const expiresAt = new Date(accessTokenExpiresAt).getTime();
        accessToken.remaining = Math.max(0, expiresAt - now);
        accessToken.expired = accessToken.remaining <= 0;
    }
    
    if (refreshTokenExpiresAt) {
        const expiresAt = new Date(refreshTokenExpiresAt).getTime();
        refreshToken.remaining = Math.max(0, expiresAt - now);
        refreshToken.expired = refreshToken.remaining <= 0;
    }
    
    return { accessToken, refreshToken };
};

// 로그아웃 중인지 확인하는 함수
export const isCurrentlyLoggingOut = (): boolean => {
    return isLoggingOut;
};

export default authProvider;