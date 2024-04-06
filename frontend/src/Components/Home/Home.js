import React, { useContext, useEffect } from 'react'
import Contact from '../Contact/Contact';
import Message from '../Messages/Message';
import './Home.css'
import CreateContextApi from '../../ContextApi/CreateContextApi';
import Background from '../Background/Background';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Home() {
  const { isClicked, auth, setAuth, currentUser } = useContext(CreateContextApi);
  const {id}=useParams();
  const navigate = useNavigate();
  useEffect(() => {
      id && axios.post(`${window.location.origin}/verifyHome`, { cookie: Cookies.get(`token${id}`) }).then((res) => {
        if (res.data.mes !== 'Success') {
          setAuth(false)
          navigate('/')
        }
        else {
          setAuth(true);
        }
      })
  }, [])
  return (
    <>
      {auth === true ?
        <div className="home">
          <Contact />
          {isClicked === true ? <Message /> : <Background />}
        </div> : <></>
      }
    </>
  )
}
