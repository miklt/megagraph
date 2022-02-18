import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { SushiPoolData, SushiTokenData } from "../../../generated/schema";
import { SushiMasterChefV2 } from "../../../generated/SushiMasterChefV2/SushiMasterChefV2";
import { SushiCloneRewarderTime } from "../../../generated/SushiMasterChefV2/SushiCloneRewarderTime";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { SushiMasterChefV2Address, ZERO_BD, ZERO_BI } from "../../utils/constants";

export function handlePool(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, poolId: BigInt): void {
  let entity = SushiTokenData.load(txnHash.toHex());
  if (!entity) entity = new SushiTokenData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;

  let masterChefV2Contract = SushiMasterChefV2.bind(SushiMasterChefV2Address);

  let pool = getPoolData(masterChefV2Contract, poolId);
  entity.pool = pool.id;

  // calculate SUSHI per block

  let totalSushiPerSecond = ZERO_BD;
  let sushiPerSecondResult = masterChefV2Contract.try_sushiPerBlock();
  if (sushiPerSecondResult.reverted) {
    log.warning("sushiPerSecond() reverted", []);
  } else {
    totalSushiPerSecond = convertBINumToDesiredDecimals(sushiPerSecondResult.value, 18);
  }

  let totalAllocPoint = ZERO_BI;
  let totalAllocPointResult = masterChefV2Contract.try_totalAllocPoint();
  if (totalAllocPointResult.reverted) {
    log.warning("totalAllocPoint() reverted", []);
  } else {
    totalAllocPoint = totalAllocPointResult.value;
  }

  let allocPoint = ZERO_BI;
  let poolInfoResult = masterChefV2Contract.try_poolInfo(poolId);
  if (poolInfoResult.reverted) {
    log.warning("poolInfo({}) reverted", [poolId.toString()]);
  } else {
    entity.lastRewardTime = poolInfoResult.value.value1;
    allocPoint = poolInfoResult.value.value2;
  }

  if (totalAllocPoint > ZERO_BI) {
    entity.sushiPerSecond = totalSushiPerSecond.times(allocPoint.toBigDecimal()).div(totalAllocPoint.toBigDecimal());
  }

  // calculate rewardPerSecond

  let rewarderResult = masterChefV2Contract.try_rewarder(poolId);
  if (rewarderResult.reverted) {
    log.warning("rewarder({}) reverted", [poolId.toString()]);
  } else {
    let complexRewarderTimeContract = SushiCloneRewarderTime.bind(rewarderResult.value);
    let rewardPerSecondResult = complexRewarderTimeContract.try_rewardPerSecond();
    if (rewardPerSecondResult.reverted) {
      log.warning("rewardPerSecond() reverted", []);
    } else {
      let rewardPerSecond = convertBINumToDesiredDecimals(rewardPerSecondResult.value, 18);

      if (totalAllocPoint > ZERO_BI) {
        entity.rewardPerSecond = rewardPerSecond.times(allocPoint.toBigDecimal()).div(totalAllocPoint.toBigDecimal());
      }
    }
  }

  entity.save();
}

function getPoolData(masterChefV2Contract: SushiMasterChefV2, id: BigInt): SushiPoolData {
  let pool = SushiPoolData.load(id.toString());
  if (pool) {
    return pool as SushiPoolData;
  }

  pool = new SushiPoolData(id.toString());
  pool.save();

  return pool as SushiPoolData;
}
