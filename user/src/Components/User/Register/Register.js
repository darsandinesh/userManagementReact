import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../Spinner/Spinner';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [spinner,setSpinner] = useState(false);

    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        setSpinner(true);
        const fetchData = async () => {
            try {
                const authUser = await axios.get('http://localhost:4444/user/home');
                console.log(authUser, 'authuser./././././././');
                if (authUser.data.success) {
                    navigate('/')
                } else {
                    setSpinner(false)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formValidation = {};
        if (!userName) {
            formValidation.userNameError = 'Username is required';
        }
        if (mobile.length !== 10) {
            formValidation.mobileError = 'Mobile number should be 10 digits';
        }
        if (!email) {
            formValidation.emailError = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            formValidation.emailError = 'Invalid email format';
        }
        if (password.length < 6) {
            formValidation.passwordError = 'Minimum 6 characters required';
        }

        setErrors(formValidation);

        if (Object.keys(formValidation).length === 0) {
            const formData = new FormData();
            formData.append('userName', userName);
            formData.append('mobile', mobile);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('image', image);

            try {
                const response = await axios.post('http://localhost:4444/user/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response);
                if (response.status === 200) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }


    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className='registerForm'>
            <h2>User Register</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <br />
                <input type="text" placeholder='Enter the Username' value={userName} onChange={(e) => setUserName(e.target.value)} />
                {errors.userNameError && <p style={{ color: 'red' }}>{errors.userNameError}</p>}
                <br />
                <label>Mobile</label>
                <br />
                <input type="number" placeholder='Enter the Mobile number' value={mobile} onChange={(e) => setMobile(e.target.value)} />
                {errors.mobileError && <p style={{ color: 'red' }}>{errors.mobileError}</p>}
                <br />
                <label>Email Address</label>
                <br />
                <input type="email" placeholder='Enter the Email address' value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.emailError && <p style={{ color: 'red' }}>{errors.emailError}</p>}
                <br />
                <label>Password</label>
                <br />
                <input type="password" placeholder='Enter the Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                {errors.passwordError && <p style={{ color: 'red' }}>{errors.passwordError}</p>}
                <br />
                <label>Profile Image</label>
                <br />
                {image && <img style={{ height: '80px', width: '80px', marginLeft: '35%' }} src={URL.createObjectURL(image)} alt='userProfile' />}
                <br />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} accept='image/png, image/jpeg, image/webp' />
                <br />
                <button type="submit">Register</button>
                <br />
                <p onClick={handleLogin}>Already a user? Login.</p>
            </form>
        </div>
    );
};

export default Register;
