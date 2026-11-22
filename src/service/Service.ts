import axios from "axios";
import ApiError from "../error/ApiError.js";
import type { ProxyResponse } from "../types/types.js";

class Service {
    async getAlive() {
        const hosts = process.env.PROXY_HOSTS;
        if (!hosts) throw ApiError.internal('PROXY_HOSTS is not defined');

        const results = await Promise.all(
            hosts.split(',').map(async (domain) => {
                const start = performance.now();
                try {
                    const { data } = await axios.get<ProxyResponse>(`${domain}/health`, { timeout: 10000 });
                    return { domain: data.domain, ping: Math.round(performance.now() - start) };
                } catch (error) {
                    return null;
                }
            })
        );
        
        const r = results.filter((i) => {
            if (i !== null) return i;
        });

        return { alive: r, count: r.length };
    }
}

export default new Service();