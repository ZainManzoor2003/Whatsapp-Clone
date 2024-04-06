import React, { useContext, useEffect, useState } from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Aos from 'aos'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import './AddContact.css'
import CreateContextApi from '../../ContextApi/CreateContextApi'
import Cookies from 'js-cookie';

export default function AddContact() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const { allUsers, setAllUsers, tempAllUsers, settempAllUsers,
        contacts, setContacts, settempContacts, tempContacts, auth, setAuth } = useContext(CreateContextApi);
    useEffect(() => {
        id && axios.post(`${window.location.origin}/verifyAddContacts`, { cookie: Cookies.get(`token${id}`) }).then((res) => {
            if (res.data.mes !== 'Success') {
                setAuth(false)
                navigate('/')
            }
            else {
                setAuth(true)
            }
        })
    }, [])
    useEffect(() => {
        Aos.init({ duration: 500, delay: 0 });
    }, []);
    useEffect(() => {
        if (allUsers.length === 0) {
            getAllUsers()
        }
    }, [])

    // const getContacts = async () => {
    //     let data = await fetch(`http://localhost:3001/getContacts/${id}/reciever`);
    //     let res = await data.json();
    //     setContacts(res);
    //     settempContacts(res);
    // }
    const getAllUsers = async () => {
        let data = await fetch(`${window.location.origin}/getAllUsers`);
        let res = await data.json();
        removeCurrentUser(res)
    }
    const removeCurrentUser = (res) => {
        let remove = res.filter(obj => obj._id !== id)
        for (let index = 0; index < contacts.length; index++) {
            remove = remove.filter(obj => obj.number !== contacts[index].number)
        }
        setAllUsers(remove);
        settempAllUsers(remove);
    }
    const removeAddedUser = (user) => {
        console.log('rmeoved user is :', user.name);
        let temp = tempAllUsers.filter(obj => obj._id !== user._id)
        settempAllUsers(temp)
        setAllUsers(temp)
    }
    const addUserToContact = (user) => {
        setContacts([...contacts, user])
        settempContacts([...tempContacts, user])
    }
    const addContact = async (user) => {
        axios.post(`${window.location.origin}/addContact/${id}`, user)
            .then((res) => {
                if (res.data.mes === 'Contact Added Successfully') {
                    removeAddedUser(user);
                    addUserToContact(res.data.latestMessage);
                    toast.success(res.data.mes, {
                        autoClose: 1000
                    })
                }
                else {
                    toast.error(res.data.mes, {
                        autoClose: 1000
                    })
                }
            })

    }
    return (
        auth === true ?
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
                                <img src="../Images/whatsapp logo.png" alt="logo" /><h2>Add Contact</h2>
                            </div>
                            <div className='add-contacts-allcontacts'>
                                {tempAllUsers.length > 0 ?
                                    tempAllUsers.map((user) => (
                                        <div className="add-contacts-contact" onClick={() => addContact(user)}>
                                            <div class="left-section">
                                                <img src={user.img} alt="" />
                                            </div>
                                            <div class="right-section">
                                                <h3>{user.name}</h3>
                                            </div>
                                        </div>
                                    ))
                                    : <></>}
                            </div>
                            {/* <button disabled={loading} onClick={(e) => addContact(e)}>{loading ? 'Adding Contact' : 'Add Contact'}</button> */}
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </>
            : <></>
    )
}
