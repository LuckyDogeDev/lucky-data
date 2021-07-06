type Info = {
    decimals: number;
    name: string;
    goln: string;
    symbol: string;
    totalSupply: number;
    ratio: number;
    PlatinumNuggetMinted: number;
    PlatinumNuggetBurned: number;
    golnStaked: number;
    golnStakedUSD: number;
    golnHarvested: number;
    golnHarvestedUSD: number;
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
    golnStaked: number;
    golnStakedUSD: number;
    golnHarvested: number;
    golnHarvestedUSD: number;
    golnIn: number;
    golnOut: number;
    usdOut: number;
    usdIn: number;
    updatedAt: number;
    golnOffset: number;
    usdOffset: number;
}

export function user({ block, timestamp, user_address }: {
    block?: number;
    timestamp?: number;
    user_address: string;
}): Promise<User>;
