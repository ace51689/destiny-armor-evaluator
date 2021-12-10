import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { GET_ARMOR, GET_INTRINSICS, useStore } from '../store/store'
import { getManifest, getCurrentManifest } from '../endpoints'

const GetManifest = (props) => {
  const dispatch = useStore((state) => state.dispatch)
  const playerClass = useStore((state) => state.playerClass)
  const history = useHistory()

  useEffect(() => {

    const gettingTheManifest = async () => {
      const manifest = await getManifest()
      const current = await getCurrentManifest(manifest.Response.jsonWorldContentPaths.en)

      const armor = Object.entries(current.DestinyInventoryItemDefinition).filter((item) => {
        if (item[1].itemType === 2) {
          return item
        }
        return false
      }).filter((item) => {
        if (playerClass === "Titan" && item[1].classType === 0) {
          return item
        }
        if (playerClass === "Hunter" && item[1].classType === 1) {
          return item
        }
        if (playerClass === "Warlock" && item[1].classType === 2) {
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

      const intrinsics = Object.entries(current.DestinyInventoryItemDefinition).filter((item) => {
        if (item[1].plug) {
          return item
        }
        return false
      }).filter((item) => {
        if (item[1].plug.plugCategoryIdentifier === "intrinsics") {
          return item
        }
        return false
      })

      await dispatch({ type: GET_ARMOR, payload: armor })

      await dispatch({ type: GET_INTRINSICS, payload: intrinsics })

      history.push("/populate")
    }

    gettingTheManifest()

  }, [dispatch, history, playerClass])

  return (
    <div>
      Loading Destiny Manifest...
    </div>
  )
}

export default GetManifest
