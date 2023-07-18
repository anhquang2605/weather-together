import { ChangeEvent, useState } from "react";
import ApiStatusPop from "./../../components/api-status-pop/apistatuspop";
import { useDispatch, useSelector } from "react-redux";
import { userLoaded } from "../../store/features/user/userSlice";
import style from "./login.module.css";
import { useRouter } from "next/router";
import BackButton from "../../components/back-button/BackButton";
import CheckBox from "../../components/form/check-box/CheckBox";
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
        const handleRememberMe = (value: boolean) => {
            setRemember(value);
        }
        const handleLogin = async (e:any) => {
            setApiStatus({
                type: "loading",
                message: "Logging in..."
            });
            setReveal(true);
            fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }).then(res => res.json()).then(data => {
                if(data.type == "success") {
                    setApiStatus({
                        type: "success",
                        message: "Login successful"
                    });
                    dispatch(userLoaded(JSON.parse(data.data)));
                } else {
                    setApiStatus({
                        type: "error",
                        message: "Login failed"
                    });
                }

            });
        }
        
    return (
        <>
            <div className="glass flex flex-row grow justify-center items-center">  
                <div className={"mx-auto form-container bg-transparent flex flex-wrap xl:w-1/4 lg:w-1/2 md:w-2/5 w-9/12 my-auto"}>
                    <BackButton />
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
                        <div className="forgot-password hover:text-indigo-300">
                            <a href="#" className="underline">Forgot password?</a>
                        </div>
                    </div>
                    <div className="horizontal-btn-group w-full mt-20">
                        <button onClick={handleLogin} className="action-btn w-full">Log in</button>
                    </div>    
                </div>
            </div>
            <ApiStatusPop setApiStatus={setApiStatus} redirectPageName="Home" redirectDuration={5} status={apiStatus} redirect="/" redirectButtonText="Return Home" show={reveal}/>
        </>
    )
}