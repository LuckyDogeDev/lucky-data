const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, graphWSEndpoints, alchemybenchAddress } = require('./../constants')
const { timestampToBlock } = require('./../utils');

module.exports = {
    async info({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.alchemybench,
            gql`{
                    alchemybench(id: "${alchemybenchAddress}", ${block}) {
                        ${info.properties.toString()}
                    }
                }`
        );

        return info.callback(result.alchemybench);
    },

    observeInfo() {
        const query = gql`
            subscription {
                alchemybench(id: "${alchemybenchAddress}") {
                    ${info.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.alchemybench, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(info.callback(results.data.alchemybench));
                    },
                    error,
                    complete
                });
            }
        };
    },

    async user({block = undefined, timestamp = undefined, user_address = undefined} = {}) {
        if(!user_address) { throw new Error("lucky-data: User address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.alchemybench,
            gql`{
                    user(id: "${user_address.toLowerCase()}", ${block}) {
                        ${user.properties.toString()}
                    }
                }`
        );

        return user.callback(result.user);
    },
}

const info = {
    properties: [
        'decimals',
        'name',
        'goln',
        'symbol',
        'totalSupply',
        'ratio',
        'PlatinumNuggetMinted',
        'PlatinumNuggetBurned',
        'golnStaked',
        'golnStakedUSD',
        'golnHarvested',
        'golnHarvestedUSD',
        'PlatinumNuggetAge',
        'PlatinumNuggetAgeDestroyed',
        'updatedAt'
    ],

    callback(results) {
        return ({
            decimals: Number(results.decimals),
            name: results.name,
            goln: results.goln,
            symbol: results.symbol,
            totalSupply: Number(results.totalSupply),
            ratio: Number(results.ratio),
            PlatinumNuggetMinted: Number(results.PlatinumNuggetMinted),
            PlatinumNuggetBurned: Number(results.PlatinumNuggetBurned),
            golnStaked: Number(results.totalSupply) * Number(results.ratio),
            golnStakedUSD: Number(results.golnStakedUSD),
            golnHarvested: Number(results.golnHarvested),
            golnHarvestedUSD: Number(results.golnHarvestedUSD),
            PlatinumNuggetAge: Number(results.PlatinumNuggetAge),
            PlatinumNuggetAgeDestroyed: Number(results.PlatinumNuggetAgeDestroyed),
            updatedAt: Number(results.updatedAt)
        })
    }
};

const user = {
    properties: [
        'PlatinumNugget',
        'PlatinumNuggetIn',
        'PlatinumNuggetOut',
        'PlatinumNuggetMinted',
        'PlatinumNuggetBurned',
        'PlatinumNuggetOffset',
        'PlatinumNuggetAge',
        'PlatinumNuggetAgeDestroyed',
        'golnStaked',
        'golnStakedUSD',
        'golnHarvested',
        'golnHarvestedUSD',
        'golnIn',
        'golnOut',
        'usdOut',
        'usdIn',
        'updatedAt',
        'golnOffset',
        'usdOffset'
    ],

    callback(results) {
        return ({
            PlatinumNugget: Number(results.PlatinumNugget),
            PlatinumNuggetIn: Number(results.PlatinumNuggetIn),
            PlatinumNuggetOut: Number(results.PlatinumNuggetOut),
            PlatinumNuggetMinted: Number(results.PlatinumNuggetMinted),
            PlatinumNuggetBurned: Number(results.PlatinumNuggetBurned),
            PlatinumNuggetOffset: Number(results.PlatinumNuggetOffset),
            PlatinumNuggetAge: Number(results.PlatinumNuggetAge),
            PlatinumNuggetAgeDestroyed: Number(results.PlatinumNuggetAgeDestroyed),
            golnStaked: Number(results.golnStaked),
            golnStakedUSD: Number(results.golnStakedUSD),
            golnHarvested: Number(results.golnHarvested),
            golnHarvestedUSD: Number(results.golnHarvestedUSD),
            golnIn: Number(results.golnIn),
            golnOut: Number(results.golnOut),
            usdOut: Number(results.usdOut),
            usdIn: Number(results.usdIn),
            updatedAt: Number(results.updatedAt),
            golnOffset: Number(results.golnOffset),
            usdOffset: Number(results.usdOffset)
        })
    }
};