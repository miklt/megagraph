import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { SushiPoolData, SushiTokenData } from "../../../generated/schema";
import { SushiMasterChef } from "../../../generated/SushiMasterChef/SushiMasterChef";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { SushiMasterChefAddress, ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../../utils/constants";

export function handlePoolV1(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt,
  type: string,
): void {
  if (poolId.toString() != "1" && poolId.toString() != "8" && poolId.toString() != "17") {
    return;
  }
  let entity = SushiTokenData.load(txnHash.toHex());
  if (!entity) entity = new SushiTokenData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;
  entity.type = type;

  let masterChefContract = SushiMasterChef.bind(SushiMasterChefAddress);

  let pool = SushiPoolData.load(poolId.toString());
  if (!pool) {
    pool = new SushiPoolData(poolId.toString());
    pool.save();
  }

  entity.pool = pool.id;

  // calculate SUSHI per block

  let totalSushiPerBlock = ZERO_BD;

  let sushiPerBlock = masterChefContract.try_sushiPerBlock();
  if (sushiPerBlock.reverted) {
    log.warning("sushiPerBlock() reverted", []);
  } else {
    totalSushiPerBlock = convertBINumToDesiredDecimals(sushiPerBlock.value, 18);
  }

  let totalAllocPoint = ZERO_BI;
  let totalAllocPointResult = masterChefContract.try_totalAllocPoint();
  if (totalAllocPointResult.reverted) {
    log.warning("totalAllocPoint() reverted", []);
  } else {
    totalAllocPoint = totalAllocPointResult.value;
  }

  let allocPoint = ZERO_BI;
  let lastRewardTime = ZERO_BI;
  let lpAddress = ZERO_ADDRESS;
  let accSushiPerShare = ZERO_BD;
  let poolInfoResult = masterChefContract.try_poolInfo(poolId);
  if (poolInfoResult.reverted) {
    log.warning("poolInfo({}) reverted", [poolId.toString()]);
  } else {
    lpAddress = poolInfoResult.value.value0;
    allocPoint = poolInfoResult.value.value1;
    lastRewardTime = poolInfoResult.value.value2;
    accSushiPerShare = convertBINumToDesiredDecimals(poolInfoResult.value.value3, 12);
  }

  if (totalAllocPoint > ZERO_BI) {
    entity.sushiPerBlock = totalSushiPerBlock.times(allocPoint.toBigDecimal()).div(totalAllocPoint.toBigDecimal());
  }
  entity.allocPoint = allocPoint;
  entity.lpAddress = lpAddress;
  entity.accSushiPerShare = accSushiPerShare;
  entity.lastRewardTime = lastRewardTime;
  entity.save();
}
