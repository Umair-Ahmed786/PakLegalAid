import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../context/alert/AlertContext';

const SignUp = () => {

    //states
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [cpassword, setcpassword] = useState('');

    //context
    const {showAlert} = useContext(AlertContext)

    //Hooks
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        try {
            e.preventDefault();
            console.log("Submit was clicked: ")

            if (password !== cpassword) {
                showAlert('Password and confirm Password Does not match', 'warning'); // Show error alert
                return;
            }

            const headers = {
                "Content-Type": "application/json",
            };

            const response = await fetch("http://localhost:3000/auth/", {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name,
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
                showAlert('SignUp successfully!', 'success');
                
                navigate('/');

            }
            else {
                showAlert('Invalid credentials', 'danger'); // Show error alert
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }


    return (
        <>
            <div className="container mt-5">

            <h1>Create an Account to Use iNotebook</h1> 
                <form onSubmit={handlesubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="Name">Name</label>
                        <input type="text" className="form-control" id="Name" value={name} onChange={(e) => { setname(e.target.value) }} minLength={3} required/>
                         </div>

                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => { setemail(e.target.value) }} aria-describedby="emailHelp" required/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => { setpassword(e.target.value) }} minLength={5} required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Confirm Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" value={cpassword} onChange={(e) => { setcpassword(e.target.value) }} minLength={5} required/>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3" >Submit</button>
                </form>
            </div>

        </>
    )
}

export default SignUp
