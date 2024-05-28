import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [refresh,setRefresh] = useState(false)

    const user = useSelector((state) => state.user);
    const isAuth = useSelector((state) => state.isAuthenticated);

    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(isAuth,'isAuth--------isAuth')
                const authUser = await axios.get('http://localhost:4444/user/home');
                if (!authUser.data.success ) {
                    navigate('/login');
                } else {
                   
                    dispatch({
                        type:'login',
                        payload:authUser.data.data
                    })
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const logout = async () => {
        localStorage.setItem('token', '');
        dispatch({
            type: 'logout'
        });
        setRefresh(!false)
        // navigate('/login');
        window.location.href = '/login'
    };

    const editUser = () => {
        navigate('/editUser');
    };

    if (isLoading) {
        return <div></div>;
    }

    if (!user) {
        return <div></div>;
    }

    return (
        <div className="parentDiv">
            <img src={user.image || user.imagePath} alt="profile" className="profile" />
            <div className="userInfo">
                <h2>{user.name}</h2>
                <h4>{user.email}</h4>
                <h4>{user.mobile}</h4>
                <button onClick={logout} className="logoutButton">LogOut</button>
                <button onClick={editUser} className="loginButton">EditUser</button>
            </div>
        </div>
    );
};

export default Home;
