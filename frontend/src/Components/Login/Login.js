import React, { useContext, useEffect, useState } from 'react'
import { RiLockPasswordFill } from 'react-icons/ri'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { useNavigate } from 'react-router'
import './Login.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Aos from 'aos'
import CreateContextApi from '../../ContextApi/CreateContextApi'
import Cookies from 'js-cookie'

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const a = useContext(CreateContextApi)
  const [user, setUser] = useState({
    number: '',
    password: ''
  })
  useEffect(() => {
    Aos.init({ duration: 500, delay: 0 });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  }
  const login = (e) => {
    e.preventDefault();
    if (user.number === '' || user.password === '') {
      toast.error('Please Fill the inputs fields', {
        autoClose: 1000
      })
    }
    else {
      // setLoading(!loading)
      axios.post(`https://whatsapp-clone-backend-seven.vercel.app/login`, user).then((res) => {
        // setLoading(!loading)
        if (res.data.mes === 'Login Successfull') {
          toast.success(res.data.mes, {
            autoClose: 1000
          })
          a.setCurrentUser(res.data.user)
          var date = new Date();
          date.setTime(date.getTime() + (30 * 1000));
          Cookies.set(`token${res.data.user._id}`, res.data.token,{expires:1})
          setTimeout(() => {
            navigate('/home/' + res.data.user._id + '/reciever');
          }, 1000);
        }
        else {
          toast.error(res.data.mes, {
            autoClose: 1000
          })
        }
      })
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
              <img src="../Images/whatsapp logo.png" alt="logo" /><h2>Login</h2>
            </div>
            <div className="number">
              <div className="icon"> <BsFillTelephoneFill /></div>
              <input type="text" name="number" id="" placeholder='Phone' onChange={(e) => handleChange(e)} />
            </div>
            <div className="password">
              <div className="icon"> <RiLockPasswordFill /></div>
              <input type="text" name="password" id="" placeholder='Password' onChange={(e) => handleChange(e)} />
            </div>
            <button disabled={loading} onClick={(e) => login(e)}>{loading ? 'Logging In...' : 'Log In'}</button>
            <p>Don't have an account <span onClick={() => navigate('/register')}>register</span></p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
