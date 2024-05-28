import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import './EditUser.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditUser = () => {
    const userData = useSelector((state) => state.user);
    const isAuth = useSelector((state) => state.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({ phone: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        image: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    axios.defaults.withCredentials = true;

    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        } else if (!userData) {
            const fetchData = async () => {
                try {
                    const authUser = await axios.get('http://localhost:4444/user/home');
                    if (!authUser.data.success) {
                        navigate('/login');
                    } else {
                        dispatch({
                            type: 'login',
                            payload: authUser.data.data
                        })
                       
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        } else {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.mobile || '',
                image: userData.image || userData.imagePath || ''
            });
        }
    }, [isAuth, userData, dispatch, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        const phone = form.elements.validationCustom03.value;

        const phoneRegex = /^\d{10}$/;

        let valid = true;
        let phoneError = '';

        if (!phoneRegex.test(phone)) {
            valid = false;
            phoneError = 'Please provide a valid 10-digit phone number.';
        }

        setErrors({ phone: phoneError });

        if (valid) {
            setValidated(true);

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }

            try {
                const response = await axios.post('http://localhost:4444/user/editUser', formDataToSend);
                if (response.status === 200) {
                    dispatch({
                        type: 'login',
                        payload: response.data.data,
                    });
                    navigate('/');
                }
            } catch (error) {
                console.error('Error submitting the form:', error);
            }
        } else {
            setValidated(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="centered">
            <div className="userRegister">
                <Button variant="success" onClick={() => navigate('/')}>
                    Go Back
                </Button>
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="formUser">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validationCustom01">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                placeholder="Enter your full name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validationCustom02">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validationCustom03">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your mobile number"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                isInvalid={!!errors.phone}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validationCustom04">
                            <img src={formData.image} alt="User Profile" className="profile-image"  style={{height:'80px',width:'80px'}}/>
                            <Form.Control.Feedback type="invalid">
                                {errors.phone || 'Looks good!'}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group>
                            <Form.Label>Change Image</Form.Label>
                            <Form.Control
                                type="file"
                                placeholder="Upload your image"
                                name="image"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Row>

                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        </div>
    );
};

export default EditUser;
