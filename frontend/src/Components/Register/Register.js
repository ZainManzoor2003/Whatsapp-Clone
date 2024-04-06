import React, { useEffect, useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { RiLockPasswordFill } from 'react-icons/ri'
import { BsFillTelephoneFill } from 'react-icons/bs'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import Aos from 'aos';
import './Register.css'

export default function Register() {
  useEffect(() => {
    Aos.init({ duration: 500, delay: 0 });
  }, []);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkName, setCheckName] = useState(undefined);
  const [checkNumber, setCheckNumber] = useState(undefined);
  const [checkPassword, setCheckPassword] = useState(undefined);
  const [user, setUser] = useState({
    name: '',
    number: '',
    password: '',
    img: '',
  });
  const handleName = (e) => {
    setUser({ ...user, name: e.target.value })
    if (e.target.value !== '') {
      let lettersAndSpacesRegex = /^[a-zA-Z\s]+$/;
      if (!lettersAndSpacesRegex.test(e.target.value)) {
        setCheckName(true)
      }
      else {
        setCheckName(false)
      }
    }
    else {
      setCheckName(false)
    }
  }
  const handleNumber = (e) => {
    setUser({ ...user, number: e.target.value })
    if (e.target.value !== '') {
      let numericDigitsRegex = /^[0-9]+$/;
      if (!numericDigitsRegex.test(e.target.value)) {
        setCheckNumber(true)
      }
      else {
        setCheckNumber(false)
      }
    }
    else {
      setCheckNumber(false)
    }
  }
  const handlePassword = (e) => {
    setUser({ ...user, password: e.target.value })
    if(e.target.value!==''){
      let passwordRegex = /^[a-zA-Z0-9_]+$/;
      if(!passwordRegex.test(e.target.value)){
        setCheckPassword(true)
      }
      else{
        setCheckPassword(false)
      }
    }
    else{
      setCheckPassword(false)
    }
  }
  const changeToBase64 = (e) => {
    const { name } = e.target;
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setUser({
        ...user,
        [name]: reader.result
      })
    };
    reader.onerror = (error) => {
      console.log('Error', error);
    }
  }
  const Register = (e) => {
    e.preventDefault();
    if (setCheckName || setCheckNumber || setCheckPassword || user.img==='') {
      toast.error('Please Fill the inputs fields', {
        autoClose: 500
      });
    }
    else {
      // setLoading(!loading)
      axios.post(`${window.location.origin}/register`, user)
        .then((res) => {
          if (res.data.mes === 'Account Registered Succesfully') {
            toast.success(res.data.mes, {
              autoClose: 1000
            });
            setTimeout(() => {
              navigate('/');
            }, 1000);
          }
          else {
            toast.error(res.data.mes, {
              autoClose: 1000
            })
          }
        })
      // setLoading(!loading)
    }
  }
  return (
    <>
      <div class="login-page">
        <div class="top-section">
          <div class="top-content">
            <img src="../Images/whatsapp logo.png" alt="" />
            <h3>Whatsapp Web</h3>
          </div>
        </div>
        <div class="bottom-section">
          <form action="submit" data-aos="zoom-in">
            <div class="top-content">
              <img src="../Images/whatsapp logo.png" alt="logo" /><h2>SignUp</h2>
            </div>
            <div className="name">
              <div className="icon"> <BsFillPersonFill /></div>
              <input type="text" name="name" id="" placeholder='Name' onChange={(e) => handleName(e)} maxLength={15}/>
              {checkName && <span style={{ color: 'red' }}>Incorrect Name</span>}
            </div>
            <div className="number">
              <div className="icon"> <BsFillTelephoneFill /></div>
              <input type="text" name="number" id="" placeholder='Number' onChange={(e) => handleNumber(e)} maxLength={11}/>
              {checkNumber && <span style={{ color: 'red' }}>Incorrect Number</span>}
            </div>
            <div className="password">
              <div className="icon"> <RiLockPasswordFill /></div>
              <input type="text" name="password" id="" placeholder='Password' onChange={(e) => handlePassword(e)} maxLength={8}/>
              {checkPassword && <span style={{ color: 'red' }}>Spaces are not allowed</span>}
            </div>
            <div class="input-img"><input type="file" name="img" id="" onChange={(e) => changeToBase64(e)} /></div>
            <button onClick={(e) => Register(e)}>{loading ? 'Signing Up... ' : 'Sign Up'}</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
