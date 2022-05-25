import create from "zustand"
import { persist, devtools, redux } from "zustand/middleware"

const state = {
  accessInformation: {},
  profileInformation: {},
  characterInformation: {},
  userArmor: [],
  vendorArmor: [],
  helpers: {
    error: {
      type: "none",
      message: ""
    },
    isLoggedIn: false,
    isDemo: false
  }
}

export const actions = {
  setAccessInformation: "setAccessInformation",
  setProfileInformation: "setProfileInformation",
  setCharacterInformation: "setCharacterInformation",
  setUserArmor: "setUserArmor",
  setVendorArmor: "setVendorArmor",
  setError: "setError",
  setIsLoggedIn: "setIsLoggedIn",
  setIsDemo: "setIsDemo",
  resetState: "resetState"
}

const reducer = (state, action) => {
  switch (action.type) {
    case actions.setAccessInformation:
      return { accessInformation: action.payload }
    case actions.setProfileInformation:
      return { profileInformation: action.payload }
    case actions.setCharacterInformation:
      return { characterInformation: action.payload }
    case actions.setUserArmor:
      return { userArmor: action.payload }
    case actions.setVendorArmor:
      return { vendorArmor: action.payload }
    case actions.setError:
      return { helpers: { ...state.helpers, error: action.payload } }
    case actions.setIsLoggedIn:
      return { helpers: { ...state.helpers, isLoggedIn: action.payload } }
    case actions.setIsDemo:
      return { helpers: { ...state.helpers, isDemo: action.payload}}
    case actions.resetState:
      return {
        accessInformation: {},
        profileInformation: {},
        characterInformation: {},
        userArmor: [],
        vendorArmor: [],
        helpers: {
          ...state.helpers,
          isLoggedIn: false,
          isDemo: false
        }
      }
    default:
      return state
  }
}


export const useStore = create(persist(devtools(redux(reducer, state))))