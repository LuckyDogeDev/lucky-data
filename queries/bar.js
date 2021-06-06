const ws = require('isomorphic-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws'); 

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, graphWSEndpoints, barAddress } = require('./../constants')
const { timestampToBlock } = require('./../utils');

module.exports = {
    async info({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.bar,
            gql`{
                    bar(id: "${barAddress}", ${block}) {
                        ${info.properties.toString()}
                    }
                }`
        );

        return info.callback(result.bar);
    },

    observeInfo() {
        const query = gql`
            subscription {
                bar(id: "${barAddress}") {
                    ${info.properties.toString()}
                }
        }`;

        const client = new SubscriptionClient(graphWSEndpoints.bar, { reconnect: true, }, ws,);
        const observable = client.request({ query });

        return {
            subscribe({next, error, complete}) {
                return observable.subscribe({
                    next(results) {
                        next(info.callback(results.data.bar));
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

        const result = await request(graphAPIEndpoints.bar,
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
        'goldnugget',
        'symbol',
        'totalSupply',
        'ratio',
        'PlatinumNuggetMinted',
        'PlatinumNuggetBurned',
        'goldnuggetStaked',
        'goldnuggetStakedUSD',
        'goldnuggetHarvested',
        'goldnuggetHarvestedUSD',
        'PlatinumNuggetAge',
        'PlatinumNuggetAgeDestroyed',
        'updatedAt'
    ],

    callback(results) {
        return ({
            decimals: Number(results.decimals),
            name: results.name,
            goldnugget: results.goldnugget,
            symbol: results.symbol,
            totalSupply: Number(results.totalSupply),
            ratio: Number(results.ratio),
            PlatinumNuggetMinted: Number(results.PlatinumNuggetMinted),
            PlatinumNuggetBurned: Number(results.PlatinumNuggetBurned),
            goldnuggetStaked: Number(results.totalSupply) * Number(results.ratio),
            goldnuggetStakedUSD: Number(results.goldnuggetStakedUSD),
            goldnuggetHarvested: Number(results.goldnuggetHarvested),
            goldnuggetHarvestedUSD: Number(results.goldnuggetHarvestedUSD),
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
        'goldnuggetStaked',
        'goldnuggetStakedUSD',
        'goldnuggetHarvested',
        'goldnuggetHarvestedUSD',
        'goldnuggetIn',
        'goldnuggetOut',
        'usdOut',
        'usdIn',
        'updatedAt',
        'goldnuggetOffset',
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
            goldnuggetStaked: Number(results.goldnuggetStaked),
            goldnuggetStakedUSD: Number(results.goldnuggetStakedUSD),
            goldnuggetHarvested: Number(results.goldnuggetHarvested),
            goldnuggetHarvestedUSD: Number(results.goldnuggetHarvestedUSD),
            goldnuggetIn: Number(results.goldnuggetIn),
            goldnuggetOut: Number(results.goldnuggetOut),
            usdOut: Number(results.usdOut),
            usdIn: Number(results.usdIn),
            updatedAt: Number(results.updatedAt),
            goldnuggetOffset: Number(results.goldnuggetOffset),
            usdOffset: Number(results.usdOffset)
        })
    }
};