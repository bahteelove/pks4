import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../style/registrationForm.css"

const RegistrationForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [users, setUsers] = useState([]);

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
    } else if (name === 'fullName') {
      setFullName(value);
    }
  };

  const addNewUser = async (event) => {
    event.preventDefault();

    try {
      // Check if any required field is empty
      if (!login || !password || !fullName) {
        alert('All fields are required');
        return;
      }

      // Check if the login already exists
      const userExists = users.some(user => user.login === login);

      if (userExists) {
        alert('Login is already taken');
        return;
      }

      // Send POST request to add a new user
      await axios.post('http://localhost:3080/addnewuser', { login, password, user_name: fullName });

      // Fetch updated list of users after adding new user
      fetchUsers();

      // Reset the form fields
      setLogin('');
      setPassword('');
      setFullName('');

      alert('New user added successfully');
    } catch (error) {
      console.error('Error adding new user:', error);
    }
  };

  return (
    <form onSubmit={addNewUser}>
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
      <div>
        <label htmlFor="fullName">ФИО:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default RegistrationForm;
