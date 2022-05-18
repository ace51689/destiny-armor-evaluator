const apiKey = process.env.REACT_APP_API_KEY
const baseURL = "https://www.bungie.net/"
const basePlatformURL = "https://www.bungie.net/Platform/"


async function getInventoryItemDefinitionsPath() {
  //Define the request url:
  const requestPath = `${basePlatformURL}Destiny2/Manifest`
  //Fetch the Destiny manifest:
  const request = await fetch(requestPath, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  })
  //Check the request status:
  if (request.status !== 200) {
    return false
  }
  //Store the response:
  const response = await request.json()
  //Store the URL path
  const inventoryItemDefinitionsPath = response.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition
  //Return the full URL for fetching Destiny iventory item definitions:
  return baseURL + inventoryItemDefinitionsPath
}


function findingStaticArmor(inventoryItemDefinitions) {
  //Create an array of static armor:
  const staticArmor = Object.entries(inventoryItemDefinitions)
    //Filter out non-armor items:
    .filter(item => item[1].itemType === 2)
    //Filter out non-legendary and non-exotic armor:
    .filter(item => item[1].inventory.tierType > 4)
    //Filter out class items:
    .filter(item => !item[1].itemCategoryHashes.includes(49))

  //Return filtered array:  
  return staticArmor
}


function findingIntrinsics(inventoryItemDefinitions) {
  //Create an array of intrinisics:
  const intrinsics = Object.entries(inventoryItemDefinitions)
    //Filter out items without plugs:
    .filter(item => item[1].plug)
    //Filter out items that aren't intrinisics OR armor ornaments:
    .filter(item => item[1].plug.plugCategoryIdentifier === "intrinsics")

  //Return filtered array:  
  return intrinsics
}

function findingOrnaments(inventoryItemDefinitions) {
  //Create an array of intrinisics:
  const ornaments = Object.entries(inventoryItemDefinitions)
    //Filter out items without plugs:
    .filter(item => item[1].plug)
    //Filter out items that aren't armor ornaments:
    .filter(item => item[1].plug.plugCategoryIdentifier.includes('skins'))

  //Return filtered array:
  return ornaments
}


export async function getStaticItems() {
  //Get the path to fetch:
  const requestPath = await getInventoryItemDefinitionsPath()
  //Check the request status:
  if (!requestPath) {
    return false
  }
  //Store the response:
  const request = await fetch(requestPath)
  //Check the request status:
  if (request.status !== 200) {
    return false
  }
  //Convert to JSON:
  const response = await request.json()
  //Store static armor:
  const staticArmor = findingStaticArmor(response)
  //Store intrinsics:
  const intrinsics = findingIntrinsics(response)
  //Store ornaments:
  const ornaments = findingOrnaments(response)

  //Return an object containing both the static armor array and intrinsics array:
  return { staticArmor: staticArmor, intrinsics: intrinsics, ornaments: ornaments }
}


function getItemInstances(info) {
  //Isolate relevent object path:
  const instances = info.itemComponents.instances.data
  //Create an array of instanced armor. Used to get some information about each armor piece.
  const instancesArray = Object.entries(instances)
    .filter(item => item[1].primaryStat !== undefined)
    .filter(item => item[1].primaryStat.statHash === 3897883278)

  //Create an array of armor instance ids. Used to filter a future array.
  const armorInstanceIds = instancesArray.map(item => item[0])

  //Return both arrays:
  return { instancesArray: instancesArray, armorInstanceIds: armorInstanceIds }
}


function processCharacterItems(itemArray, profileInventory) {
  //For each item in the given array:
  itemArray.forEach(character => {
    character.items
      //Filter out any item without an instance id:
      .filter(item => item.itemInstanceId !== undefined)
      //Push each item into the profileInventory:
      .forEach(item => profileInventory.push(item))
  })
}


function getInstancedArmor(info, armorInstanceIds) {
  //Get the profile inventory:
  const profileInventory = info.profileInventory.data.items.filter(item => item.itemInstanceId !== undefined)
  //Get the characters inventories:
  const characterInventory = Object.values(info.characterInventories.data)
  //Get the items currently equipped on characters:
  const characterEquipment = Object.values(info.characterEquipment.data)
  //Add items in character's inventories or equipped item's to the profile inventory:
  processCharacterItems(characterInventory, profileInventory)
  processCharacterItems(characterEquipment, profileInventory)
  //Create a master array of a user's items:
  const masterArray = profileInventory
    //Filter out anything that isn't an instanced piece of armor:
    .filter(item => armorInstanceIds.includes(item.itemInstanceId))
  //Return the master array:
  return masterArray
}


