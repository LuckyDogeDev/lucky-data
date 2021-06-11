'use strict';

const pageResults = require('graph-results-pager');

const { Promise } = require('bluebird')

const { graphAPIEndpoints } = require('./constants')

const goldnugget = require('./queries/goldnugget');
const blocks = require('./queries/blocks');
const charts = require('./queries/charts');
const exchange = require('./queries/exchange');
const exchange_v1 = require('./queries/exchange_v1')
const goldminer = require('./queries/goldminer');
const alchemybench = require('./queries/alchemybench')
const smelter = require('./queries/smelter')
const timelock =  require('./queries/timelock');
const lockup = require('./queries/lockup');
const alpine = require('./queries/alpine');
const utils = require('./utils');

module.exports = {
	pageResults,
	graphAPIEndpoints,
	goldnugget,
	blocks,
	charts,
	exchange,
	exchange_v1,
	goldminer,
	alchemybench,
	smelter,
	timelock,
	lockup,
	alpine,
	utils,
	async timeseries({blocks = undefined, timestamps = undefined, target = undefined} = {}, targetArguments) {
		if(!target) { throw new Error("lucky-data: Target function undefined"); }
		if(!blocks && !timestamps) { throw new Error("lucky-data: Timeframe undefined"); }

		if(blocks) {
			return Promise.map(blocks, async (block) => ({
				block,
				data: await target({block, ...targetArguments})
			}));
		}

		else {
			return Promise.map(timestamps, async (timestamp) => ({
				timestamp,
				data: await target({timestamp, ...targetArguments})
			}));
		}
	},
};
