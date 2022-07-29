import { BigInt, BigDecimal, Bytes, log } from "@graphprotocol/graph-ts";
import { SushiPoolData, SushiTokenData } from "../../../generated/schema";
import { SushiMasterChef } from "../../../generated/SushiMasterChef/SushiMasterChef";
import { convertBINumToDesiredDecimals } from "../../utils/converters";
import { SushiMasterChefAddress, ZERO_ADDRESS, ZERO_BD, ZERO_BI, AAVE_ETH_ADDRESS } from "../../utils/constants";
import { SushiUniswapV2Pair as Pair } from "../../../generated/SushiMasterChef/SushiUniswapV2Pair";

export function handlePoolV1(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt,
  type: string,
  amount: BigInt,
  logIndex: BigInt,
  txGasUsed: BigInt,
  txGasPrice: BigInt,
): void {
  if (poolId.toString() != "37") {
    return;
  }
  let entity = SushiTokenData.load(txnHash.toHex() + "-" + logIndex.toString());
  if (!entity) entity = new SushiTokenData(txnHash.toHex() + "-" + logIndex.toString());
  let indexBD = logIndex.toBigDecimal().div(BigDecimal.fromString("1000"));
  let indexedBlock = blockNumber.toBigDecimal().plus(indexBD);
  // Gas tracking
  let cost = txGasUsed.times(txGasPrice);
  entity.gasCost = cost;

  entity.blocknumber = blockNumber;
  entity.indexedBlock = indexedBlock;
  entity.timestamp = timestamp;
  entity.event = type;
  entity.amount = amount;

  let masterChefContract = SushiMasterChef.bind(SushiMasterChefAddress);
  let pairContract = Pair.bind(AAVE_ETH_ADDRESS);

  let pool = SushiPoolData.load(poolId.toString());
  if (!pool) {
    pool = new SushiPoolData(poolId.toString());
    pool.save();
  }

  entity.poolId = pool.id;

  // calculate total staked lp tokens in masterchefv1

  let stakedTokensResult = pairContract.try_balanceOf(SushiMasterChefAddress);
  let stakedTokens = ZERO_BI;
  if (stakedTokensResult.reverted) {
    log.warning("balanceOf() reverted", []);
  } else {
    stakedTokens = stakedTokensResult.value;
  }
  entity.totalStakedLPTokens = stakedTokens;

  // calculate SUSHI per block

  let totalSushiPerBlock = ZERO_BI;

  let sushiPerBlock = masterChefContract.try_sushiPerBlock();
  if (sushiPerBlock.reverted) {
    log.warning("sushiPerBlock() reverted", []);
  } else {
    totalSushiPerBlock = sushiPerBlock.value;
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
  let accSushiPerShare = ZERO_BI;
  let poolInfoResult = masterChefContract.try_poolInfo(poolId);
  if (poolInfoResult.reverted) {
    log.warning("poolInfo({}) reverted", [poolId.toString()]);
  } else {
    lpAddress = poolInfoResult.value.value0;
    allocPoint = poolInfoResult.value.value1;
    lastRewardTime = poolInfoResult.value.value2;
    accSushiPerShare = poolInfoResult.value.value3;
  }

  if (totalAllocPoint > ZERO_BI) {
    entity.stakedLPRewardsPerBlock = totalSushiPerBlock.times(allocPoint).div(totalAllocPoint);
  }
  entity.allocPoint = allocPoint;
  entity.lpAddress = lpAddress;
  entity.accSushiPerShare = accSushiPerShare;
  entity.lastRewardTime = lastRewardTime;
  entity.save();
}
