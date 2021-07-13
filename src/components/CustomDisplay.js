import React from 'react'

const CustomDisplay = (props) => {
  return (
    <div>
      Total Custom Stat Loadouts: {props.item && props.item.counter}
      <br />
      Unique Stat Combinations: {props.item.uniqueCombos && props.item.uniqueCombos}
      {
        props.evalType > 1 ?
          <div>
            Loadout(s):
            {props.item.pairedItems && props.item.pairedItems.map((piece) => {
              return <div>
                {piece[0]}
                <br />
                {`Mobility: ${piece[1].mobility} - Resilience: ${piece[1].resilience} - Recovery: ${piece[1].recovery} - Discipline: ${piece[1].discipline} - Intellect: ${piece[1].intellect} - Strength: ${piece[1].strength}`}
              </div>
            })}
            <br />
          </div> :
          <div>
            Tier {props.userTier.totalTier}: {props.item.customTier && props.item.customTier.totalTier}
            <br />
            Minimum {props.userTier.mobility} Mobility: {props.item.customTier && props.item.customTier.mobility}
            <br />
            Mimimum {props.userTier.resilience} Resilience: {props.item.customTier && props.item.customTier.resilience}
            <br />
            Minimum {props.userTier.recovery} Recovery: {props.item.customTier && props.item.customTier.recovery}
            <br />
            Minimum {props.userTier.discipline} Discipline: {props.item.customTier && props.item.customTier.discipline}
            <br />
            Minimum {props.userTier.intellect} Intellect: {props.item.customTier && props.item.customTier.intellect}
            <br />
            Mimimum {props.userTier.strength} Strength: {props.item.customTier && props.item.customTier.strength}
            <br />
          </div>
      }
    </div>
  )
}

export default CustomDisplay
