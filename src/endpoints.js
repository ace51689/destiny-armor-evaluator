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

export async function getCurrentManifest(currentManifest) {
  return await fetch(baseURL + currentManifest, {
    method: "GET",
  }).then((res) => res.json())
}

export async function getAuthToken(code) {
  return await fetch(basePlatformURL + "app/oauth/token/", {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_id=${clientId}&grant_type=authorization_code&${code}`
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
  let flag = true
  while (flag) {
    const res = await fetch(basePlatformURL + "Destiny2/" + memberType + "/Profile/" + destinyMemberId + "/?components=100,102,200,201,205,300,304,305,310", {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        Authorization: "Bearer " + token
      },
    })

    const data = await res.json()
    // console.log(data)

    if (data.ErrorCode === 1) {
      flag = false
      return data
    }
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
      // console.log(data.ErrorCode)
      flag = false
      return data
    }
  }
}

export async function getVendors(memberType, destinyMemberId, characterId, token) {
  return await fetch(basePlatformURL + "Destiny2/" + memberType + "/Profile/" + destinyMemberId + "/Character/" + characterId + "/Vendors/?components=402,304", {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Authorization: "Bearer " + token
    },
  }).then((res) => res.json())
}