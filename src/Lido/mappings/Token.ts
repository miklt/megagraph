import { Address } from "@graphprotocol/graph-ts";
import { Transfer, Submitted, Withdrawal } from "../../../generated/LidoTokenstETH/LidoToken";
import { LidoTokenData, LidoRewardData, Totals } from "../../../generated/schema";
import { LidoTreasuryAddress, ZERO_BI } from "../../utils/constants";
import { loadLidoContract, loadOracleContract, loadNORegistryContract, DUST_BOUNDARY } from "./handlers";
export function handleTransfer(event: Transfer): void {
  // new lido event.
  let value = event.params.value;
  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new LidoTokenData(event.transaction.hash.toHex());
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
  }
  let lidoContract = loadLidoContract();
  let totalPooledEther = lidoContract.getTotalPooledEther();
  let totalShares = lidoContract.getTotalShares();
  let amount = event.params.value;
  entity.totalPooledEtherAfter = totalPooledEther;
  entity.totalSharesAfter = totalShares;
  entity.tokenAmount = amount;
  let fromZeros = event.params.from == Address.fromString("0x0000000000000000000000000000000000000000");

  let totalRewardsEntity = LidoRewardData.load(event.transaction.hash.toHex());
  let totals = Totals.load("") as Totals;
  let shares = event.params.value.times(totals.totalShares).div(totals.totalPooledEther);

  let isFeeDistributionToTreasury = fromZeros && event.params.to == LidoTreasuryAddress;

  // graph-ts less or equal to
  let isDust = event.params.value.lt(DUST_BOUNDARY);

  if (totalRewardsEntity != null && isFeeDistributionToTreasury && !isDust) {
    totalRewardsEntity.totalRewards = totalRewardsEntity.totalRewards.minus(event.params.value);
    totalRewardsEntity.totalFee = totalRewardsEntity.totalFee.plus(event.params.value);

    totalRewardsEntity.save();
  } else if (totalRewardsEntity != null && isFeeDistributionToTreasury && isDust) {
    totalRewardsEntity.totalRewards = totalRewardsEntity.totalRewards.minus(event.params.value);
    totalRewardsEntity.totalFee = totalRewardsEntity.totalFee.plus(event.params.value);

    totalRewardsEntity.save();
  } else if (totalRewardsEntity != null && fromZeros) {
    totalRewardsEntity.totalRewards = totalRewardsEntity.totalRewards.minus(event.params.value);
    totalRewardsEntity.totalFee = totalRewardsEntity.totalFee.plus(event.params.value);

    totalRewardsEntity.save();
  }

  entity.save();
}
export function handleSubmitted(event: Submitted): void {
  let totals = Totals.load("");

  let isFirstSubmission = !totals;

  if (!totals) {
    totals = new Totals("");
    totals.totalPooledEther = ZERO_BI;
    totals.totalShares = ZERO_BI;
  }

  // new lido event.
  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new LidoTokenData(event.transaction.hash.toHex());
  }
  let lidoContract = loadLidoContract();
  let totalPooledEther = lidoContract.getTotalPooledEther();
  let shares = lidoContract.getTotalShares();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  let amount = event.params.amount;
  entity.tokenAmount = amount;
  entity.totalPooledEtherAfter = totalPooledEther;
  entity.totalPooledEtherBefore = totalPooledEther.minus(amount);
  entity.totalSharesAfter = shares;
  entity.totalSharesBefore = shares.minus(amount);
  totals.totalPooledEther = totals.totalPooledEther.plus(event.params.amount);
  totals.totalShares = totals.totalShares.plus(shares);

  entity.save();
  totals.save();
}
export function handleWithdrawal(event: Withdrawal): void {
  // new lido event.
  let entity = LidoTokenData.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new LidoTokenData(event.transaction.hash.toHex());
  }
  let lidoContract = loadLidoContract();
  let totalPooledEther = lidoContract.getTotalPooledEther();
  let shares = lidoContract.getTotalShares();
  let amount = event.params.tokenAmount;
  let etherAmount = event.params.etherAmount;

  entity.tokenAmount = amount;
  entity.totalPooledEtherAfter = totalPooledEther;
  entity.totalPooledEtherBefore = totalPooledEther.plus(etherAmount);
  entity.totalSharesBefore = shares.plus(amount);
  entity.totalSharesAfter = shares;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.save();
}
