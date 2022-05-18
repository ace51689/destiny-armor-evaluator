import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const CustomDisplay = (props) => {
  const [display, setDisplay] = useState(false)

  let n = 0

  return (
    <div >
      <div className='loadout-display'>
        Top Loadouts: {props.item && props.item.counter}
        &nbsp;
        {
          display ?
            <Button variant='secondary' className='loadout-toggle' onClick={() => setDisplay(!display)}>Hide Loadouts</Button>
            :
            <Button variant='secondary' className='loadout-toggle' onClick={() => setDisplay(!display)}>Show Loadouts</Button>
        }
        <br />
      </div>
      {/* Unique Stat Combinations: {props.item.uniqueCombos && props.item.uniqueCombos} */}
      {
        props.evalType > 1 ?
          display &&
          <div>
            Loadout(s):
            {props.item.loadouts && props.item.loadouts
              // .filter((piece) => {
              //   if (piece[0].toLowerCase().includes(props.specific.toLowerCase())) {
              //     return piece
              //   }
              //   return false
              // })
              .map((piece) => {
                return <div className="loadout" key={n += 1}>
                  {`${piece.loadout}`}
                  <br />
                  {`Mobility: ${piece.stats.mobility} - Resilience: ${piece.stats.resilience} - Recovery: ${piece.stats.recovery} - Discipline: ${piece.stats.discipline} - Intellect: ${piece.stats.intellect} - Strength: ${piece.stats.strength}`}
                </div>
              })
            }

            <br />

          </div>

          :
          <div>
            Tier {props.userTier.totalTier}: {props.item.counter && props.item.counter}
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
