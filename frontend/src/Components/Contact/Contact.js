import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsFillPeopleFill } from 'react-icons/bs'
import { BsFillChatLeftTextFill } from 'react-icons/bs'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AiOutlineSearch } from 'react-icons/ai'
import { GiNetworkBars } from 'react-icons/gi'
import './Contact.css'
import { useNavigate, useParams } from 'react-router';
import CreateContextApi from '../../ContextApi/CreateContextApi'
import MyProfile from '../MyProfile/MyProfile'
import { io } from 'socket.io-client'
import Cookies from 'js-cookie'

export default function Contact() {
  const { id, reciever } = useParams();
  const navigate = useNavigate();
  const a = useContext(CreateContextApi);
  const { contacts, tempContacts, settempContacts, socket, temprecieverId, setTempReceverId } = useContext(CreateContextApi);
  useEffect(() => {
    socket.current = io('ws://localhost:9000');
  }, [])
  useEffect(() => {
    socket.current.on('getMessage', (data) => {
      a.setMessages((pre) => ([...pre, data]))
      setTempReceverId(data.sender);
      // a.setTempMessages((pre) => ([...pre, data]))
    })
  }, [])
  useEffect(() => {
    modifyMessages();
  }, [a.newChatClick, a.messages])

  useEffect(() => {
    a.messages.length > 0 && changeLatestMsg();
  }, [a.messages])
  const changeLatestMsg = () => {
    const newState = a.tempContacts.map(contacts => {
      if (temprecieverId ?contacts.reciever===temprecieverId:contacts.reciever === reciever) {
        return {
          ...contacts, latestMsg: a.messages[(a.messages.length - 1)].message, time: a.messages[(a.messages.length - 1)].time,
          type: a.messages[(a.messages.length - 1)].type
        };
      }
      setTempReceverId();
      return contacts;
    })
    a.settempContacts(newState);
  }

  const modifyMessages = () => {
    let temp = a.messages.filter(obj => temprecieverId?(obj.reciever === temprecieverId && obj.sender === id) || (obj.reciever === id && obj.sender === temprecieverId):
    (obj.reciever === reciever && obj.sender === id) || (obj.reciever === id && obj.sender === reciever))
    a.setTempMessages(temp)
  }

  useEffect(() => {
    socket.current.emit('addUser', {
      status: 'Online',
      id: id
    })
    socket.current.on('getUsers', users => {
      a.setActiveUsers(users);
    })
  }, [])
  useEffect(() => {
    if (a.messages.length === 0) {
      getMessages();
    }
  }, [])
  useEffect(() => {
    if (a.contacts.length === 0) {
      getContacts();
    }
  }, [])
  useEffect(() => {
    if (a.currentUser.name === '') {
      getUserDetails();
    }
  }, [])
  const getMessages = async () => {
    let data = await fetch(`${window.location.origin}/getMessages`);
    let res = await data.json();
    a.setMessages(res);
    a.setTempMessages(res);
  }
  const getUserDetails = async () => {
    let data = await fetch(`${window.location.origin}/getUserDetails/${id}/reciever`);
    let res = await data.json();
    a.setCurrentUser({
      name: res.name,
      number: res.number,
      password: res.password,
      img: res.img,
      _id: res._id
    });
  }

  const getContacts = async () => {
    let data = await fetch(`${window.location.origin}/getContacts/${id}/reciever`);
    let res = await data.json();
    a.setContacts(res);
    a.settempContacts(res);
  }
  const searchContacts = (e) => {
    if (e.target.value === '') {
      settempContacts(contacts);
    }
    else {
      settempContacts(contacts.filter((temp) => {
        return temp.name.toLowerCase().includes(e.target.value.toLowerCase());
      }))
    }
  }
  const logout = () => {
    socket.current.emit('disconnected', id);
    socket.current.on('getUsers', users => {
      a.setActiveUsers(users);
    })
    id && Cookies.remove(`token${id}`)
    navigate('/');
  }
  const temp = {
    zIndex: '999',
    position: 'absolute',
    left: '0vw',
    transition: '.2s linear',
  }

  return (
    <>
      <div style={a.myProfileAnimation}><MyProfile /></div>
      <div class="contacts">
        <section class="top-section">
          <img src={a.currentUser.img} alt="" width={'40px'} height={'40px'} onClick={() => a.setMyProfileAnimation(temp)} />
          <div class="icons">
            <div class="icon" id='new-contact' onClick={() => navigate('/addContact/' + id)}>
              <BsFillPeopleFill />
            </div>
            <div class="icon">
              <BsFillChatLeftTextFill />
            </div>
            <div class="icon">
              <BsThreeDotsVertical />
            </div>
          </div>
        </section>
        <section class="middle-section">
          <div class="input">
            <span><AiOutlineSearch /></span>
            <input type="text" placeholder='Search or start a new chat' onChange={(e) => searchContacts(e)} />
          </div>
          <span onClick={() => logout()}><GiNetworkBars /></span>
        </section>
        <section className='all-contacts'>
          {tempContacts.length > 0 ? tempContacts.map((contacts, index) => (
            <div class="contact" onClick={() => {
              a.setIsClicked(true); a.setNewChatClick(!a.newChatClick); a.setCurrentReciever({ img: contacts.img, name: contacts.name, id: contacts.reciever });
              navigate(`/home/${id}/${contacts.reciever}`)
            }}>
              <div class="left-section">
                <img src={contacts.img} alt="img" width={'50px'} height={'50px'} />
              </div>
              <div class="middle-section">
                <h3 style={{ textTransform: 'capitalize' }}>{contacts.name}</h3>
                <p>{contacts.type === 'image' ? 'Image' : contacts.latestMsg.length < 35 ? contacts.latestMsg : contacts.latestMsg.slice(0, 35) + '...'}</p>
                {/* <p>{a.isClicked===true?contacts.reciever==reciever ? a.latestMsg:contacts.latestMsg:contacts.latestMsg}</p> */}
              </div>
              <div class="right-section-time">
                <span>{contacts.time}</span>
              </div>
            </div>
          )) : <h1>No Contacts Found</h1>}
        </section>
      </div>
    </>
  )
}
