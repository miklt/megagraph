import { Address, BigInt, BigDecimal, Bytes, log } from "@graphprotocol/graph-ts";
import { MaiTokenData, MaiPoolData } from "../../../generated/schema";
import { convertBINumToDesiredDecimals, convertBytesToAddress } from "../../utils/converters";
import { MaiFinanceFarmAddress, ZERO_BD, ZERO_BI } from "../../utils/constants";
import { MaiFarm } from "../../../generated/MaiFarm/MaiFarm";

export function handlePool(
  txnHash: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt,
  poolId: BigInt,
  amount: BigInt,
): void {
  let contract = MaiFarm.bind(MaiFinanceFarmAddress);
  let rewardPerBlock;
  let rewardPerBlockResult = contract.try_rewardPerBlock();
  if (rewardPerBlockResult.reverted) {
    log.warning("rewardPerBlock", []);
  } else {
    rewardPerBlock = rewardPerBlockResult.value;
  }
}
export const loadProtocol = (): MaiTokenData => {
  let protocol = MaiTokenData.load("V1");
  if (!protocol) {
    protocol = new MaiTokenData("V1");
    protocol.totalClosingFees = BigInt.fromI32(0);
    protocol.averageCollateralRatio = BigDecimal.fromString("0");
    protocol.totalDeposited = BigInt.fromI32(0);
    protocol.totalBorrowed = BigInt.fromI32(0);
  }

  return protocol as MaiTokenData;
};
export const loadVault = (vaultId: string): MaiPoolData => {
  let vault = MaiPoolData.load(vaultId);
  if (!vault) {
    vault = new MaiPoolData(vaultId);
    vault.deposited = BigInt.fromI32(0);
    vault.borrowed = BigInt.fromI32(0);
    vault.closingFees = BigInt.fromI32(0);
    //vault.collateralRatio = BigDecimal.fromString("0");
  }

  return vault as MaiPoolData;
};
