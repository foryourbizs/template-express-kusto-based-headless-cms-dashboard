import { AuthProvider } from "react-admin";
import { requester } from "./client";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */

const url = process.env.ADMIN_SERVER_URL || '(PLEASE-SET-ADMIN_SERVER_URL-ENV)';


export const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
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
            return Promise.reject();
        }

        if (response.status == 200) {
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