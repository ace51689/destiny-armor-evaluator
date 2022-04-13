import { getManifest, getCurrentManifest, getProfile, getVendors } from "../endpoints";

async function getStaticArmor() {
  const manifest = await getManifest()
  const currentManifest = await getCurrentManifest(manifest.Response.jsonWorldContentPaths.en)

  const staticArmor = Object.entries(currentManifest.DestinyInventoryItemDefinition).filter((item) => {
    if (item[1].itemType === 2) {
      return item
    }
    return false
  }).filter((item) => {
    if (item[1].inventory.tierType > 4) {
      return item
    }
    return false
  }).filter((item) => {
    if (item[1].itemCategoryHashes[1] !== 49) {
      return item
    }
    return false
  })

  return staticArmor
}

async function getIntrinsics() {
  const manifest = await getManifest()
  const currentManifest = await getCurrentManifest(manifest.Response.jsonWorldContentPaths.en)

  const intrinsics = Object.entries(currentManifest.DestinyInventoryItemDefinition).filter((item) => {
    if (item[1].plug) {
      return item
    }
    return false
  }).filter((item) => {
    const isIntrinsic = item[1].plug.plugCategoryIdentifier === "intrinsics"
    const isOrnament = item[1].plug.plugCategoryIdentifier.includes('skins')
    if (isIntrinsic || isOrnament) {
      return item
    }
    return false
  })

  return intrinsics
}


