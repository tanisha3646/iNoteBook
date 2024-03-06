import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "", name:"", confirmPassword:"" });
    let navigate = useNavigate();

    const signupButOnClick = async (e) => {
        const {name, email, password} = credentials;
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/createUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email:email, password:password, name:name})
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            //redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Signed In successfully", "success");
            navigate('/');
        }
        else{
            props.showAlert("Some error occured", "danger");
        }
    }
    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='container mt-2'>
            <h2>SignUp to use iNoteBook</h2>
            <form onSubmit={signupButOnClick}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" onChange={onchange} name="name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={onchange} name="email" placeholder="name@example.com" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">password</label>
                    <input className="form-control" type="password" id="password" onChange={onchange} name="password" minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                    <input className="form-control" type="password" id="confirmPassword" onChange={onchange} name="confirmPassword" minLength={5} required/>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Signup
