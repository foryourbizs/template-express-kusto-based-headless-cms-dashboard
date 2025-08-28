import { provider } from "./client";

// 기본 API URL (로그인 등 다른 라우트들을 위해)
const url = process.env.ADMIN_SERVER_URL || process.env.NEXT_PUBLIC_ADMIN_SERVER_URL || 'http://localhost:3001';

const settings = {
    total: "total", // 서버 응답의 meta.total 필드명
    getManyKey: "id_in",
    arrayFormat: "comma",
};

export const dataProvider = provider({
    url: url,
    settings,
});