import React from 'react'
import SelectableStatGroup from './SelectableStatGroup'
import ArmorToggleBar from '../components/ArmorToggleBar'
import ArmorItem from './ArmorItem'
// import { Form } from 'react-bootstrap'

const EvaluationInterface = (props) => {
  // const [query, setQuery] = useState("")
  let n = 0

  // const handleSearch = (e) => {
  //   setQuery(e.target.value)
  // }

  return (
    <div>
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
      />
      <SelectableStatGroup handleChange={props.handleChange} evaluateArmor={props.evaluateArmor} evalType={props.evalType} userTier={props.userTier} />
      <div className='no-loadouts-display'>
        {(props.noLoadouts && props.noLoadouts.length > 0) && <div>No Applicable Loadouts for:</div>}
        &nbsp;
        {
          props.noLoadouts && props.noLoadouts.map((exotic) => {
            return <div id='unused-exotic' key={n += 1}>
              {exotic}
            </div>
          })
        }
      </div>
      {/* <Form inline>
        <Form.Label>Filter by Exotic:</Form.Label>
        <Form.Control onChange={handleSearch} value={query} type="text" placeholder="" className="mr-sm-2" />
      </Form> */}

      <ul className='armor-list'>
        {
          props.chosen && props.chosen
            // .filter((choice) => choice[1].name.toLowerCase().includes(query.toLowerCase()))
            .filter((choice) => {
              const showVendor = props.showVendor
              const showKeeps = props.showKeeps
              const showJunks = props.showJunks

              if (choice[1].counter !== undefined) {
                if (showVendor && showKeeps && !showJunks) {
                  return choice[1].counter > 0 || !choice[1].owned
                }
                if (showVendor && !showKeeps && showJunks) {
                  return choice[1].counter === 0 || !choice[1].owned
                }
                if (showVendor && !showKeeps && !showJunks) {
                  return !choice[1].owned
                }
                if (!showVendor && showKeeps && showJunks) {
                  return choice[1].owned
                }
                if (!showVendor && showKeeps && !showJunks) {
                  return choice[1].counter > 0 && choice[1].owned
                }
                if (!showVendor && !showKeeps && showJunks) {
                  return choice[1].counter === 0 && choice[1].owned
                }
                if (!showVendor && !showKeeps && !showJunks) {
                  return false
                }
              }
              else {
                if (!showVendor) {
                  return choice[1].owned
                }
                else {
                  return choice
                }
              }
              return choice
            })
            .map(choice => (
              <ArmorItem
                key={choice[0]}
                item={choice[1]}
                userTier={props.userTier}
                evalType={props.evalType}
              // specific={query}
              />
            ))
        }
      </ul>
    </div>
  )
}

export default EvaluationInterface
