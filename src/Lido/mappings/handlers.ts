import { store } from "@graphprotocol/graph-ts";
import { BigInt, Address, ByteArray } from "@graphprotocol/graph-ts";
import { LidoNodeOperatorsRegistryAddress, LidoOracleAddress, LidoTokenAddress } from "../../utils/constants";

import { LidoToken } from "../../../generated/LidoTokenstETH/LidoToken";
import { LidoOracle } from "../../../generated/LidoOracle/LidoOracle";
import { LidoNodeOperatorsRegistry } from "../../../generated/LidoOracle/LidoNodeOperatorsRegistry";
export { LidoOracleAddress, LidoTokenAddress, LidoNodeOperatorsRegistryAddress };
export const loadLidoContract = (): LidoToken => LidoToken.bind(LidoTokenAddress);
export const loadOracleContract = (): LidoOracle => LidoOracle.bind(LidoOracleAddress);
export const loadNORegistryContract = (): LidoNodeOperatorsRegistry =>
  LidoNodeOperatorsRegistry.bind(LidoNodeOperatorsRegistryAddress);
export const MAINNET_FIRST_ORACLE_REPORT = BigInt.fromI32(1610016625);
export const MAINNET_ORACLE_PERIOD = BigInt.fromI32(86400);
export const ORACLE_RUNS_BUFFER = BigInt.fromI32(50);
export const getFirstOracleReport = (): BigInt => MAINNET_FIRST_ORACLE_REPORT;
export const getOraclePeriod = (): BigInt => MAINNET_ORACLE_PERIOD;

// 1 ETH in WEI
export const ETHER = BigInt.fromString("1000000000000000000");
export const DEPOSIT_SIZE = BigInt.fromI32(32);
export const DEPOSIT_AMOUNT = DEPOSIT_SIZE.times(ETHER);
export const CALCULATION_UNIT = BigInt.fromI32(10000);
export const DUST_BOUNDARY = BigInt.fromI32(50000);
