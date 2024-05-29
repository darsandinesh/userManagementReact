import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import LoginPage from './UserPages/LoginPage';
import RegisterPage from './UserPages/RegisterPage';
import Home from './Components/User/Home/Home';
import Login from './Components/Admin/Login/Login';
import AdminHome from './AdminPage/AdminHome';
import EditUser from './Components/User/EditUser/EditUser';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/admin' element={<Login />} />
          <Route path='/admin/dashboard' element={<AdminHome />} />
          <Route path='/editUser' element={<EditUser />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
