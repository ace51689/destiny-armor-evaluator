import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const CustomDisplay = ({ item }) => {
  const [display, setDisplay] = useState(false)

  let n = 0

  return (
    <div >
      <div className='loadout-display'>
        Top Loadouts: {item && item.counter}
        &nbsp;
        {
          display ?
            <Button variant='secondary' className='loadout-toggle' onClick={() => setDisplay(!display)}>Hide Loadouts</Button>
            :
            <Button variant='secondary' className='loadout-toggle' onClick={() => setDisplay(!display)}>Show Loadouts</Button>
        }
        <br />
      </div>
      {
        display &&
        <div>
          Loadout(s):
          {item.loadouts && item.loadouts
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
      }
    </div>
  )
}

export default CustomDisplay
