import React from 'react'
import { BsFillPeopleFill } from 'react-icons/bs'
import { BsFillChatLeftTextFill } from 'react-icons/bs'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { AiOutlineSearch } from 'react-icons/ai'
import { GiNetworkBars } from 'react-icons/gi'
import './Background.css'

export default function Background() {
  return (
    <>
      <div class="background">
        <img src="/Images/messages background.jpg" alt="" />
        <h2>WhatsApp Web</h2>
        <p>Send and receive messages without keeping your phone online. </p>
        <p>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>

      </div>
    </>
  )
}
