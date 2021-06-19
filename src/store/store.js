import create from "zustand"
import { devtools, redux } from "zustand/middleware"

const initialState = { authCode: "", authToken: "", memberId: "", destinyId: "", memberType: "", staticArmor: [], userArmor: []}

export const GET_ARMOR = "GETARMOR"
export const GET_AUTH_CODE = "GETAUTHCODE"
export const GET_AUTH_TOKEN = "GETAUTHTOKEN"
export const GET_MEMBER_ID = "GETMEMBERID"
export const GET_DESTINY_ID = "GETDESTINYID"
export const GET_MEMBER_TYPE = "GETMEMBERTYPE"
export const GET_USER_ARMOR = "GETUSERARMOR"

const reducer = (state, action) => {
  switch(action.type) {
    case GET_ARMOR: 
      return { staticArmor: action.payload}
    case GET_AUTH_CODE:
      return { authCode: action.payload}
    case GET_AUTH_TOKEN:
      return { authToken: action.payload}
    case GET_MEMBER_ID:
      return { memberId: action.payload }
    case GET_DESTINY_ID:
      return { destinyId: action.payload }
    case GET_MEMBER_TYPE:
      return { memberType: action.payload }
    case GET_USER_ARMOR:
      return { userArmor: action.payload }
    default:
      return state
  }
}

export const useStore = create(devtools(redux(reducer, initialState)))