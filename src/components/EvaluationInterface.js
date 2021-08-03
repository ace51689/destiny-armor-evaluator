import React from 'react'
import SelectableStatGroup from './SelectableStatGroup'
import ArmorToggleBar from '../components/ArmorToggleBar'
import EvaluationOptions from './EvaluationOptions'
import ArmorItem from './ArmorItem'

const EvaluationInterface = (props) => {
  return (
    <div>
      <ArmorToggleBar exotic={props.exotic} toggleExotic={props.toggleExotic} armorType={props.armorType} changeArmor={props.changeArmor}/>
      <EvaluationOptions evalType={props.evalType} handleEvalType={props.handleEvalType} exotic={props.exotic}/>
      <SelectableStatGroup handleChange={props.handleChange} evaluateArmor={props.evaluateArmor} evalType={props.evalType} userTier={props.userTier} />
      {
        props.chosen && props.chosen.map((choice) => (
          <ArmorItem 
          key={choice[0]}
          item={choice[1]}
          userTier={props.userTier}
          evalType={props.evalType}
          />
        ))
      }
    </div>
  )
}

export default EvaluationInterface
