import React, { useState, useEffect } from 'react'
// import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import './Login.css'
import Spinner from '../../Spinner/Spinner'
import axios from 'axios'

const Login = () => {

    const navigate = useNavigate()
    const [email, SetEmail] = useState('');
    const [password, SetPassword] = useState('');
    const [error, setError] = useState('');
    const [spinner, setSpinner] = useState(false);
    axios.defaults.withCredentials = true
    const token = localStorage.getItem('admintoken');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const authUser = await axios.get('http://localhost:4444/admin/home');
                console.log(authUser, 'authuser./././././././');
                if (authUser.data.success) {
                    navigate('/admin/dashboard')
                } else {
                    navigate('/admin')
                    console.log('error');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const handelSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4444/admin/login', {
                email,
                password
            })
            console.log(response)
            if (response.data.success) {
                localStorage.setItem('admintoken', response.data.token);
                navigate('/admin/dashboard')
                console.log('data recived')
            } else {
                console.log('error ')
                setError(response.data.message);
            }
        } catch (error) {
            console.log('error in axios api call')
        }

    }

    return (
        <>
            {spinner
                ?
                <Spinner />
                :
                <div className='loginadminForm'>
                    <h2>Admin Login</h2>
                    <label htmlFor="" >Email Address</label>
                    <br />
                    <input type="email" placeholder='Enter the Email address' value={email} onChange={(e) => SetEmail(e.target.value)} />
                    <br />
                    <label htmlFor="">Password</label>
                    <br />
                    <input type="password" placeholder='Enter the Password' value={password} onChange={(e) => SetPassword(e.target.value)} />
                    <br />
                    {error && <span>{error}</span>}
                    <br />
                    <button onClick={handelSubmit}>Login</button>
                    <br />

                </div>
            }


        </>

    )
}

export default Login
