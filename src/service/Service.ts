import axios from "axios";
import ApiError from "../error/ApiError.js";
import type { AliveListResponse, ProxyResponse } from "../types/types.js";

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

        return { alive: r, count: r.length, totalCount: hosts.split(',').length };
    }

    async request(targetUrl: string, method: string) {
        if (!targetUrl) throw ApiError.badRequest('targetUrl is not defined');
        if (!method) throw ApiError.badRequest('method is not defined');

        const nodes = await this.getAlive();
        if (nodes.alive.length < 2) throw ApiError.internal('Too few proxies');

        const shuffled = [...nodes.alive];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
        }

        const chainLength = Math.floor(Math.random() * 3) + 2;
        const chain = shuffled.slice(0, Math.min(chainLength, shuffled.length));

        const firstNode = chain[0];
        if (!firstNode) throw ApiError.internal('Failed to choose proxy');

        const requestData = {
            targetUrl,
            method,
            length: chain.length,
            chain,
            currentIndex: 0
        };

        console.log('Request Data: ', requestData);

        try {
            const start = performance.now();
            const { data } = await axios.post(`${firstNode.domain}/proxy`, requestData, { timeout: 10000 });
            return { 
                response: data, 
                delay: `${Math.round(performance.now() - start)} ms`,
                chainLength: chain.length, 
                path: chain.map(i => i?.domain)
            };
        } catch (error) {
            if (error instanceof ApiError) throw error;
            if (axios.isAxiosError(error)) {
                throw ApiError.badGateway(`Proxy chain failed: ${error.message}`)
            };
            throw ApiError.internal('Unexpected proxy error');
        }
    }
}

export default new Service();