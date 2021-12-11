import { LidoNodeOperatorsRegistryAddress, LidoOracleAddress, LidoTokenAddress } from "../../utils/constants";
import { LidoToken } from "../../../generated/LidoTokenstETH/LidoToken";
import { LidoOracle } from "../../../generated/LidoOracle/LidoOracle";
export {LidoOracleAddress, LidoTokenAddress, LidoNodeOperatorsRegistryAddress}
export const loadLidoContract = (): LidoToken => LidoToken.bind(LidoTokenAddress)
export const loadOracleContract = (): LidoOracle => LidoOracle.bind(LidoOracleAddress)