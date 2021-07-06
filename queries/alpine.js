const pageResults = require('graph-results-pager')

const { request, gql } = require('graphql-request')

const { priceUSD: golnPriceUSD } = require('./goln')
const { token: tokenInfo } = require('./exchange')
const { ethPrice: ethPriceUSD } = require('./exchange')
const { info: goldMinerInfo } = require('./goldminer')
const { pool: minerPool } = require('./goldminer')
const { pools: minerPools } = require('./goldminer')

// accessed by chainId
const ENDPOINTS = {
  1: 'https://api.thegraph.com/subgraphs/name/luckyswap/alpine',
  250: 'https://api.thegraph.com/subgraphs/name/luckyswap/fantom-alpine',
  56: 'https://api.thegraph.com/subgraphs/name/luckyswap/bsc-alpine',
  137: 'https://api.thegraph.com/subgraphs/name/luckyswap/matic-alpine',
  100: 'https://api.thegraph.com/subgraphs/name/luckyswap/xdai-alpine',
}

const MASTER_CONTRACT = '0x2cba6ab6574646badc84f0544d05059e57a5dc42'

module.exports = {
  async clones({ masterAddress = undefined, chainId = undefined } = {}) {
    if(!masterAddress) { throw new Error("lucky-data: Master Address undefined"); }
    if(!chainId) { throw new Error("lucky-data: Chain Id undefined"); }

    return pageResults({
      api: ENDPOINTS[chainId],
      query: {
        entity: 'clones',
        selection: {
          where: {
            masterContract: `\\"${masterAddress.toLowerCase()}\\"`
          }
        },
        properties: clones.properties
      }
    })
      .then(results => clones.callback(results))
      .catch(err => console.log(err));
  },

  async goldveinStakedInfo() {
    const results = await pageResults({
      api: ENDPOINTS[1],
      query: {
        entity: 'goldveinPairs',
        properties: goldveinStakedInfo.properties
      }
    })

    let result = {}
    result.golnUSD = await golnPriceUSD();
    result.ethUSD = await ethPriceUSD();

    let goldMiner = await goldMinerInfo();
    result.totalAP = goldMiner.totalAllocPoint;
    result.golnPerBlock = goldMiner.golnPerBlock;

    let pools = await minerPools();
    let onsen_pools = pools.map(pool => pool.pair)
    let filtered_results = results.filter(pair => onsen_pools.includes(pair.id))
    result.goldveinPairs = filtered_results

    return goldveinStakedInfo.callback(result)
  },

}

const clones = {
  properties: [
    'id',
    'data'
  ],

  callback(results) {
    return results.map(({ id, data, block, timestamp }) => ({
      address: id,
      data: data
    }));
  }
}

const goldveinStakedInfo = {
  properties: [
    'id',
    'name',
    'symbol',
    'asset { id, symbol, decimals }',
    'collateral { id, symbol, decimals }',
    'totalAssetBase',
    'totalAssetElastic'
  ],

  async callback(results) {
    return await Promise.all(results.goldveinPairs.map(async (result) => {
      let asset = await tokenInfo({ token_address: result.asset.id });
      let assetPool = await minerPool({ pool_address: result.id });
      if (assetPool === undefined) { return }
      let stakedAmt = assetPool.slpBalance * 1e18;
      let balanceUSD = (stakedAmt * asset.derivedETH * results.ethUSD) / (10 ** result.asset.decimals);
      let rewardPerBlock = ((1 / results.totalAP) * results.golnPerBlock);
      let roiPerBlock = (rewardPerBlock * results.golnUSD) / balanceUSD;
      let roiPerYear = roiPerBlock * 6500 * 365

      return {
        id: result.id,
        name: result.name,
        symbol: result.symbol,
        asset: result.asset.id,
        assetSymbol: result.asset.symbol,
        assetDecimals: Number(result.asset.decimals),
        collateral: result.collateral.id,
        collateralSymbol: result.collateral.symbol,
        collateralDecimals: Number(result.collateral.decimals),
        totalAssetBase: Number(result.totalAssetBase),
        totalAssetElastic: Number(result.totalAssetElastic),
        totalAssetStaked: Number(stakedAmt),
        assetDecimals: Number(result.asset.decimals),
        balanceUSD: balanceUSD,
        rewardPerBlock: rewardPerBlock,
        roiPerBlock: roiPerBlock,
        roiPerYear: roiPerYear
      }
    }));
  }
}
