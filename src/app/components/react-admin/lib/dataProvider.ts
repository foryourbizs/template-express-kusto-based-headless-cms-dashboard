import { provider } from "./client";

const url = process.env.ADMIN_SERVER_URL || '(PLEASE-SET-ADMIN_SERVER_URL-ENV)';

const settings = {
    total: "total",
    getManyKey: "id_in",
    arrayFormat: "comma",
};

export const dataProvider = provider({
    url: url || 'http://localhost:4000',
    settings,
});