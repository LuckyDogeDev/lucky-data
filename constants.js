module.exports = {
    graphAPIEndpoints: {
        goldminer: 'https://api.thegraph.com/subgraphs/name/luckydogedev/gold-miner',
        alchemybench: 'https://api.thegraph.com/subgraphs/name/luckydogedev/alchemybench',
        timelock: 'https://api.thegraph.com/subgraphs/name/luckydogedev/goln-timelock',
        smelter: 'https://api.thegraph.com/subgraphs/name/luckydogedev/smelter',
        exchange: 'https://api.thegraph.com/subgraphs/name/luckdogedev/exchange',
        exchange_v1: 'https://api.thegraph.com/subgraphs/name/jiro-ono/luckyswap-v1-exchange',
        blocklytics: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
        lockup: 'https://api.thegraph.com/subgraphs/name/matthewlilley/lockup',
    },

    graphWSEndpoints: {
        alchemybench: 'wss://api.thegraph.com/subgraphs/name/luckydogedev/alchemybench',
        exchange: 'wss://api.thegraph.com/subgraphs/name/luckydogedev/exchange',
        blocklytics: 'wss://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
    },

    alchemybenchAddress: "0x210e8B3600aea3943D2e45a913723931c97895Fe",
    smelterAddress: "0xaDc17F781b6E4aee6f1d52f610ed2FCAf476fA65",
    minerAddress: "0x5c6Be5B84d6e181cA0aA8b6F00100Aa499C88862",
    golnAddress: "0xd0fb6753E4A2dFfA6033836327e23Ec2e417446E",
    factoryAddress: "0x12a7FD816401d75F4a76915d3a9a9E4AF0EcBb0D",

    TWENTY_FOUR_HOURS: 86400,
}
