import React, { useState } from 'react';
import { ThingsProvider } from './thingsContext';
import ListDisplay from './ListDisplay';

const InfoContainer = props => {
  // pretend we are fetching these 'things'
  const things = [
    { id: 1, name: 'thing 1', length: 5 },
    { id: 2, name: 'thing 2', length: 2 },
    { id: 3, name: 'thing 3', length: 6 },
    { id: 4, name: 'thing 4', length: 10 },
    { id: 5, name: 'thing 5', length: 1 }
  ]

  const [localThings, setLocalThings] = useState(things);

  setInterval(() => {
    const t = [...things];
    t[3].name = Math.random();
    setLocalThings(t)
  }, 1000)
  return (
    <div>
      <ThingsProvider value={localThings}>
        <ListDisplay></ListDisplay>
      </ThingsProvider>
    </div>
  )
}
export default InfoContainer