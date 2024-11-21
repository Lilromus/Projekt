import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try 
        {
            const response = await axios.post('http://localhost:4000/login', { login, password }); 
            alert('Logowanie powiodło się!');
            navigate('/home');
        } 
        catch (error) 
        {
            alert('Nieudana próba logowania. Sprawdź dane logowania.');
        }
    };

    return (
        <div className="form-container">
            <h2>Logowanie</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="form-button">Zaloguj</button>
            </form>
        </div>
    );
}

export default Login;
