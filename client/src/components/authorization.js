import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './style/authorization.css';

const Authorization = () => {
    const navigate = useNavigate();
    const [userId, setUsertId] = useState('');
    const [error, setError] = useState('');

    

    return (
        <>
            <h1>Welcome to the online hospital system</h1>
            
        </>
    );
}

export default Authorization;