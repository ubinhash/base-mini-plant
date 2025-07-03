import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AchievementUnlocked,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  PetalGrown,
  PetalTrimmed,
  PlantMinted,
  PlantVaulted,
  Transfer
} from "../generated/MiniPlant/MiniPlant"

export function createAchievementUnlockedEvent(
  user: Address,
  achievementId: i32,
  tokenId: BigInt
): AchievementUnlocked {
  let achievementUnlockedEvent = changetype<AchievementUnlocked>(newMockEvent())

  achievementUnlockedEvent.parameters = new Array()

  achievementUnlockedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  achievementUnlockedEvent.parameters.push(
    new ethereum.EventParam(
      "achievementId",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(achievementId))
    )
  )
  achievementUnlockedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return achievementUnlockedEvent
}

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPetalGrownEvent(
  owner: Address,
  tokenId: BigInt,
  newPetalCount: i32,
  colorIndex: i32
): PetalGrown {
  let petalGrownEvent = changetype<PetalGrown>(newMockEvent())

  petalGrownEvent.parameters = new Array()

  petalGrownEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  petalGrownEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  petalGrownEvent.parameters.push(
    new ethereum.EventParam(
      "newPetalCount",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newPetalCount))
    )
  )
  petalGrownEvent.parameters.push(
    new ethereum.EventParam(
      "colorIndex",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(colorIndex))
    )
  )

  return petalGrownEvent
}

export function createPetalTrimmedEvent(
  owner: Address,
  tokenId: BigInt,
  newPetalCount: i32
): PetalTrimmed {
  let petalTrimmedEvent = changetype<PetalTrimmed>(newMockEvent())

  petalTrimmedEvent.parameters = new Array()

  petalTrimmedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  petalTrimmedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  petalTrimmedEvent.parameters.push(
    new ethereum.EventParam(
      "newPetalCount",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newPetalCount))
    )
  )

  return petalTrimmedEvent
}

export function createPlantMintedEvent(
  owner: Address,
  tokenId: BigInt
): PlantMinted {
  let plantMintedEvent = changetype<PlantMinted>(newMockEvent())

  plantMintedEvent.parameters = new Array()

  plantMintedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  plantMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return plantMintedEvent
}

export function createPlantVaultedEvent(
  owner: Address,
  tokenId: BigInt
): PlantVaulted {
  let plantVaultedEvent = changetype<PlantVaulted>(newMockEvent())

  plantVaultedEvent.parameters = new Array()

  plantVaultedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  plantVaultedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return plantVaultedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
