import { provider } from "./client";

const url = process.env.ADMIN_SERVER_URL || process.env.NEXT_PUBLIC_ADMIN_SERVER_URL || '';

const settings = {
    total: "total",
    getManyKey: "id_in",
    arrayFormat: "comma",
};

export const dataProvider = provider({
    url: url,
    settings,
});