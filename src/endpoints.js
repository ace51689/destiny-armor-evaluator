const apiKey = process.env.REACT_APP_API_KEY
const clientId = process.env.REACT_APP_CLIENT_ID
const baseURL = "https://www.bungie.net/"
const basePlatformURL = "https://www.bungie.net/Platform/"

export async function getManifest() {
  return await fetch(basePlatformURL + "Destiny2/Manifest", {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    },
  }).then((res) => res.json())
}

export async function getDestinyInventoryItemDefinitions() {
  const response = await fetch(`${basePlatformURL}Destiny2/Manifest`, {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    }
  })

  const manifest = await response.json()
  const inventoryItemDefinitionsPath = manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition

  return baseURL + inventoryItemDefinitionsPath
}


function findingStaticArmor(inventoryItemDefinitions) {
  const staticArmor = Object.entries(inventoryItemDefinitions).filter((item) => {
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


function findingIntrinsics(inventoryItemDefinitions) {
  const intrinsics = Object.entries(inventoryItemDefinitions).filter((item) => {
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

export async function getStaticArmor() {
  const inventoryItemDefinitionsPath = await getDestinyInventoryItemDefinitions()
  const response = await fetch(inventoryItemDefinitionsPath)
  const inventoryItemDefinitions = await response.json()
  const staticArmor = findingStaticArmor(inventoryItemDefinitions)
  const intrinsics = findingIntrinsics(inventoryItemDefinitions)
  
  console.log({ staticArmor: staticArmor, intrinsics: intrinsics })

  return {staticArmor: staticArmor, intrinsics: intrinsics}
}

export async function getCurrentManifest(currentManifest) {
  return await fetch(baseURL + currentManifest, {
    method: "GET",
  }).then((res) => res.json())
}

export async function getAuthToken(code) {
  return await fetch(basePlatformURL + "app/oauth/token/", {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${clientId}&grant_type=authorization_code&code=${code}`
  }).then((res) => res.json())
}

export async function getLinkedProfiles(membershipId) {
  return await fetch(basePlatformURL + "Destiny2/-1/Profile/" + membershipId + "/LinkedProfiles/?getAllMemberships=true", {
    method: "GET",
    headers: {
      "x-api-key": apiKey
    },
  }).then((res) => res.json())
}

export async function getProfile(destinyMemberId, memberType, token) {
  
  try {
    for (let n = 0; n < 3; n ++) {
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


export async function getVendors(memberType, destinyMemberId, characterId, token) {
  try {
    for (let n = 0; n < 3; n ++) {
      const res = await fetch(basePlatformURL + "Destiny2/" + memberType + "/Profile/" + destinyMemberId + "/Character/" + characterId + "/Vendors/?components=402,304", {
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


export async function getItem(destinyMemberId, memberType, itemInstanceId) {
  let flag = true
  while (flag) {
    const res = await fetch(basePlatformURL + "Destiny2/" + memberType + "/Profile/" + destinyMemberId + "/Item/" + itemInstanceId + "/?components=304,305", {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    })

    const data = await res.json()

    if (data.ErrorCode === 1) {
      flag = false
      return data
    }
  }
}
