export type ProxyResponse = {
    status: string;
    domain: string;
};

export type AliveProxyResponse = {
    domain: string;
    ping: number;
};