import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Spinner from '../../Spinner/Spinner';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [spinner, setSpinner] = useState(false);
    const dispatch = useDispatch();

    axios.defaults.withCredentials = true;

    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authUser = await axios.get('http://localhost:4444/user/home');
                if (authUser.data.success) {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSpinner(true);
        try {
            const response = await axios.post('http://localhost:4444/user/login', { email, password });
            setSpinner(false);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                dispatch({
                    type: 'login',
                    payload: response.data.data
                });
                navigate('/');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setSpinner(false);
            setError('Error logging in. Please try again.');
            console.error('Error logging in:', error);
        }
    };

    const register = () => {
        navigate('/register');
    };

    return (
        <>
            {spinner ? (
                <Spinner />
            ) : (
                <div className="loginForm">
                    <h2>User Login</h2>
                    <label htmlFor="email">Email Address</label>
                    <br />
                    <input
                        type="email"
                        placeholder="Enter the Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        type="password"
                        placeholder="Enter the Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    {error && <span>{error}</span>}
                    <br />
                    <button onClick={handleSubmit}>Login</button>
                    <br />
                    <p onClick={register}>Don't have an account? Create One.</p>
                </div>
            )}
        </>
    );
};

export default Login;
