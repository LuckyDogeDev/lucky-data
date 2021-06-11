import goldnugget = require("./typings/goldnugget");
import blocks = require("./typings/blocks");
import charts = require("./typings/charts");
import exchange = require("./typings/exchange");
import exchange_v1 = require("./typings/exchange_v1");
import goldminer = require("./typings/goldminer");
import alchemybench = require("./typings/alchemybench");
import smelter = require("./typings/smelter");
import timelock = require("./typings/timelock");
import lockup = require("./typings/lockup");
import utils = require("./typings/utils")
import alpine = require("./typings/alpine");

export = LuckyData;
export as namespace LuckyData;

declare namespace LuckyData {

    export declare function timeseries({ blocks, timestamps, target }: {
        blocks?: number[];
        timestamps?: number[];
        target: Function;
    }, targetArguments?: any): Promise<any>;

    export { goldnugget, blocks, charts, exchange, exchange_v1, goldminer, alchemybench, smelter, timelock, lockup, utils, alpine };
}