async function getArmorInformation(destinyId, membershipType, accessToken) {
  //Define request url:
  const requestPath = `${basePlatformURL}Destiny2/${membershipType}/Profile/${destinyId}/?components=102,201,205,300,305`
  //Make the request to the api:
  const request = await fetch(requestPath, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + accessToken
    }
  })
  //Check the request status:
  if (request.status !== 200) {
    return false
  }
  //Convert the response to JSON
  const response = await request.json()
  //Shorten the object path:
  const info = response.Response
  //Get the instances array and armor instance ids:
  const itemInstances = getItemInstances(info)
  const instancesArray = itemInstances.instancesArray
  const armorInstanceIds = itemInstances.armorInstanceIds
  //Get the master array of all instanced armor accross the user's account:
  const masterArray = getInstancedArmor(info, armorInstanceIds)
  //Get all of the instanced armor's sockets:
  const socketsArray = Object.entries(info.itemComponents.sockets.data)
    .filter(item => armorInstanceIds.includes(item[0]))
  //Return the instances array, master array, and sockets array:
  return { instancesArray: instancesArray, masterArray: masterArray, socketsArray: socketsArray }
}


function getArmorEnergyType(item, armorObject) {
  //Shorten the hash path:
  const energyTypeHash = item[1].energy.energyTypeHash
  //Switch on the energy type hash:
  switch (energyTypeHash) {
    //Solar case:
    case 591714140:
      armorObject.energyType = "Solar"
      break;
    //Arc case:
    case 728351493:
      armorObject.energyType = "Arc"
      break;
    //Stasis case:
    case 1819698290:
      armorObject.energyType = "Stasis"
      break;
    //Void case:
    case 4069572561:
      armorObject.energyType = "Void"
      break;
    //Default case:
    default:
      return false
  }
}


function getBasicArmorInfo(item, armorObject) {
  //Define the item's instance id:
  armorObject.itemInstanceId = item[0]
  //Define the item's type
  armorObject.itemType = 'Armor'
  //Define the item as owned (for comparison purposes later)
  armorObject.owned = true
  //Define the item's power level
  armorObject.powerLevel = item[1].primaryStat.value
  //Define the item's current energy capacity
  armorObject.energyCapacity = item[1].energy.energyCapacity
  //Is the item masterworked?
  armorObject.isMasterworked = armorObject.energyCapacity === 10
  //Get the item's energy type:
  getArmorEnergyType(item, armorObject)
  //Define a starter stats object:
  armorObject.baseStats = {
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0
  }
}


function getArmorClassType(currentStatic, armorObject) {
  //Switch on the static definition's class type:
  switch (currentStatic[1].classType) {
    //Titan case:
    case 0:
      armorObject.equippableBy = "Titan"
      break;
    //Hunter case:
    case 1:
      armorObject.equippableBy = "Hunter"
      break;
    //Warlock case:
    case 2:
      armorObject.equippableBy = "Warlock"
      break;
    //Default case:
    default:
      return
  }
}


export function assessHiddenStats(currentStatic, armorObject) {
  //Shorten the object path:
  const statsPath = currentStatic[1].stats.stats
  //If 2996146975 is present:
  if (statsPath[2996146975]) {
    //Add the appropriate amount of mobility:
    armorObject.baseStats.mobility += statsPath[2996146975].value
  }
  //If 392767087 is present:
  if (statsPath[392767087]) {
    //Add the appropriate amount of resilience:
    armorObject.baseStats.resilience += statsPath[392767087].value
  }
  //If 1943323491 is present:
  if (statsPath[1943323491]) {
    //Add the appropriate amount of recovery:
    armorObject.baseStats.recovery += statsPath[1943323491].value
  }
}


export function getAdvancedArmorInfo(currentStatic, armorObject) {
  //Define the item's name:
  armorObject.name = currentStatic[1].displayProperties.name
  //Define the item's subtype:
  armorObject.itemSubType = currentStatic[1].itemTypeDisplayName
  //Define the item's tier:
  armorObject.itemTier = currentStatic[1].inventory.tierTypeName
  //Define the item's icon path:
  armorObject.icon = currentStatic[1].displayProperties.icon
  //Define the item's category hash:
  armorObject.categoryHash = currentStatic[1].itemCategoryHashes[1]
  // Don't ignore the item when evaluating:
  armorObject.ignore = false
  //Define the class type the item belongs to:
  getArmorClassType(currentStatic, armorObject)
  // If the armor piece is owned:
  if (armorObject.owned) {
    //Add any hidden stats to the armor object:
    assessHiddenStats(currentStatic, armorObject)
  }
}


