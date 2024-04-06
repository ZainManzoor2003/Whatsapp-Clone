import React, { useContext } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { BsCameraFill } from 'react-icons/bs'
import CreateContextApi from '../../ContextApi/CreateContextApi'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MyProfile.css'
import { useNavigate, useParams } from 'react-router'

export default function MyProfile() {
    const a = useContext(CreateContextApi);
    const navigate = useNavigate();
    const { id } = useParams();
    const handleChange = (e) => {
        const { name, value } = e.target;
        a.setCurrentUser({
            ...a.currentUser,
            [name]: value
        });
    }
    const changeToBase64 = (e) => {
        const { name } = e.target;
        if (e.target.files[0].size > 100 * 1024) {
            toast.error('Image size must be less than 100 KB',{
                autoClose:1000
            })
        }
        else {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                a.setCurrentUser({
                    ...a.currentUser,
                    [name]: reader.result
                })
            };
            reader.onerror = (error) => {
                console.log('Error', error);
            }
        }
    }
    const updateProfile = async () => {
        if (a.currentUser.name === '' || a.currentUser.password === '' || a.currentUser.number === '' || a.currentUser.img === '') {
            toast.error('Please fill the input fields', {
                autoClose: 1000
            });
        }
        else {
            axios.post(`https://whatsapp-clone-backend-seven.vercel.app/updateProfile/${id}/reciever`, a.currentUser).then((res) => {
                if (res.data.mes === 'Account Updated Succesfully') {
                    toast.success(res.data.mes, {
                        autoClose: 1000
                    })
                    a.setMyProfileAnimation(temp)
                    navigate('/')
                }
                else {
                    toast.error(res.data.mes, {
                        autoClose: 1000
                    })
                }
            })
        }
    }
    const temp = {
        zIndex: '999',
        position: 'absolute',
        left: '-30vw',
        transition: '.2s linear',
    }
    return (
        <>
            <section class="my-profile">
                <div class="top-profile-heading">
                    <span onClick={() => a.setMyProfileAnimation(temp)}><BiArrowBack /></span>
                    <h2>Profile</h2>
                </div>
                <div class="img-section">
                    <img src={a.currentUser.img} alt="" />
                    <span><label htmlFor="imageUpdate"><BsCameraFill /></label></span>
                    <input type="file" name='img' id='imageUpdate' style={{ display: 'none' }} onChange={(e) => changeToBase64(e)} />
                </div>
                <div class="edit-section">
                    <div className="edit">
                        <h4>Your name</h4>
                        <input type="text" name='name' value={a.currentUser.name} onChange={(e) => handleChange(e)} />
                    </div>
                    <div className="edit">
                        <h4>Your number</h4>
                        <input type="text" name='number' value={a.currentUser.number} onChange={(e) => handleChange(e)} />
                    </div>
                    <div className="edit">
                        <h4>Your password</h4>
                        <input type="text" name='password' value={a.currentUser.password} onChange={(e) => handleChange(e)} />
                    </div>
                    <p>This is not your username or pin. This name will be visible to your WhatsApp contacts.</p>
                    <button onClick={() => updateProfile()}>Edit</button>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}
