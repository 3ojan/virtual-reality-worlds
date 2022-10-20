import React, { useContext } from 'react'
import ThingsContext from './thingsContext'
const ListDisplay = props => {

  const things = useContext(ThingsContext)

  const renderThings = things => {
    return things.map(thing => {
      return <div className="here" key={thing.id}>{thing.name}</div>
    })
  }
  return (
    <ul>
      {renderThings(things)}
    </ul>
  )
}
export default ListDisplay