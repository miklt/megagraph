import { Withdraw as WithdrawEvent } from "../../../generated/MaiFarm/MaiFarm";
import { Deposit as DepositEvent } from "../../../generated/MaiFarm/MaiFarm";
import { EmergencyWithdraw as EmergencyWithdrawEvent } from "../../../generated/MaiFarm/MaiFarm";
import { handlePool } from "./handlers";

export function handleWithdraw(event: WithdrawEvent): void {
  handlePool(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid, event.params.amount);
}
export function handleDeposit(event: DepositEvent): void {
  handlePool(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid, event.params.amount);
}
export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  handlePool(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid, event.params.amount);
}
