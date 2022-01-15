// import events
import {
  CreateVault as CreateVaultEvent,
  MaiQiStableCoin,
} from "../../../generated/MaiQiStableCoinmiMATIC/MaiQiStableCoin";
import { DestroyVault as DestroyVaultEvent } from "../../../generated/MaiQiStableCoinmiMATIC/MaiQiStableCoin";
import { TransferVault as TransferVaultEvent } from "../../../generated/MaiQiStableCoinmiMATIC/MaiQiStableCoin";
import { DepositCollateral as DepositCollateralEvent } from "../../../generated/MaiQiStableCoinmiMATIC/MaiQiStableCoin";
import { WithdrawCollateral as WithdrawCollateralEvent } from "../../../generated/MaiQiStableCoinmiMATIC/MaiQiStableCoin";
import { BorrowToken as BorrowTokenEvent } from "../../../generated/MaiQiStableCoinmiMATIC/MaiQiStableCoin";
import { PayBackToken as PayBackTokenEvent } from "../../../generated/MaiQiStableCoinmiMATIC/MaiQiStableCoin";
import { BuyRiskyVault as BuyRiskyVaultEvent } from "../../../generated/MaiQiStableCoinmiMATIC/MaiQiStableCoin";
import { log } from "@graphprotocol/graph-ts";
// import event handlers from handlers.ts
import { handlePool, loadProtocol, loadVault } from "./handlers";

export function handleCreateVault(event: CreateVaultEvent): void {}
export function handleDestroyVault(event: DestroyVaultEvent): void {}
export function handleTransferVault(event: TransferVaultEvent): void {}
export function handleDepositCollateral(event: DepositCollateralEvent): void {
  let vaultId = event.params.vaultID.toString();
  let txHash = event.transaction.hash.toHexString();

  let vault = loadVault(vaultId);
  vault.deposited = vault.deposited.plus(event.params.amount);
  vault.blockNumber = event.block.number;
  vault.blockTimestamp = event.block.timestamp;

  vault.txHash = txHash;
  let contract = MaiQiStableCoin.bind(event.address);
  let tokenPrice = contract.getTokenPriceSource();
  let ethPrice = contract.getEthPriceSource();

  // Increase Protocol Deposits
  let protocol = loadProtocol();
  protocol.totalDeposited = protocol.totalDeposited.plus(event.params.amount);
  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    log.warning("symbol() reverted", []);
  } else {
    vault.symbol = symbolResult.value;
  }
  // Recalculate Collaterals
  // calculateVaultCollateRatio(vault);
  // calculateProtocolCollateralRatio(protocol);

  // Save
  protocol.save();
  vault.save();
}
export function handleWithdrawCollateral(event: WithdrawCollateralEvent): void {
  let vaultId = event.params.vaultID.toString();
  //const vault = loadVault(vaultId);
  //vault.deposited = vault.deposited.minus(event.params.amount);

  // Reduce Protocol Deposits
  let protocol = loadProtocol();
  protocol.totalDeposited = protocol.totalDeposited.minus(event.params.amount);

  // Recalculate Collaterals
  //calculateVaultCollateRatio(vault);
  //calculateProtocolCollateralRatio(protocol);

  // Save
  protocol.save();
  //vault.save();
}
export function handleBorrowToken(event: BorrowTokenEvent): void {}
export function handlePayBackToken(event: PayBackTokenEvent): void {}
export function handleBuyRiskyVault(event: BuyRiskyVaultEvent): void {}
