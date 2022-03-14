import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Add as AddEvent,
  Set as SetEvent,
  Deposit as DepositEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
  Withdraw as WithdrawEvent,
} from "../../../generated/TraderJoeMasterChefJoeV3/TraderJoeMasterChefJoeV3";
import { handlePool } from "./handlerFarm";

export function handleAdd(event: AddEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Add";
  let lpToken: Address = event.params.lpToken;
  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "V3", lpToken);
}
export function handleSet(event: SetEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Set";

  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "V3", null);
}
export function handleDeposit(event: DepositEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Deposit";

  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "V3", null);
}
export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "EmergencyWithdraw";

  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "V3", null);
}

export function handleWithdraw(event: WithdrawEvent): void {
  let txnHash = event.transaction.hash;
  let blockNumber = event.block.number;
  let timestamp = event.block.timestamp;
  let poolId = event.params.pid;
  let eventType = "Withdraw";

  handlePool(txnHash, blockNumber, timestamp, poolId, eventType, "V3", null);
}
