import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import "../style/registrationForm.css"

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3080/getuserstable')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'login') {
      setLogin(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const checkUser = (event) => {
    event.preventDefault();

    // Find the user with the provided login
    const user = users.find(user => user.login === login);

    // Check if the user with the provided login exists
    if (!user) {
      alert('User with this login does not exist');
      return;
    }

    // Check if the entered password matches the stored password
    if (user.password !== password) {
      alert('Incorrect password');
      return;
    }


    // If both login and password are correct, navigate to /user
    navigate(`/user/${login}`);

    // Reset the form fields
    setLogin('');
    setPassword('');
  };

  return (
    <form onSubmit={checkUser}>
      <h1> Log In </h1>
      <div>
        <label htmlFor="login">Логин:</label>
        <input
          type="text"
          id="login"
          name="login"
          value={login}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Вход</button>
    </form>
  );
};

export default LoginForm;
