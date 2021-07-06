type Info = {
    decimals: number;
    name: string;
    goldnugget: string;
    symbol: string;
    totalSupply: number;
    ratio: number;
    PlatinumNuggetMinted: number;
    PlatinumNuggetBurned: number;
    goldnuggetStaked: number;
    goldnuggetStakedUSD: number;
    goldnuggetHarvested: number;
    goldnuggetHarvestedUSD: number;
    PlatinumNuggetAge: number;
    PlatinumNuggetAgeDestroyed: number;
    updatedAt: number;
}

export function info({ block, timestamp }?: {
    block?: number;
    timestamp?: number;
}): Promise<Info>;

export function observeInfo(): {
    subscribe({ next, error, complete }: {
        next?(data: Info): any;
        error?(error: any): any;
        complete?: Function;
    }): any;
};



type User = {
    PlatinumNugget: number;
    PlatinumNuggetIn: number;
    PlatinumNuggetOut: number;
    PlatinumNuggetMinted: number;
    PlatinumNuggetBurned: number;
    PlatinumNuggetOffset: number;
    PlatinumNuggetAge: number;
    PlatinumNuggetAgeDestroyed: number;
    goldnuggetStaked: number;
    goldnuggetStakedUSD: number;
    goldnuggetHarvested: number;
    goldnuggetHarvestedUSD: number;
    goldnuggetIn: number;
    goldnuggetOut: number;
    usdOut: number;
    usdIn: number;
    updatedAt: number;
    goldnuggetOffset: number;
    usdOffset: number;
}

export function user({ block, timestamp, user_address }: {
    block?: number;
    timestamp?: number;
    user_address: string;
}): Promise<User>;
