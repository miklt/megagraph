import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { SushiKashiData, SushiPoolData, SushiTokenData } from "../../../generated/schema";
import { SushiMasterChef } from "../../../generated/SushiMasterChef/SushiMasterChef";
import { SushiUniswapV2Pair } from "../../../generated/SushiMasterChef/SushiUniswapV2Pair";
import { convertBINumToDesiredDecimals, convertBytesToAddress, toAddress } from "../../utils/converters";
import { SushiMasterChefAddress, ZERO_ADDRESS, ZERO_BD, ZERO_BI } from "../../utils/constants";

export function handlePoolV1(txnHash: Bytes, blockNumber: BigInt, timestamp: BigInt, poolId: BigInt): void {
  let entity = SushiTokenData.load(txnHash.toHex());
  if (!entity) entity = new SushiTokenData(txnHash.toHex());

  entity.blockNumber = blockNumber;
  entity.blockTimestamp = timestamp;

  let masterChefContract = SushiMasterChef.bind(SushiMasterChefAddress);

  //let pool = getPoolData(masterChefContract, poolId);
  let pool = SushiPoolData.load(poolId.toString());
  if (!pool) {
    pool = new SushiPoolData(poolId.toString());
    pool.save();
  }

  entity.pool = pool.id;

  // calculate SUSHI per second

  let totalSushiPerBlock = ZERO_BD;

  let sushiPerBlock = masterChefContract.try_sushiPerBlock();
  if (sushiPerBlock.reverted) {
    log.warning("sushiPerSecond() reverted", []);
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
  //   let multiplier = BigInt.fromString("1");
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
  //   let multiplierResult = masterChefContract.try_getMultiplier(lastRewardTime, blockNumber);
  //   if (multiplierResult.reverted) {
  //     log.warning("multiplier({}) reverted", [blockNumber.toString()]);
  //   } else {
  //     multiplier = multiplierResult.value;
  //   }

  if (totalAllocPoint > ZERO_BI) {
    entity.sushiPerBlock = totalSushiPerBlock.times(allocPoint.toBigDecimal()).div(totalAllocPoint.toBigDecimal());
  }
  entity.allocPoint = allocPoint;
  entity.lpAddress = lpAddress;
  entity.accSushiPerShare = accSushiPerShare;
  entity.lastRewardTime = lastRewardTime;
  entity.save();
}
function getPoolData(masterChefContract: SushiMasterChef, id: BigInt): SushiPoolData {
  let pool = SushiPoolData.load(id.toString());
  if (pool) {
    return pool as SushiPoolData;
  }

  pool = new SushiPoolData(id.toString());

  let lpTokenResult = masterChefContract.try_poolInfo(id);
  if (lpTokenResult.reverted) {
    log.warning("lpToken({}) reverted", [id.toString()]);
  } else {
    pool.lpToken = lpTokenResult.value.value0;
  }

  pool.save();

  return pool as SushiPoolData;
}
