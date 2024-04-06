import React, { useContext, useEffect, useState } from 'react'
import { BsTelephoneFill, BsThreeDotsVertical } from 'react-icons/bs'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaPhoneAlt } from "react-icons/fa";
import { BsEmojiSmile } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdKeyboardVoice } from 'react-icons/md'
import { BiSolidSend } from 'react-icons/bi'
import EmojiPicker from 'emoji-picker-react';

import CreateContextApi from '../../ContextApi/CreateContextApi'
import './Message.css'
import axios from 'axios'
import { useParams } from 'react-router'

export default function Message() {
  const { id, reciever } = useParams();
  const [status, setStatus] = useState();
  const [message, setMessage] = useState({
    message: '',
    type: 'text'
  });
  const [emojiClick, setEmojiClick] = useState(false);
  const a = useContext(CreateContextApi);
  const { socket,temprecieverId,setTempReceverId } = useContext(CreateContextApi);
  useEffect(() => {
    if (message.message.length === 1) {
      socket.current.emit('changeStatusToTyping', id)
    }
    if (message.message.length === 0) {
      socket.current.emit('changeStatusToOnline', id)
    }
  }, [message])
  useEffect(() => {
    socket.current.on('getUsers', users => {
      a.setActiveUsers(users);
    })
  }, [])
 

  useEffect(() => {
    const user = a.activeUsers?.find(user => user.id === a.currentreciever.id);
    if (user) {
      setStatus(user.status)
    }
    else {
      setStatus('Offline');
    }
  },[a.currentreciever, a.activeUsers])
  // const changeLatestMsg = () => {
  //   const newState = a.tempContacts.map(contacts => {
  //     if (temprecieverId ?contacts.reciever===temprecieverId:contacts.reciever === reciever) {
  //       return {
  //         ...contacts, latestMsg: a.messages[(a.messages.length - 1)].message, time: a.messages[(a.messages.length - 1)].time,
  //         type: a.messages[(a.messages.length - 1)].type
  //       };
  //     }
  //     setTempReceverId();
  //     return contacts;
  //   })
  //   a.settempContacts(newState);
  // }
  const keyPressed = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }
  const sendMessage = () => {
    let tempTime = new Date();
    tempTime = tempTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const messageObj = { sender: id, reciever: reciever, message: message.message, type: message.type, time: tempTime };
    a.setMessages([...a.messages, messageObj])
    a.setTempMessages([...a.tempMessages, messageObj])
    socket.current.emit('sendMessage', messageObj);
    axios.post(`${window.location.origin}/sendMessage/${id}/${reciever}`, messageObj)
      .then((res) => {
        if (res.data.mes === 'Success') {
          setMessage({ message: '', type: 'text' });
        }
      })
  }
  const emojiPick = (e) => {
    setMessage(message + e.emoji)
  }
  const changeToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setMessage({
        message: reader.result,
        type: 'image'
      })
    };
    reader.onerror = (error) => {
      console.log('Error', error);
    }
  }
  return (
    <>
      <section className="messages">
        {/* <div className='emoji-picker' style={emojiClick===true?{display:'block'}:{display:'none'}}>
              <EmojiPicker onEmojiClick={(e)=>emojiPick(e)} />
            </div> */}
        <div className="top-section">
          <div className="img">
            <img src={a.currentreciever.img} alt="" width={'40px'} height={'40px'} style={{ objectFit: 'cover' }} />
          </div>
          <div className="top-heading">
            <h1 style={{ textTransform: 'capitalize' }}>{a.currentreciever.name}</h1>
            {/* <span>click here for contact info</span> */}
            <span>{status}</span>
          </div>
          <div className="icons">
            <div className="icon">
              <FaPhoneAlt />
            </div>
            <div className="icon">
              <BsThreeDotsVertical />
            </div>
          </div>
        </div>
        <div class="all-messages">
          {a.tempMessages.map((data, index) => (
            <div className={data.sender == id ? "message-jus" : 'message'}>
              {data.type == 'text' ?
                <><p className={data.sender == id ? 'send-message' : 'recieve-message'}>{data.message} <span>{data.time}</span></p></>
                : <div className='image'><img src={data.message} alt="" width={'100%'} height={'250px'} style={{ objectFit: 'cover', borderRadius: '5px' }} />
                  <span className='image-message-time'>{data.time}</span></div>
              }
            </div>
          ))}
        </div>
        <div className="bottom-section">
          <label htmlFor="add-file" className='plus-icon'>
            <AiOutlinePlus />
          </label>
          <input type="file" id='add-file' style={{ display: 'none' }} onChange={(e) => changeToBase64(e)} />
          <div className="message-input">
            <input type="text" placeholder='Type a message' value={message.message} onKeyUp={(e) => keyPressed(e)} onChange={(e) => setMessage({ message: e.target.value, type: 'text' })} />
            <span onClick={() => setEmojiClick(!emojiClick)}><BsEmojiSmile /></span>
          </div>
          {message.message.length > 0 ?
            <div className="send-icon">
              <span onClick={() => sendMessage()}><BiSolidSend /></span>
            </div> :
            <div className="voice-icon">
              <span><MdKeyboardVoice /></span>
            </div>
          }
        </div>
      </section>
    </>
  )
}
