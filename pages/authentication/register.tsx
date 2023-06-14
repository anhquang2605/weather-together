import { useState } from 'react'
import bcrypt from 'bcryptjs';
const API_PREFFIX = "/api";
export default function Register() {
    //form states
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    //validation states
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [usernameLength, setUsernameLength] = useState(false)
    const [passwordLength, setPasswordLength] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const [usernameExists, setUsernameExists] = useState(false)
    const [emailExists, setEmailExists] = useState(false)

    //Form state handlers
    const handleUsernameChange = (event:any) => {
        setUsername(event.target.value)
    }
    const handlePasswordChange = (event:any) => {
        setPassword(event.target.value)
    }
    const handleConfirmPasswordChange = (event:any) => {
        setConfirmPassword(event.target.value)
    }
    const handleEmailChange = (event:any) => {
        setEmail(event.target.value)
    }

    //form validation
    const validateUsername = () => {
        if (username.length < 5) {
            setUsernameLength(false)
        } else {
            setUsernameLength(true)
        }
    }
    const validatePassword = () => {
        if (password.length < 8) {
            setPasswordLength(false)
        } else {
            setPasswordLength(true)
        }
    }
    const validateEmailPattern = () => {
        const emailPattern = new RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)
        if (emailPattern.test(email)) {
            setEmailValid(true)
        } else {
            setEmailValid(false)
        }
    }

    const validatePasswordMatch = () => {
        if (password === confirmPassword) {
            setPasswordMatch(true)
        } else {
            setPasswordMatch(false)
        }
    }
    const validateUsernameExists = async () => {
        const response = await fetch(API_PREFFIX + "/user-by-name?username=" + username);
        const data = await response.json();
        const existingUser = data.user;
        if (existingUser) {
            setUsernameExists(true)
        } else {
            setUsernameExists(false)
        }
    }

     const validateEmailExists = async () => {
        const response = await fetch(API_PREFFIX + "/user-by-email?email=" + email);
        const data = await response.json();
        const existingUser = data.user;
        if (existingUser) {
            setEmailExists(true)
        } else {
            setEmailExists(false)
        }
    } 

    const handleSubmit = (event:any) => {
        const valid = passwordMatch && usernameLength && passwordLength && emailValid && !usernameExists && !emailExists
        if (valid) {
            const newUser = {
                username: username,
                password: bcrypt.hash(password, 10),
                email: email

            }
            fetch(API_PREFFIX + "/add-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            })
           // addUser(username, password, email, null)
        }
    }

    return (
        <>
            <h1>Register</h1>
            <div>
                {!passwordMatch && <p className="text-red-400">Passwords do not match</p>}
                {!usernameLength && <p className="text-red">Username must be at least 5 characters long</p>}
                {!passwordLength && <p className="text-red">Password must be at least 8 characters long</p>}
                {!emailValid && <p className="text-red">Email must be valid</p>}
                {usernameExists && <p className="text-red">Username already exists</p>}
                {emailExists && <p className="text-red">Email already exists</p>}
            </div>
            <div className="bg-white md:container md:mx-auto mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <input type="text" className="p-4" placeholder="Username" onChange={handleUsernameChange} onBlur={()=>{
                    validateUsername()
                    validateUsernameExists()
                }} />
                <input type="password" className="p-4" placeholder="Password" onChange={handlePasswordChange} onBlur={()=>{
                    validatePassword()
                }}/>
                <input type="password" className="p-4" placeholder="Confirm password" onChange={handleConfirmPasswordChange} onBlur={()=>{
                    validatePasswordMatch()
                    validatePassword()
                }} />
                <input type="email" className="p-4" placeholder="Email" onChange={handleEmailChange} onBlur={()=>{
                    validateEmailPattern()
                    validateEmailExists()
                }} />
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</button>
            </div>
        </>
    )
}