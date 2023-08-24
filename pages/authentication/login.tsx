import { ChangeEvent, useState } from "react";
import ApiStatusPop from "./../../components/api-status-pop/apistatuspop";
import { useDispatch, useSelector } from "react-redux";
import { userLoaded } from "../../store/features/user/userSlice";
import style from "./login.module.css";
import { useRouter } from "next/router";
import BackButton from "../../components/back-button/BackButton";
import CheckBox from "../../components/form/check-box/CheckBox";
import {signIn} from "next-auth/react";
import {getSession} from "next-auth/react";
import { set } from "mongoose";
import Link from "next/link";
export default function Login() {
        //api status
        const [apiStatus, setApiStatus] = useState({
            type: "idle",
            message: ""
        });
        const [remember, setRemember] = useState(false);
        const [reveal, setReveal] = useState(false);
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const router = useRouter();
        const dispatch = useDispatch();
        const handleUsernameChange = (e: any) => {
            setUsername(e.target.value);
        }
        const handlePasswordChange = (e: any) => {
            setPassword(e.target.value);
        }
        const handleRememberMe = (value: boolean, label: string) => {
            setRemember(value);
        }
        const handleDataNoAuthBack = (data: any) => {
            if(data){
                if(data.type == "success") {
                    setApiStatus({
                        type: "success",
                        message: data.message
                    });
                    dispatch(userLoaded(JSON.parse(data.data)));
                }else {
                    setApiStatus({
                        type: "error",
                        message: data.message
                    });
                }
            }else{
                setApiStatus({
                    type: "error",
                    message: "Could not connect to server"
                });
            }
           
        }
        const handleLogin = async (e:any) => {
            setApiStatus({
                type: "loading",
                message: "Logging in..."
            });
            setReveal(true);
  
            const result = await signIn("credentials", {
                username: username,
                password: password,
                remember: remember,
                redirect: false
            });
            if(result){
                
                if(result.error) {
                    setApiStatus({
                        type: "error",
                        message: result.error
                    });
                }else {
                    setApiStatus({
                        type: "success",
                        message: "Logged in successfully"
                    });
                    const session = await getSession();
                    dispatch(userLoaded(result));
                }
            }
                

            /* else {
                fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }).then(res => res.json()).then(handleDataNoAuthBack);
            } */
           
        }
        
    return (
        <>
            <div className="glass flex flex-row grow justify-center items-center">  
                <div className={"mx-auto form-container bg-transparent flex flex-wrap xl:w-1/4 lg:w-1/2 md:w-2/5 w-9/12 my-auto"}>
                    <h3 className="form-title w-full">Login</h3>
                    <div className="form-row dark w-full mb-4">
                        <label className={"block text-gray-700 text-sm font-bold mb-2 form-title" + style['']}htmlFor="username">Username</label>
                        <input type="text" className="rounded p-4" value={username}
                            onChange={handleUsernameChange}
                            placeholder="username" />
                    </div>
                    <div className="form-row dark w-full mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password" >Password</label>
                        <input type="password" className="rounded p-4" value={password}
                            onChange={handlePasswordChange}
                            placeholder="password" />
                    </div>
                    <div className="helpers w-full flex flex-row justify-between">
                        <div className="remember-me">
                            <CheckBox label="Remember me" handleChecked={handleRememberMe}/>
                        </div>
                        <Link className="underline" href="authentication/forgot-password">Forgot password?</Link>  
                    </div>
                    <div className="horizontal-btn-group w-full mt-20">
                        <button onClick={handleLogin} className="action-btn w-full">Log in</button>
                    </div>
                    <Link className="w-full text-center mt-4" href="authentication/register">Create an account</Link>
  
                </div>
            </div>
            <ApiStatusPop setApiStatus={setApiStatus} redirectPageName="Home" redirectDuration={3} status={apiStatus} redirect="/" redirectButtonText="Return Home" setReveal={setReveal} show={reveal}/>
        </>
    )
}