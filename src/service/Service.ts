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

    async request(targetUrl: string) {
        if (!targetUrl) throw ApiError.badRequest('targetUrl is not defined');

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

        // try {
        //     const { data } = await axios.post(`${firstNode.domain}/proxy`, {
        //         targetUrl,
        //         length: chain.length,
        //         chain,
        //         currentStep: 1
        //     }, { timeout: 10000 });
        // } catch (error) {

        // }

        // testing
        return {
            targetUrl,
            length: chain.length,
            chain,
            currentStep: 1
        };
    }
}

export default new Service();