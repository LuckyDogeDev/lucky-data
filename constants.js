module.exports = {
    graphAPIEndpoints: {
        goldminer: 'https://api.thegraph.com/subgraphs/name/luckyswap/gold-miner',
        bar: 'https://api.thegraph.com/subgraphs/name/luckyswap/smelter',
        timelock: 'https://api.thegraph.com/subgraphs/name/luckyswap/goldnugget-timelock',
        maker: 'https://api.thegraph.com/subgraphs/name/luckyswap/alchemy-bench',
        exchange: 'https://api.thegraph.com/subgraphs/name/luckyswap/exchange',
        exchange_v1: 'https://api.thegraph.com/subgraphs/name/jiro-ono/luckyswap-v1-exchange',
        blocklytics: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
        lockup: 'https://api.thegraph.com/subgraphs/name/matthewlilley/lockup',
    },

    graphWSEndpoints: {
        bar: 'wss://api.thegraph.com/subgraphs/name/luckyswap/smelter',
        exchange: 'wss://api.thegraph.com/subgraphs/name/luckyswap/exchange',
        blocklytics: 'wss://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    },

    barAddress: "0x8798249c2e607446efb7ad49ec89dd1865ff4272",
    makerAddress: "0xe11fc0b43ab98eb91e9836129d1ee7c3bc95df50",
    minerAddress: "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd",
    goldnuggetAddress: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
    factoryAddress: "0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac",

    TWENTY_FOUR_HOURS: 86400,
}
