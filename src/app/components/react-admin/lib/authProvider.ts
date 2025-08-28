import { AuthProvider } from "react-admin";
import { requester } from "./client";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */

const url = process.env.ADMIN_SERVER_URL || '(PLEASE-SET-ADMIN_SERVER_URL-ENV)';


export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        // ====== 테스트용 로그인 (나중에 제거 필요) ======
        if (username === 'test' && password === '1234') {
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
            const response = await requester(`${url}/sign/in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
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

                // JWT 토큰들을 저장
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("accessToken", data.attributes.accessToken);
                localStorage.setItem("refreshToken", data.attributes.refreshToken);

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
        requester(`${url}/sign/out`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
        const user = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        return user && accessToken ? Promise.resolve() : Promise.reject();
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

export default authProvider;