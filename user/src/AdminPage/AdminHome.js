import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../Components/Admin/Home/Navbar/Navbar'
import Body from '../Components/Admin/Home/Body/Body'
import axios from 'axios';

const AdminHome = () => {

    const navigate = useNavigate()

    const [searchData, setsearchData] = useState('');

    const handelSearch = (data) => {
        setsearchData(data);
    };

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


    return (
        <div>
            <NavBar onSearch={handelSearch} />
            <Body searchData={searchData} />
        </div>
    )
}

export default AdminHome
