import { handlePoolV1 } from "./handlerV1";
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
} from "../../../generated/SushiMasterChef/SushiMasterChef";
import { ZERO_BI } from "../../utils/constants";

export function handleDeposit(event: DepositEvent): void {
  let eventType = "";
  if (event.params.amount == ZERO_BI) {
    eventType = "LPS_RewardAdded";
  } else {
    eventType = "LPS_Staked";
  }

  handlePoolV1(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.pid,
    eventType,
    event.params.amount,
    event.transactionLogIndex,
    event.transaction.gasUsed,
    event.transaction.gasPrice,
  );
}
export function handleWithdraw(event: WithdrawEvent): void {
  let eventType = "";
  if (event.params.amount == ZERO_BI) {
    eventType = "LPS_RewardPaid";
  } else {
    eventType = "LPS_Withdrawn";
  }
  handlePoolV1(
    event.transaction.hash,
    event.block.number,
    event.block.timestamp,
    event.params.pid,
    eventType,
    event.params.amount,
    event.transactionLogIndex,
    event.transaction.gasUsed,
    event.transaction.gasPrice,
  );
}
