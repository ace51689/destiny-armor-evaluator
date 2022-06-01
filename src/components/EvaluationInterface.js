import React from 'react'
import { useStore } from '../store/store'
import SelectableStatGroup from './SelectableStatGroup'
import ArmorToggleBar from '../components/ArmorToggleBar'
import ArmorItem from './ArmorItem'
import ExoticItem from './ExoticItem'

const EvaluationInterface = (props) => {
  const error = useStore(state => state.helpers.error)
  const key = (choice) => {
    if (choice.itemInstanceId !== undefined) {
      return choice.itemInstanceId
    }
    else {
      return choice.itemHash
    }
  }

  const filteredArmor = props.chosen && props.chosen.filter(choice => {
    const showVendor = props.showVendor
    const showKeeps = props.showKeeps
    const showJunks = props.showJunks

    if (choice.counter !== undefined) {
      if (showVendor && showKeeps && !showJunks) {
        return choice.counter > 0 || !choice.owned
      }
      if (showVendor && !showKeeps && showJunks) {
        return choice.counter === 0 || !choice.owned
      }
      if (showVendor && !showKeeps && !showJunks) {
        return !choice.owned
      }
      if (!showVendor && showKeeps && showJunks) {
        return choice.owned
      }
      if (!showVendor && showKeeps && !showJunks) {
        return choice.counter > 0 && choice.owned
      }
      if (!showVendor && !showKeeps && showJunks) {
        return choice.counter === 0 && choice.owned
      }
      if (!showVendor && !showKeeps && !showJunks) {
        return false
      }
    }
    else {
      if (!showVendor) {
        return choice.owned
      }
      else {
        return choice
      }
    }
    return choice
  })

  const noArmor = filteredArmor.length === 0

  const noExotic = props.exotic && !props.chosen

  return (
    <div>
      {
        error.type === "error" && <div style={{ color: "red" }}>{error.message}</div>
      }
      <ArmorToggleBar
        exotic={props.exotic}
        toggleExotic={props.toggleExotic}
        showVendor={props.showVendor}
        toggleVendor={props.toggleVendor}
        armorType={props.armorType}
        changeArmor={props.changeArmor}
        evaluateArmor={props.evaluateArmor}
        showKeeps={props.showKeeps}
        toggleKeeps={props.toggleKeeps}
        showJunks={props.showJunks}
        toggleJunks={props.toggleJunks}
        hasExoticDupes={props.hasExoticDupes}
      />
      <SelectableStatGroup handleChange={props.handleChange} evaluateArmor={props.evaluateArmor} evalType={props.evalType} userInput={props.userInput} setUserInput={props.setUserInput} />
      <div className='no-loadouts-display'>
        {(props.noLoadouts && props.noLoadouts.length > 0) && <div>No Applicable Loadouts for:</div>}
        &nbsp;
        {
          props.noLoadouts && props.noLoadouts.map((exotic) => {
            return <div id='unused-exotic' key={exotic.itemInstanceId}>
              {exotic}
            </div>
          })
        }
      </div>
      {/* <Form inline>
        <Form.Label>Filter by Exotic:</Form.Label>
        <Form.Control onChange={handleSearch} value={query} type="text" placeholder="" className="mr-sm-2" />
      </Form> */}
      <div>
        {
          noArmor || noExotic ?
            <div>No armor pieces matched your filter criteria. Change your filter parameters and try again.</div>
            :
            <ul className='armor-list'>
              {
                props.chosen && filteredArmor
                  .map(choice => {
                    if (choice.length > 1) {
                      return <ExoticItem
                        key={choice[0].itemHash}
                        item={choice}
                        userTier={props.userTier}
                        evalType={props.evalType}
                      />
                    }
                    else {
                      return <ArmorItem
                        key={key(choice)}
                        item={choice}
                        userTier={props.userTier}
                        evalType={props.evalType}
                      // specific={query}
                      />
                    }
                  })
              }
            </ul>
        }
      </div>
    </div>
  )
}

export default EvaluationInterface