async function createArmorArray(destinyId, memberType, authToken, staticArmor, intrinsics) {
  let armorArray = []
  await getProfile(destinyId, memberType, authToken)
    .then((response) => {
      if (!response) {
        armorArray = false
        return false
      }
      const info = response.Response

      //Create an array of item components. Used to get some information about the armor piece (instanceId & static itemHash)
      const itemComponentsArray = Object.entries(info.itemComponents.instances.data)
        .filter(item => item[1].primaryStat !== undefined)
        .filter(item => item[1].primaryStat.statHash === 3897883278)

      //Creates an array of instanceIds that belong to instanced ARMOR. Used for filtering the vaultArray.
      const armorInstanceIds = itemComponentsArray.map(item => item[0])

      //Creates an array of instanced items in players vault or shared between characters  
      const vaultArray = info.profileInventory.data.items.filter(item => item.itemInstanceId !== undefined)

      //Adds instanced items that are currently held on characters to the vaultArray
      Object.entries(info.characterInventories.data)
        .forEach(character => {
          character[1].items
            .filter(item => item.itemInstanceId !== undefined)
            .forEach(item => vaultArray.push(item))
        })

      //Adds instanced items that are currently equipped on characters to the vaultArray 
      Object.entries(info.characterEquipment.data)
        .forEach(character => {
          character[1].items
            .filter(item => item.itemInstanceId !== undefined)
            .forEach(item => vaultArray.push(item))
        })

      //Filters the vaultArray down to just instanced armor items.
      const masterArray = vaultArray.filter(item => armorInstanceIds.includes(item.itemInstanceId))

      //Creates an array of item sockets that we'll use to get the base stats of each armor piece
      const socketsArray = Object.entries(info.itemComponents.sockets.data).filter(item => armorInstanceIds.includes(item[0]))

      itemComponentsArray
        .forEach((item) => {
          const obj = {}
          const itemArray = [item[0]]
          obj.itemInstanceId = item[0]
          obj.itemType = "Armor"
          obj.owned = true
          obj.stats = {}
          obj.stats.mobility = 0
          obj.stats.resilience = 0
          obj.stats.recovery = 0
          obj.stats.discipline = 0
          obj.stats.intellect = 0
          obj.stats.strength = 0

          const currentArmor = masterArray.find(item => item.itemInstanceId === obj.itemInstanceId)

          if (currentArmor === undefined) {
            return false
          }

          obj.itemHash = currentArmor.itemHash

          const currentStatic = staticArmor.find(item => item[0] === (obj.itemHash).toString())

          if (currentStatic === undefined) {
            return false
          }

          obj.name = currentStatic[1].displayProperties.name
          obj.itemSubType = currentStatic[1].itemTypeDisplayName
          obj.itemTier = currentStatic[1].inventory.tierTypeName
          obj.icon = currentStatic[1].displayProperties.icon
          obj.categoryHash = currentStatic[1].itemCategoryHashes[1]

          const statsPath = currentStatic[1].stats.stats
          if (statsPath[2996146975]) {
            obj.stats.mobility += statsPath[2996146975].value
          }
          if (statsPath[392767087]) {
            obj.stats.resilience += statsPath[392767087].value
          }
          if (statsPath[1943323491]) {
            obj.stats.recovery += statsPath[1943323491].value
          }

          switch (currentStatic[1].classType) {
            case 0:
              obj.equippableBy = "Titan"
              break;
            case 1:
              obj.equippableBy = "Hunter"
              break;
            case 2:
              obj.equippableBy = "Warlock"
              break;
            default:
              return
          }

          obj.powerLevel = item[1].primaryStat.value

          obj.energyCapacity = item[1].energy.energyCapacity
          if (item[1].energy.energyTypeHash === 591714140) {
            obj.energyType = "Solar"
          }
          else if (item[1].energy.energyTypeHash === 4069572561) {
            obj.energyType = "Void"
          }
          else if (item[1].energy.energyTypeHash === 728351493) {
            obj.energyType = "Arc"
          }
          else {
            obj.energyType = "Stasis"
          }

          obj.isMasterworked = obj.energyCapacity === 10


          const currentSockets = socketsArray.find(item => item[0] === obj.itemInstanceId)

          const intrinsicsPath = currentSockets[1].sockets
          const ornamentHash = intrinsicsPath[10].plugHash

          if (ornamentHash === 702981643 || ornamentHash === undefined) {
            obj.ornament = false
          } else {
            const ornamentInfo = intrinsics.find(ornament => ornament[0] === ornamentHash.toString())
            obj.ornament = ornamentInfo[1].displayProperties.icon
          }

          const tops = [intrinsicsPath[6], intrinsicsPath[7]]
          const bottoms = [intrinsicsPath[8], intrinsicsPath[9]]

          tops.forEach((hash) => {
            if (hash !== undefined && hash.isEnabled) {
              const intrinsic = intrinsics.find(item => item[0] === hash.plugHash.toString())
              if (intrinsic !== undefined) {
                const investmentStats = intrinsic[1].investmentStats
                obj.stats.mobility += investmentStats[0].value
                obj.stats.resilience += investmentStats[2].value
                obj.stats.recovery += investmentStats[1].value
              }
            }
          })

          bottoms.forEach((hash) => {
            if (hash !== undefined && hash.isEnabled) {
              const intrinsic = intrinsics.find(item => item[0] === hash.plugHash.toString())
              if (intrinsic !== undefined) {
                const investmentStats = intrinsic[1].investmentStats
                obj.stats.discipline += investmentStats[0].value
                obj.stats.intellect += investmentStats[1].value
                obj.stats.strength += investmentStats[2].value
              }
            }
          })

          itemArray.push(obj)
          armorArray.push(itemArray)
        })
    })

  return armorArray
}


