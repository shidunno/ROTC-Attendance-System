import rotcLogo from '../assets/Gemini_Generated_Image_gx0nrrgx0nrrgx0n-removebg-preview.png'
import {router} from '@inertiajs/react';
import { useState } from 'react';

export default function login() {

    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if (loading) return; 
        setLoading(true);
        
        const email = e.target.username.value;
        const password = e.target.password.value;

        router.post('/Login', {email, password}, { 
            onError: (errors) => {
                setLoginError(errors.email);
            },
            onFinish: () => setLoading(false)
        });
    }

    return (
        <>
            <div className = 'login-container'>
                <form className = 'login' onSubmit={handleLogin}>
                    <img src = {rotcLogo}></img>
                    <h1>Reserve Officers’ Training Corps (ROTC)Attendance System</h1>
                    <input id = 'username' name = 'username' type = 'text' placeholder='Enter User Email'/>
                    <br/>
                    <input id = 'password' name = 'password' type='password' placeholder='Enter User Password'/>
                    {loginError && (
                        <p style={{ color: 'red', margin: 0, padding: 0}}>{loginError}</p>
                    )}
                    <br/>
                    <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <button type = 'submit' disabled = {loading}>Sign-In</button>
                        <a href='/Forgotpassword'>Lost password?</a>
                    </div>
                </form>
            </div>
        </>
    );

}