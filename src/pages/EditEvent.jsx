import React, {useEffect, useState} from 'react'
import {Container, AddEvent} from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate,  useParams } from 'react-router-dom';

function EditEvent() {
    const [event, setEvent] = useState(null)
    const {eventId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        console.log(eventId);
        if (eventId) {
            appwriteService.getEvent(eventId).then((event) => {
                if (event) {
                    setEvent(event)
                }
                
                
            })
        } else {
            navigate('/')
        }
    }, [eventId, navigate])
    
  return event ? (
    <div className='py-8 w-full'>
        <Container>
            <AddEvent event={event} />
        </Container>
    </div>
  ) : null
}

export default EditEvent