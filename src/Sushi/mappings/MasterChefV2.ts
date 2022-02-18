import { LogUpdatePool as LogUpdatePoolEvent } from "../../../generated/SushiMasterChefV2/SushiMasterChefV2";
import { handlePool } from "./handlerV2";

export function handleLogUpdatePool(event: LogUpdatePoolEvent): void {
  handlePool(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid);
}
