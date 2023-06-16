import { useState, useEffect } from 'react'
import bcrypt from 'bcryptjs';
import ApiStatusPop from '../../components/api-status-pop/apistatuspop';
const API_PREFFIX = "/api";
const PW_LENGTH = 8;
export default function Register() {
    //form states
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [userNameTouched, setUserNameTouched] = useState(false)
    const [passwordTouched, setPasswordTouched] = useState(false)
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)
    const [emailTouched, setEmailTouched] = useState(false)
    //validation states
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [usernameLength, setUsernameLength] = useState(false)
    const [passwordLength, setPasswordLength] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const [usernameExists, setUsernameExists] = useState(false)
    const [emailExists, setEmailExists] = useState(false)
    //password validation states
    const [withAtLeastOneNumber, setWithAtLeastOneNumber] = useState(false)
    const [withAtLeastOneUpperCase, setWithAtLeastOneUpperCase] = useState(false)
    const [withAtLeastOneLowerCase, setWithAtLeastOneLowerCase] = useState(false)
    const [withAtLeastOneSpecialCharacter, setWithAtLeastOneSpecialCharacter] = useState(false)
    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [validPasswordMatch, setValidPasswordMatch] = useState(false)
    //api status
    const [apiStatus, setApiStatus] = useState({
        type: "idle",
        message: ""
    });
    const [showAPIPop, setShowAPIPop] = useState(false);    

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
    const resetAllState = () => {
        setUsername('')
        setPassword('')
        setConfirmPassword('')
        setEmail('')
        setPasswordMatch(false)
        setUsernameLength(false)
        setPasswordLength(false)
        setEmailValid(false)
        setUsernameExists(false)
        setEmailExists(false)
        setWithAtLeastOneNumber(false)
        setWithAtLeastOneUpperCase(false)
        setWithAtLeastOneLowerCase(false)
        setWithAtLeastOneSpecialCharacter(false)
        setValidUsername(false)
        setValidPassword(false)
        setValidEmail(false)
        setValidPasswordMatch(false)
        setUserNameTouched(false)
        setPasswordTouched(false)
        setConfirmPasswordTouched(false)
        setEmailTouched(false)

    }

    //form validation
    const validateUsername = () => {
        setUserNameTouched(true)
        if (username.length < 5) {
            setUsernameLength(false)
        } else {
            setUsernameLength(true)
        }
    }
    const validatePassword = () => {
        setPasswordTouched(true)
        if (password.length < 8) {
            setPasswordLength(false)
        } else {
            setPasswordLength(true)
        }
        validatePasswordPattern(password)
    }
    const validatePasswordPattern = (pw:string) => {
        const atLeastOneNumber = new RegExp(/[0-9]/)
        const atLeastOneUpperCase = new RegExp(/[A-Z]/)
        const atLeastOneLowerCase = new RegExp(/[a-z]/)
        const atLeastOneSpecialCharacter = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        setPasswordLength(pw.length >= PW_LENGTH)
        setWithAtLeastOneLowerCase(atLeastOneLowerCase.test(pw));
        setWithAtLeastOneUpperCase(atLeastOneUpperCase.test(pw));
        setWithAtLeastOneNumber(atLeastOneNumber.test(pw));
        setWithAtLeastOneSpecialCharacter(atLeastOneSpecialCharacter.test(pw));
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
        setConfirmPasswordTouched(true)
        if (password === confirmPassword) {
            setPasswordMatch(true)
        } else {
            setPasswordMatch(false)
        }
    }
    const validateUsernameExists = async () => {
        const response = await fetch(API_PREFFIX + "/user-by-name/?username=" + username);
        const data = await response.json();
        const existingUser = data.user;
        if (existingUser) {
            setUsernameExists(true)
        } else {
            setUsernameExists(false)
        }
    }

     const validateEmailExists = async () => {
        setEmailTouched(true)
        const response = await fetch(API_PREFFIX + "/user-by-email/?email=" + email);
        const data = await response.json();
        const existingUser = data.user;
        if (existingUser) {
            setEmailExists(true)
        } else {
            setEmailExists(false)
        }
    } 

    const handleSubmit = (event:any) => {
        const touched = userNameTouched && passwordTouched && confirmPasswordTouched && emailTouched
        if(!touched){
            setUserNameTouched(true)
            setPasswordTouched(true)
            setConfirmPasswordTouched(true)
            setEmailTouched(true)
        }
        const valid = passwordMatch && usernameLength && passwordLength && emailValid && !usernameExists && !emailExists
        if (valid) {
            const newUser = {
                username: username,
                password: bcrypt.hashSync(password, 10),
                email: email

            }
            setShowAPIPop(true);
            setApiStatus({
                type: "loading",
                message: "Adding user..."
            });
            fetch(API_PREFFIX + "/add-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            }).then(response => {
                if (response.status === 200) {
                    setApiStatus(
                        {
                            type: "success",
                            message:"User added successfully"}
                        );
                    resetAllState();
                } else {
                    setApiStatus(
                        {
                            type: "error",
                            message:"Error adding user, please try again later"
                        });
                }

            })
           // addUser(username, password, email, null)
        }
    }
    useEffect(() => {
        setValidPassword(!passwordTouched || (passwordLength && withAtLeastOneNumber && withAtLeastOneUpperCase && withAtLeastOneLowerCase && withAtLeastOneSpecialCharacter));
    }, [passwordTouched, passwordLength, withAtLeastOneLowerCase, withAtLeastOneUpperCase, withAtLeastOneNumber, withAtLeastOneSpecialCharacter])
    useEffect(() => {
        setValidUsername(!userNameTouched || usernameLength && !usernameExists);
    }, [userNameTouched, usernameLength, usernameExists])
    useEffect(() => {
        setValidEmail(!emailTouched || emailValid && !emailExists);
    }, [emailTouched, emailValid, emailExists])
    useEffect(() => {
        setValidPasswordMatch(!confirmPasswordTouched || passwordMatch);
    }, [confirmPasswordTouched, passwordMatch])
    useEffect(() => {
        console.log(validPassword)
    }, [validPassword])
    return (
        <>
            <h1>Register</h1>
            <div>

            </div>
            <ApiStatusPop status={apiStatus} show={showAPIPop} redirectButtonText='Go to Login Page' redirect="/authentication/login"/>
            <div className="bg-white md:container md:mx-auto mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div>
                    <input type="text" className={"p-4 border rounded border"+ (validUsername ? "" : " border-red-400")} placeholder="Username" value={username} onChange={handleUsernameChange} onBlur={()=>{
                        validateUsername()
                        validateUsernameExists()
                    }} />
                    {<p className={"text-red-400 " + (validUsername && "opacity-0")}>{!usernameLength ? "Username must be at least 5 characters long" : "Placholder"} {usernameExists&&"Username already existed!"}</p>}
                </div>
                <div className="flex">
                    <input type="password" value={password} className={"p-4 border rounded self-start border"+ (validPassword ? "" : " border-red-400")} placeholder="Password" onChange={handlePasswordChange} onBlur={()=>{
                            validatePassword()
                        }}/>
                    <ul className={"" + (validPassword && "opacity-0")}>
                        Password must contain:
                        <li className={"text-red-400 " + (passwordLength && "line-through")}>At least 8 characters</li>
                        <li className={"text-red-400 " + (withAtLeastOneNumber && "line-through")}>At least one number</li>
                        <li className={"text-red-400 " + (withAtLeastOneUpperCase && "line-through")}>At least one uppercase letter</li>
                        <li className={"text-red-400 " + (withAtLeastOneLowerCase && "line-through")}>At least one lowercase letter</li>
                        <li className={"text-red-400 " + (withAtLeastOneSpecialCharacter && "line-through")}>At least one special character</li>
                    </ul>
                   
                </div>
               <div>
                <input type="password" value={confirmPassword}  className={"p-4 border rounded "+ (validPasswordMatch ? "" : "border-red-400")} placeholder="Confirm password" onChange={handleConfirmPasswordChange} onBlur={()=>{
                        validatePasswordMatch()
                        validatePassword()
                    }} />
                    {<p className={"text-red-400 " + (validPasswordMatch && "opacity-0")}>Passwords do not match!</p>}
               </div>

                <div>
                    <input type="email" value={email} className={"p-4 border rounded "+ (validEmail ? "" : "border-red-400")} placeholder="Email" onChange={handleEmailChange} onBlur={()=>{
                        validateEmailPattern()
                        validateEmailExists()
                    }} />
                    {<p className={"text-red-400 " + (validEmail && "opacity-0")}>{
                        emailExists && "Email already existed!"
                    }
                    {
                        !emailValid ? "Email is not valid!" : "it is oke to use this email!"
                    }
                    </p>}
                </div>

                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Register</button>
            </div>
        </>
    )
}