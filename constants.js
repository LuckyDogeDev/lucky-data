module.exports = {
    graphAPIEndpoints: {
        goldminer: 'https://api.thegraph.com/subgraphs/name/luckyswap/gold-miner',
        alchemybench: 'https://api.thegraph.com/subgraphs/name/luckyswap/smelter',
        timelock: 'https://api.thegraph.com/subgraphs/name/luckyswap/goln-timelock',
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

    alchemybenchAddress: "0xCfbB59ba22F0B0dB768A7C00e8177bBB9b35B8B4",
    smelterAddress: "0x59f84BbeE8b8cbE2aC45F1B7711f4034B2Ae0408",
    minerAddress: "0xddB4E76521cA2DA81686Eb84106F15286BBe2Cdb",
    golnAddress: "0xc6D69475f115F61B1e8C4e78c20C49201c869DB4",
    factoryAddress: "0x58100D88DE401bf6be6a3E77D0Da0270648efbbE",

    TWENTY_FOUR_HOURS: 86400,
}
