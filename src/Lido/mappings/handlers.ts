import { LidoNodeOperatorsRegistryAddress, LidoOracleAddress, LidoTokenAddress } from "../../utils/constants";
import { LidoToken } from "../../../generated/LidoTokenstETH/LidoToken";
import { LidoOracle } from "../../../generated/LidoOracle/LidoOracle";
import {LidoNodeOperatorsRegistry} from "../../../generated/LidoOracle/LidoNodeOperatorsRegistry"
export {LidoOracleAddress, LidoTokenAddress, LidoNodeOperatorsRegistryAddress}
export const loadLidoContract = (): LidoToken => LidoToken.bind(LidoTokenAddress)
export const loadOracleContract = (): LidoOracle => LidoOracle.bind(LidoOracleAddress)
export const loadNORegistryContract = (): LidoNodeOperatorsRegistry => LidoNodeOperatorsRegistry.bind(LidoNodeOperatorsRegistryAddress)