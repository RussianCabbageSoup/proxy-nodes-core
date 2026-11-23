export type ProxyResponse = {
    status: string;
    domain: string;
};

export type AliveProxyResponse = {
    domain: string;
    ping: number;
};

export type AliveListResponse = {
    alive: AliveProxyResponse[];
    count: number;
};