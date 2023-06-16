import { useState } from "react";
import ApiStatusPop from "./../../components/api-status-pop/apistatuspop";
export default function Login() {
        //api status
        const [apiStatus, setApiStatus] = useState({
            type: "idle",
            message: ""
        });
        const [reveal, setReveal] = useState(false);
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const handleUsernameChange = (e: any) => {
            setUsername(e.target.value);
        }
        const handlePasswordChange = (e: any) => {
            setPassword(e.target.value);
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
            <ApiStatusPop status={apiStatus} redirect="/" redirectButtonText="Return Home" show={reveal}/>
            <h1>Login</h1>
            <div className="bg-white md:container md:mx-auto mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                <input type="text" className="rounded text-pink-500 p-4" value={username}
                    onChange={handleUsernameChange}
                    placeholder="username" />
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password" >Password</label>
                <input type="password" className="rounded text-pink-500 p-4" value={password}
                    onChange={handlePasswordChange}
                    placeholder="password" />
                <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Log in</button>
            </div>
        </>
    )
}