async function gettingVendorArmor(memberType, destinyId, authToken, staticArmor) {
  const vendorHashes = ["2190858386", "350061650", "69482069", "248695599", "3603221665", "396892126", "1576276905"]
  const titanId = process.env.REACT_APP_TITAN_ID
  const hunterId = process.env.REACT_APP_HUNTER_ID
  const warlockId = process.env.REACT_APP_WARLOCK_ID
  const classIds = [titanId, hunterId, warlockId]
  let vendorArray = []

  for (const classId of classIds) {
    await getVendors(memberType, destinyId, classId, authToken)
      .then((response) => {
        const info = response.Response

        const releventVendorSales = Object.entries(info.sales.data)
          .filter(vendor => vendorHashes.includes(vendor[0]))


        const releventVendorStats = Object.entries(info.itemComponents)
          .filter(vendor => vendorHashes.includes(vendor[0]))


        releventVendorSales.forEach((vendor) => {
          const saleItems = Object.values(vendor[1].saleItems)
          saleItems.forEach((item) => {
            const staticPiece = staticArmor.find((staticItem) => staticItem[0] === item.itemHash.toString())
            const vendorStats = releventVendorStats.find((vendorToFind) => vendorToFind[0] === vendor[0])
            if (staticPiece !== undefined && vendorStats !== undefined) {
              const vendorItemIndex = item.vendorItemIndex
              const statsPath = vendorStats[1].stats.data[vendorItemIndex].stats
              const armorObject = {}
              const itemArray = [item.itemHash]
              armorObject.itemType = "Armor"
              armorObject.owned = false
              armorObject.powerLevel = 1350
              armorObject.vendorItemIndex = vendorItemIndex
              armorObject.vendorHash = vendor[0]
              armorObject.stats = {}
              armorObject.stats.mobility = statsPath[2996146975].value
              armorObject.stats.resilience = statsPath[392767087].value
              armorObject.stats.recovery = statsPath[1943323491].value
              armorObject.stats.discipline = statsPath[1735777505].value
              armorObject.stats.intellect = statsPath[144602215].value
              armorObject.stats.strength = statsPath[4244567218].value

              switch (vendor[0]) {
                case "69482069":
                  armorObject.vendor = "Zavala"
                  break;
                case "248695599":
                  armorObject.vendor = "Drifter"
                  break;
                case "350061650":
                  armorObject.vendor = "Ada-1"
                  break;
                case "3603221665":
                  armorObject.vendor = "Shaxx"
                  break;
                case "396892126":
                  armorObject.vendor = "Devrim"
                  break;
                case "1576276905":
                  armorObject.vendor = "Failsafe"
                  break;
                case "2190858386":
                  armorObject.vendor = "Xur"
                  break;
                default:
                  return
              }

              const staticStatsPath = staticPiece[1].stats.stats

              if (staticStatsPath[2996146975]) {
                armorObject.stats.mobility += staticStatsPath[2996146975].value
              }
              if (staticStatsPath[392767087]) {
                armorObject.stats.resilience += staticStatsPath[392767087].value
              }
              if (staticStatsPath[1943323491]) {
                armorObject.stats.recovery += staticStatsPath[1943323491].value
              }

              armorObject.name = staticPiece[1].displayProperties.name
              armorObject.itemSubType = staticPiece[1].itemTypeDisplayName
              armorObject.itemTier = staticPiece[1].inventory.tierTypeName
              armorObject.icon = staticPiece[1].displayProperties.icon
              armorObject.categoryHash = staticPiece[1].itemCategoryHashes[1]


              switch (staticPiece[1].classType) {
                case 0:
                  armorObject.equippableBy = "Titan"
                  break;
                case 1:
                  armorObject.equippableBy = "Hunter"
                  break;
                case 2:
                  armorObject.equippableBy = "Warlock"
                  break;
                default:
                  return
              }

              armorObject.ornament = false

              if (armorObject.name !== undefined) {
                itemArray.push(armorObject)
                vendorArray.push(itemArray)
              }

            }
          })
        })
      })
  }
  return vendorArray
}


export async function gettingUserArmor(destinyId, memberType, authToken, setLoading) {
  const staticArmor = await getStaticArmor()
  const intrinsics = await getIntrinsics()
  const userArray = await createArmorArray(destinyId, memberType, authToken, staticArmor, intrinsics)
  
  if (!userArray) {
    return false
  }
  
  const vendorArray = await gettingVendorArmor(memberType, destinyId, authToken, staticArmor)

  const armorArray = [...userArray, ...vendorArray]

  setLoading(false)

  return armorArray
}