function assessArmorSockets(hash, intrinsics, armorObject, statsArray) {
  //Make sure the hash is defined and enabled:
  if (hash !== undefined && hash.isEnabled) {
    //Find the intrinsic matching the hash:
    const intrinsic = intrinsics.find(item => item[0] === hash.plugHash.toString())
    //If the intrinsic is defined:
    if (intrinsic !== undefined) {
      //Shorten the inventment stats path:
      const investmentStats = intrinsic[1].investmentStats
      //Add to the appropriate stats: 
      armorObject.baseStats[statsArray[0]] += investmentStats[0].value
      armorObject.baseStats[statsArray[1]] += investmentStats[1].value
      armorObject.baseStats[statsArray[2]] += investmentStats[2].value
    }
  }
}


function getBaseArmorStats(currentSockets, intrinsics, armorObject) {
  //Define the intrinsics path:
  const intrinsicsPath = currentSockets[1].sockets
  //Isolate the group that represents Mobility, Resilience, and Recovery:
  const topStatGroup = [intrinsicsPath[6], intrinsicsPath[7]]
  //Isolate the group that represents Discipline, Intellect, and Strength:
  const bottomStatGroup = [intrinsicsPath[8], intrinsicsPath[9]]

  topStatGroup.forEach((hash) => {
    //Assess the item's Mobility, Resilience, and Recovery:
    assessArmorSockets(hash, intrinsics, armorObject, ['mobility', 'recovery', 'resilience'])
  })

  bottomStatGroup.forEach((hash) => {
    //Assess the items's Discipline, Intellect, and Strength:
    assessArmorSockets(hash, intrinsics, armorObject, ['discipline', 'intellect', 'strength'])
  })
}


function assessArmorOrnament(currentSockets, ornaments, armorObject) {
  //Define the intrinsics path:
  const intrinsicsPath = currentSockets[1].sockets
  //Define the ornament hash's path:
  const ornamentHash = intrinsicsPath[10].plugHash
  //If the ornament hash is 702981643 or undefined:
  if (ornamentHash === 702981643 || ornamentHash === undefined) {
    //The item has no ornament equipped:
    armorObject.ornament = false
  }
  else {
    //Find the ornament that matched the ornament hash:
    const ornamentInfo = ornaments.find(ornament => ornament[0] === ornamentHash.toString())
    //Define the item's current ornament:
    armorObject.ornament = ornamentInfo[1].displayProperties.icon
  }
}


export async function getUserArmor(destinyId, membershipType, accessToken) {
  //Get the static items and define them individually:
  const staticItems = await getStaticItems()
  //Check if staticItems returns false:
  if (!staticItems) {
    return false
  }
  const staticArmor = staticItems.staticArmor
  const intrinsics = staticItems.intrinsics
  const ornaments = staticItems.ornaments
  //Get the user armor information and define each array individually
  const armorInformation = await getArmorInformation(destinyId, membershipType, accessToken)
  //Check if armorInformation returns false:
  if (!armorInformation) {
    return false
  }
  const instancesArray = armorInformation.instancesArray
  const masterArray = armorInformation.masterArray
  const socketsArray = armorInformation.socketsArray
  //Create an armor array that will hold each instance of armor:
  const armorArray = []
  //For each item in the instances array:
  instancesArray.forEach(item => {
    //Create an object that will hold all of the info for each armor piece:
    const armorObject = {}
    //Get the basic armor information:
    getBasicArmorInfo(item, armorObject)
    //Find the current instanced armor in the master array:
    const currentArmor = masterArray.find(item => item.itemInstanceId === armorObject.itemInstanceId)
    //If there is no matching armor in the master array return false to move to the next item:
    if (currentArmor === undefined) {
      return false
    }
    //Define the current item's item hash:
    armorObject.itemHash = currentArmor.itemHash
    //Use the item hash to find the static armor that matches the current item:
    const currentStatic = staticArmor.find(item => item[0] === armorObject.itemHash.toString())
    //If there's no static armor that matches the current item hash return false to move to the next item:
    if (currentStatic === undefined) {
      return false
    }
    //Use the matching static item to get advanced armor info:
    getAdvancedArmorInfo(currentStatic, armorObject)
    //Find the instanced items current sockets:
    const currentSockets = socketsArray.find(item => item[0] === armorObject.itemInstanceId)
    //Use the current sockets to get the base armor stats:
    getBaseArmorStats(currentSockets, intrinsics, armorObject)
    //Determine whether or not the current armor has an ornament equipped:
    assessArmorOrnament(currentSockets, ornaments, armorObject)
    //Push the completed armor object to the armor array and move to the next item:
    armorArray.push(armorObject)
  })
  //Return the completed armor array:
  return armorArray
}