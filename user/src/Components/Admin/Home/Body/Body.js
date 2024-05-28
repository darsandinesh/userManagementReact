import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';


const Body = ({ searchData }) => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4444/admin/home');
                if (response.data.success) {
                    const data = response.data.userData;
                    console.log(data, './././/.////////')
                    setUserData(data);
                }
                console.log(response);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, []);

    const deleteUser = async (email) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (!result.isConfirmed) {
                return;
            }
            try {
                const response = await axios.post('http://localhost:4444/admin/deleteUser', { email });
                if (response.data.success) {
                    setUserData(userData.filter(user => user.email !== email));
                }
                console.log(response);
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        });
        
    };

    console.log(userData, 'useData')

    const filteredUserData = userData.filter(user =>
        user.name.toLowerCase().includes(searchData.toLowerCase())
    );

    return (
        <div style={{ width: '700px', marginLeft: '20%', marginTop: '6%' }}>
            <Table striped>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>User</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUserData.map((user, index) => (
                        <tr key={user.email}>
                            <td>{index + 1}</td>
                            <td><img src={user.imagePath} alt="" style={{ height: '60px', width: '60px' }} /></td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="outline-danger" onClick={() => deleteUser(user.email)}>X</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Body;
