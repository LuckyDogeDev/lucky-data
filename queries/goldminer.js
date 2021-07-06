const pageResults = require('graph-results-pager');

const { request, gql } = require('graphql-request');

const { graphAPIEndpoints, minerAddress, TWENTY_FOUR_HOURS } = require('./../constants')
const { timestampToBlock, getAverageBlockTime } = require('./../utils');

const { pairs: exchangePairs } = require('./exchange');
const { priceUSD: golnPriceUSD } = require('./goln');

module.exports = {
    async info({block = undefined, timestamp = undefined} = {}) {
        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.goldminer,
            gql`{
                    goldMiner(id: "${minerAddress}", ${block}) {
                        ${info.properties.toString()}
                    }
                }`
        );

        return info.callback(result.goldMiner);
    },

    async pool({block = undefined, timestamp = undefined, pool_id = undefined, pool_address = undefined} = {}) {
        if(!pool_id && !pool_address) { throw new Error("lucky-data: Pool ID / Address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        let result;
        if(pool_id) {
            result = await request(graphAPIEndpoints.goldminer,
                gql`{
                        pool(id: ${pool_id}, ${block}) {
                            ${pools.properties.toString()}
                        }
                    }`
            );
        }

        else {
            result = await request(graphAPIEndpoints.goldminer,
                gql`{
                        pools(first: 1, where: {pair: "${pool_address.toLowerCase()}"}, ${block}) {
                            ${pools.properties.toString()}
                        }
                    }`
            );
        }

        return pools.callback(pool_id ? [result.pool] : result.pools)[0];
    },

    async pools({block = undefined, timestamp = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.goldminer,
            query: {
                entity: 'pools',
                selection: {
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: pools.properties
            }
        })
            .then(results => pools.callback(results))
            .catch(err => console.log(err));
    },

    async stakedValue({block = undefined, timestamp = undefined, token_address = undefined} = {}) {
        if(!token_address) { throw new Error("lucky-data: Token address undefined"); }

        block = block ? block : timestamp ? (await timestampToBlock(timestamp)) : undefined;
        block = block ? `block: { number: ${block} }` : "";

        const result = await request(graphAPIEndpoints.exchange,
            gql`{
                    liquidityPosition(id: "${token_address.toLowerCase()}-${minerAddress}", ${block}) {
                        ${stakedValue.properties.toString()}
                    }
                }`
        );

        return stakedValue.callback(result.liquidityPosition);
    },

    async user({block = undefined, timestamp = undefined, user_address = undefined} = {}) {
        if(!user_address) { throw new Error("lucky-data: User address undefined"); }

        return pageResults({
            api: graphAPIEndpoints.goldminer,
            query: {
                entity: 'users',
                selection: {
                    where: {
                        address: `\\"${user_address.toLowerCase()}\\"`
                    },
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: user.properties
            }
        })
            .then(results => user.callback(results))
            .catch(err => console.log(err));
    },

    async users({block = undefined, timestamp = undefined} = {}) {
        return pageResults({
            api: graphAPIEndpoints.goldminer,
            query: {
                entity: 'users',
                selection: {
                    block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
                },
                properties: user.properties
            }
        })
            .then(results => user.callback(results))
            .catch(err => console.log(err));
    },

    async apys({block = undefined, timestamp = undefined} = {}) {
        const goldminerList = await module.exports.pools({block, timestamp});
        const exchangeList = await exchangePairs({block, timestamp});
        const golnUSD = await golnPriceUSD({block, timestamp});

        const totalAllocPoint = goldminerList.reduce((a, b) => a + b.allocPoint, 0);

        const averageBlockTime = await getAverageBlockTime({block, timestamp});

        return goldminerList.map(goldminerPool => {
            const exchangePool = exchangeList.find(e => e.id === goldminerPool.pair);
            if(!exchangePool) {
                return {...goldminerPool, apy: 0};
            }

            const tvl = goldminerPool.slpBalance * (exchangePool.reserveUSD / exchangePool.totalSupply);
            const golnPerBlock = (goldminerPool.allocPoint / (totalAllocPoint) * 100);
            const apy = golnUSD * (golnPerBlock * (60 / averageBlockTime) * 60 * 24 * 365) / tvl * 100;

            return {...goldminerPool, apy};
        });
    },

    async apys24h({block = undefined, timestamp = undefined} = {}) {
        let timestampNow = timestamp ? timestamp : block ? await blockToTimestamp(block) : (Math.floor(Date.now() / 1000));
        timestamp24ago = timestampNow - TWENTY_FOUR_HOURS;
        timestamp48ago = timestamp24ago - TWENTY_FOUR_HOURS;

        block = timestamp ? await timestampToBlock(timestamp) : block;
        block24ago = await timestampToBlock(timestamp24ago);
        block48ago = await timestampToBlock(timestamp48ago);

        const results = await module.exports.apys({block: block});
        const results24ago = await module.exports.apys({block: block24ago});

        return apys.callback24h(results, results24ago);
    }
}

const info = {
    properties: [
        'bonusMultiplier',
        'bonusEndBlock',
        'devaddr',
        'migrator',
        'owner',
        'startBlock',
        'goln',
        'golnPerBlock',
        'totalAllocPoint',
        'poolCount',
        'slpBalance',
        'slpAge',
        'slpAgeRemoved',
        'slpDeposited',
        'slpWithdrawn',
        'updatedAt'
    ],

    callback(results) {
        return ({
            bonusMultiplier: Number(results.bonusMultiplier),
            bonusEndBlock: Number(results.bonusEndBlock),
            devaddr: results.devaddr,
            migrator: results.migrator,
            owner: results.owner,
            startBlock: Number(results.startBlock),
            golnPerBlock: results.golnPerBlock / 1e18,
            totalAllocPoint: Number(results.totalAllocPoint),
            poolCount: Number(results.poolCount),
            slpBalance: Number(results.slpBalance),
            slpAge: Number(results.slpAge),
            slpAgeRemoved: Number(results.slpAgeRemoved),
            slpDeposited: Number(results.slpDeposited),
            slpWithdrawn: Number(results.slpWithdrawn),
            updatedAt: Number(results.updatedAt)
        });
    }
};

const pools = {
    properties: [
        'id',
        'pair',
        'allocPoint',
        'lastRewardBlock',
        'accGoldNuggetPerShare',
        'balance',
        'userCount',
        'slpBalance',
        'slpAge',
        'slpAgeRemoved',
        'slpDeposited',
        'slpWithdrawn',
        'timestamp',
        'block',
        'updatedAt',
        'entryUSD',
        'exitUSD',
        'golnHarvested',
        'golnHarvestedUSD'
    ],

    callback(results) {
        return results.map(({ id, pair, allocPoint, lastRewardBlock, accGoldNuggetPerShare, balance, userCount, slpBalance, slpAge, slpAgeRemoved, slpDeposited, slpWithdrawn, timestamp, block, updatedAt, entryUSD, exitUSD, golnHarvested, golnHarvestedUSD }) => ({
            id: Number(id),
            pair: pair,
            allocPoint: Number(allocPoint),
            lastRewardBlock: Number(lastRewardBlock),
            accGoldNuggetPerShare: BigInt(accGoldNuggetPerShare),
            userCount: Number(userCount),
            slpBalance: Number(slpBalance),
            slpAge: Number(slpAge),
            slpAgeRemoved: Number(slpAgeRemoved),
            slpDeposited: Number(slpDeposited),
            slpWithdrawn: Number(slpWithdrawn),
            addedTs: Number(timestamp),
            addedDate: new Date(timestamp * 1000),
            addedBlock: Number(block),
            lastUpdatedTs: Number(updatedAt),
            lastUpdatedDate: new Date(updatedAt * 1000),
            entryUSD: Number(entryUSD),
            exitUSD: Number(exitUSD),
            golnHarvested: Number(golnHarvested),
            golnHarvestedUSD: Number(golnHarvestedUSD)
         }));
    }
};

const stakedValue = {
    properties: [
        'id',
        'liquidityTokenBalance',
        'pair { id, totalSupply, reserveETH, reserveUSD }'
    ],

    callback(results) {
        return ({
            id: results.id,
            liquidityTokenBalance: Number(results.liquidityTokenBalance),
            totalSupply: Number(results.pair.totalSupply),
            totalValueETH: Number(results.pair.reserveETH),
            totalValueUSD: Number(results.pair.reserveUSD)
        })
    }
};

const user = {
    properties: [
        'id',
        'address',
        'pool { id, pair, balance, accGoldNuggetPerShare, lastRewardBlock }',
        'amount',
        'rewardDebt',
        'entryUSD',
        'exitUSD',
        'golnHarvested',
        'golnHarvestedUSD',
    ],

    callback(results) {
        return results.map(entry => ({
            id: entry.id,
            address: entry.address,
            poolId: Number(entry.id.split("-")[0]),
            pool: entry.pool ? {
                id: entry.pool.id,
                pair: entry.pool.pair,
                balance: Number(entry.pool.balance),
                accGoldNuggetPerShare: BigInt(entry.pool.accGoldNuggetPerShare),
                lastRewardBlock: Number(entry.pool.lastRewardBlock)
            } : undefined,
            amount: Number(entry.amount),
            rewardDebt: BigInt(entry.rewardDebt),
            entryUSD: Number(entry.entryUSD),
            exitUSD: Number(entry.exitUSD),
            golnHarvested: Number(entry.golnHarvested),
            golnHarvestedUSD: Number(entry.golnHarvestedUSD),
        }));
    }
};

const apys = {
    callback24h(results, results24h) {
        return results.map(result => {
            const result24h = results24h.find(e => e.id === result.id) || result;

            return ({
                ...result,

                slpBalanceChange: (result.slpBalance / result24h.slpBalance) * 100 - 100,
                slpBalanceChangeCount: result.slpBalance - result24h.slpBalance,

                userCountChange: (result.userCount / result24h.userCount) * 100 - 100,
                userCountChangeCount: result.userCount - result24h.userCount,

                golnHarvestedChange: (result.golnHarvested / result24h.golnHarvested) * 100 - 100,
                golnHarvestedChangeCount: result.golnHarvested - result24h.golnHarvested,
            });
        });
    }
}
