import create from "zustand"
import { devtools, redux } from "zustand/middleware"

const initialState = { characterClasses: [], userArmor: [], vendorArmor: [], activeClass: "", error: {} }

export const GET_CHAR_INFO = "GETCHARINFO"
export const GET_ARMOR = "GETARMOR"
export const GET_USER_ARMOR = "GETUSERARMOR"
export const GET_VENDOR_ARMOR = "GETVENDORARMOR"
export const GET_INTRINSICS = "GETINTRINSICS"
export const CHANGE_CLASS = "CHANGECLASS"
export const SET_ERROR = "SETERROR"

const reducer = (state, action) => {
  switch (action.type) {
    case GET_CHAR_INFO:
      return { characterClasses: action.payload }
    case GET_ARMOR:
      return { staticArmor: action.payload }
    case GET_USER_ARMOR:
      return { userArmor: action.payload }
    case GET_VENDOR_ARMOR:
      return { vendorArmor: action.payload }
    case GET_INTRINSICS:
      return { intrinsics: action.payload }
    case CHANGE_CLASS:
      return { activeClass: action.payload }
    case SET_ERROR:
      return { error: action.payload }
    default:
      return state
  }
}

export const useStore = create(devtools(redux(reducer, initialState)))