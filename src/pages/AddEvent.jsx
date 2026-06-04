import React from 'react'
import { Container, AddEvent as AddEventComponent } from '../components'

function AddEvent() {
  return (
    <div className='py-8 w-full'>
      <Container>
        <AddEventComponent />
      </Container>
    </div>
  )
}

export default AddEvent