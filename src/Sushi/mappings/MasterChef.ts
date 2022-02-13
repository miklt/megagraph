import { handlePoolV1 } from "./handlerV1";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
} from "../../../generated/SushiMasterChef/SushiMasterChef";

export function handleDeposit(event: DepositEvent): void {
  handlePoolV1(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid);
}
export function handleWithdraw(event: WithdrawEvent): void {
  handlePoolV1(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid);
}
export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  handlePoolV1(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid);
}
