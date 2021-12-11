import { Address } from '@graphprotocol/graph-ts'
import {Transfer, Submitted, Withdrawal} from '../../../generated/LidoTokenstETH/LidoToken'
import {LidoTokenData,LidoRewardData} from '../../../generated/schema'
import { loadLidoContract, loadOracleContract } from './handlers'
export function handleTransfer(event: Transfer): void {
    // new lido event.
    let value = event.params.value
    let entity = LidoTokenData.load(event.transaction.hash.toHex()) 
    if (entity == null){
        entity = new LidoTokenData(
        event.transaction.hash.toHex() 
      )
      entity.blockNumber = event.block.number
      entity.blockTimestamp = event.block.timestamp
    }
    entity.save()
}
export function handleSubmitted(event: Submitted): void {
    // new lido event.
    let entity = LidoTokenData.load(event.transaction.hash.toHex()) 
    if (entity == null){
        entity = new LidoTokenData(
        event.transaction.hash.toHex() 
      )
    }
    let lidoContract = loadLidoContract()
    let totalPooledEther = lidoContract.getTotalPooledEther()
    let shares = lidoContract.getTotalShares()

    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    let amount = event.params.amount
    entity.tokenAmount = amount
    entity.totalPooledEtherAfter = totalPooledEther
    entity.totalPooledEtherBefore=totalPooledEther.minus(amount)
    entity.totalSharesAfter = shares
    
    entity.save()
}
export function handleWithdrawal(event: Withdrawal): void {
    // new lido event.
    let entity = LidoTokenData.load(event.transaction.hash.toHex()) 
    if (entity == null){
        entity = new LidoTokenData(
        event.transaction.hash.toHex() 
      )
    }
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.save()
}