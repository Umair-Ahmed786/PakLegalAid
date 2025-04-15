import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../context/alert/AlertContext'; // Import AlertContext


const Login = () => {

    //states
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');

    //alert Context
    const { showAlert } = useContext(AlertContext);

    //Hooks
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        try {
            e.preventDefault();
            console.log("Submit was clicked: ")

            const headers = {
                "Content-Type": "application/json",
            };

            const response = await fetch("http://localhost:3000/auth/login/", {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            console.log('Success:', data);
            console.log("Token ", data.authToken);
            console.log("token ", data.authtoken);

            if (data.authToken) {

                //save the token and redirect to home
                localStorage.setItem('token', data.authToken);
                showAlert('Logged in successfully!', 'success'); // Show success alert

                navigate('/');
            }
            else {
                // alert('Run there is Error')
                showAlert('Invalid credentials', 'danger'); // Show error alert

            }

            setemail('');
            setpassword('');

        } catch (error) {
            console.error('Error:', error);
            showAlert('Client Site error', 'warning');
        }
    }


    return (
        <>
            <div className="container mt-5">

                
                    <h1>Login To Continue Using iNotebook</h1>
                
                <form onSubmit={handlesubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => { setemail(e.target.value) }} aria-describedby="emailHelp" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => { setpassword(e.target.value) }} />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3" >Submit</button>
                </form>
            </div>

        </>
    )
}

export default Login
