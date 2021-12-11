import { Address } from '@graphprotocol/graph-ts'
import {Completed, PostTotalShares} from '../../../generated/LidoOracle/LidoOracle'
import {LidoTokenData,LidoRewardData} from '../../../generated/schema'
import { loadLidoContract, loadOracleContract } from './handlers'

export function handleCompleted(event: Completed): void {

    let lidoContract = loadLidoContract()
    let balance = event.params.beaconBalance
    
    // new lido event.
    let entity = LidoRewardData.load(event.transaction.hash.toHex()) 
    if (entity == null){
        entity = new LidoRewardData(
        event.transaction.hash.toHex() 
      )
      entity.blockNumber = event.block.number
      entity.blockTimestamp = event.block.timestamp
    }
     
    entity.save()
}
export function handlePostTotalShares(event: PostTotalShares): void {
    let totalEtherBefore = event.params.preTotalPooledEther
    let totalEtherAfter = event.params.postTotalPooledEther
    let shares = event.params.totalShares

    // new lido event.
    let entity = LidoRewardData.load(event.transaction.hash.toHex()) 
    if (entity == null){
        entity = new LidoRewardData(
        event.transaction.hash.toHex() 
      )
      entity.blockNumber = event.block.number
      entity.blockTimestamp = event.block.timestamp
    }

    entity.save()
}