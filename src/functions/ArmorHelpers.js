const apiKey = process.env.REACT_APP_API_KEY
// const clientId = process.env.REACT_APP_CLIENT_ID
const baseURL = "https://www.bungie.net/"
const basePlatformURL = "https://www.bungie.net/Platform/"


async function getInventoryItemDefinitionsPath() {
  //Fetch the Destiny manifest:
  const request = await fetch(`${basePlatformURL}Destiny2/Manifest`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  })
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
    .filter((item) => item[1].plug)
    //Filter out items that aren't intrinisics OR armor ornaments:
    .filter(item => item[1].plug.plugCategoryIdentifier === "intrinsics")

  //Return filtered array:  
  return intrinsics
}

function findingOrnaments(inventoryItemDefinitions) {
  //Create an array of intrinisics:
  const ornaments = Object.entries(inventoryItemDefinitions)
    //Filter out items without plugs:
    .filter((item) => item[1].plug)
    //Filter out items that aren't armor ornaments:
    .filter(item => item[1].plug.plugCategoryIdentifier.includes('skins'))

  //Return filtered array:
  return ornaments
}


export async function getStaticArmor() {
  //Get the path to fetch:
  const requestPath = await getInventoryItemDefinitionsPath()
  //Store the response:
  const request = await fetch(requestPath)
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


export async function getProfile(destinyMemberId, memberType, token) {

  try {
    for (let n = 0; n < 3; n++) {
      const res = await fetch(basePlatformURL + "Destiny2/" + memberType + "/Profile/" + destinyMemberId + "/?components=100,102,200,201,205,300,304,305,310", {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          Authorization: "Bearer " + token
        },
      })

      const data = await res.json()

      if (data.ErrorCode === 1) {
        n = 3
        return data
      }

    }
  }
  catch (TypeError) {
    return false
  }
}