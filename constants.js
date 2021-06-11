module.exports = {
    graphAPIEndpoints: {
        goldminer: 'https://api.thegraph.com/subgraphs/name/luckyswap/gold-miner',
        alchemybench: 'https://api.thegraph.com/subgraphs/name/luckyswap/smelter',
        timelock: 'https://api.thegraph.com/subgraphs/name/luckyswap/goldnugget-timelock',
        smelter: 'https://api.thegraph.com/subgraphs/name/luckyswap/smelter',
        exchange: 'https://api.thegraph.com/subgraphs/name/luckyswap/exchange',
        exchange_v1: 'https://api.thegraph.com/subgraphs/name/jiro-ono/luckyswap-v1-exchange',
        blocklytics: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
        lockup: 'https://api.thegraph.com/subgraphs/name/matthewlilley/lockup',
    },

    graphWSEndpoints: {
        alchemybench: 'wss://api.thegraph.com/subgraphs/name/luckyswap/alchemy-bench',
        exchange: 'wss://api.thegraph.com/subgraphs/name/luckyswap/exchange',
        blocklytics: 'wss://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    },

    alchemybenchAddress: "",
    smelterAddress: "",
    minerAddress: "",
    goldnuggetAddress: "",
    factoryAddress: "",

    TWENTY_FOUR_HOURS: 86400,
}
