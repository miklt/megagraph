import { LogUpdatePool as LogUpdatePoolEvent } from "../../../generated/SushiMiniChefV2/SushiMiniChefV2";
import { handleV2Pool } from "./handlerV2";

export function handleLogUpdatePool(event: LogUpdatePoolEvent): void {
  handlePool(event.transaction.hash, event.block.number, event.block.timestamp, event.params.pid);
}
