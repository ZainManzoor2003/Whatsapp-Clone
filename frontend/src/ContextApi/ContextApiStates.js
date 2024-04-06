import CreateContextApi from "./CreateContextApi";
import React, { useRef, useState } from 'react'

export default function ContextApiStates(props) {
  const socket = useRef();
  const [auth, setAuth] = useState(undefined);
  const [isClicked, setIsClicked] = useState(false);
  const [newChatClick, setNewChatClick] = useState(false);
  const [clickedUser, setClickedUser] = useState(false);
  const [messages, setMessages] = useState([])
  const [tempMessages, setTempMessages] = useState([])
  const [activeUsers, setActiveUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tempContacts, settempContacts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tempAllUsers, settempAllUsers] = useState([]);
  const [temprecieverId,setTempReceverId]=useState();
  const [currentUser, setCurrentUser] = useState({
    name: '',
    number: '',
    password: '',
    img: '',
    _id: ''
  })
  const [currentreciever, setCurrentReciever] = useState({
    img: '',
    name: '',
    id: ''
  })
  const [myProfileAnimation, setMyProfileAnimation] = useState({
    zIndex: '999',
    position: 'absolute',
    left: '-30vw',
    transition: '.2s linear',
  })

  return (
    <>
      <CreateContextApi.Provider value={{
        auth,setAuth,isClicked, setIsClicked,newChatClick, setNewChatClick, myProfileAnimation, setMyProfileAnimation
        , clickedUser, setClickedUser, currentreciever, setCurrentReciever, currentUser, setCurrentUser
        , messages, setMessages, activeUsers, setActiveUsers, contacts, setContacts, tempContacts, settempContacts,
        socket, allUsers, setAllUsers, tempAllUsers, settempAllUsers,tempMessages,setTempMessages,temprecieverId,setTempReceverId
      }}>
        {props.children}
      </CreateContextApi.Provider>
    </>
  )
}
