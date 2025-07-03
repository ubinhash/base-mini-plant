import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AchievementUnlocked } from "../generated/schema"
import { AchievementUnlocked as AchievementUnlockedEvent } from "../generated/MiniPlant/MiniPlant"
import { handleAchievementUnlocked } from "../src/mini-plant"
import { createAchievementUnlockedEvent } from "./mini-plant-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let achievementId = 123
    let tokenId = BigInt.fromI32(234)
    let newAchievementUnlockedEvent = createAchievementUnlockedEvent(
      user,
      achievementId,
      tokenId
    )
    handleAchievementUnlocked(newAchievementUnlockedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AchievementUnlocked created and stored", () => {
    assert.entityCount("AchievementUnlocked", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AchievementUnlocked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AchievementUnlocked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "achievementId",
      "123"
    )
    assert.fieldEquals(
      "AchievementUnlocked",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
