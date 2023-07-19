import React, { useState, useEffect, ChangeEvent, FocusEvent } from 'react'
import { COUNTRIES } from '../../constants/countriesnew';
import bcrypt from 'bcryptjs';
import ApiStatusPop from '../../components/api-status-pop/apistatuspop';
import { getDataByZipcode } from '../../libs/zipcode';
import BackButton from '../../components/back-button/BackButton';
import style from './register.module.css';
import CustomSelect from '../../components/plugins/custom-select/CustomSelect';
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
    const [zipCodeTouched, setZipCodeTouched] = useState(false)
    const [country, setCountry] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [city, setCity] = useState('')
    //const [cities, setCities] = useState<string[]>()
    const [location, setLocation] = useState(null)
    //validation states
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [usernameLength, setUsernameLength] = useState(false)
    const [passwordLength, setPasswordLength] = useState(false)
    const [emailValid, setEmailValid] = useState(false)
    const [usernameExists, setUsernameExists] = useState(false)
    const [emailExists, setEmailExists] = useState(false)
    const [countrySelected, setCountrySelected] = useState(false)
    const [zipCodeFound, setZipCodeFound] = useState(false)
    const [countryFound, setCountryFound] = useState(false)
/*     const [suggestionOn, setSuggestionOn] = useState(false)
    const [citiesSuggestion, setCitiesSuggestion] = useState<string[]>([]) */
    //password validation states
    const [withAtLeastOneNumber, setWithAtLeastOneNumber] = useState(false)
    const [withAtLeastOneUpperCase, setWithAtLeastOneUpperCase] = useState(false)
    const [withAtLeastOneLowerCase, setWithAtLeastOneLowerCase] = useState(false)
    const [withAtLeastOneSpecialCharacter, setWithAtLeastOneSpecialCharacter] = useState(false)
    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [validPasswordMatch, setValidPasswordMatch] = useState(false)
    const [validZipCode, setValidZipCode] = useState(false)
    const [validCountry, setValidCountry] = useState(false)
    //api status
    const [apiStatus, setApiStatus] = useState({
        type: "idle",
        message: ""
    });
    const [zipApiStatus, setZipApiStatus] = useState("idle");
    const [showAPIPop, setShowAPIPop] = useState(false);    

    //Form state handlers
    const handleUsernameChange = (event:ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        setUsername(target?.value ?? '')

    }
    const handlePasswordChange = (event:ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        setPassword(target?.value ?? '')
    }
    const handleConfirmPasswordChange = (event:ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        setConfirmPassword(target?.value ?? '')

    }
    const handleEmailChange = (event:ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        setEmail(target?.value ?? '')

    }
    const handleCountriesSelect = (e: ChangeEvent) => {
            const country = (e.target as HTMLSelectElement).value;
            if(country == "") return;
            setCountry(country)
            setCountrySelected(true)
            setCountryFound(true)
        
    }
    const handleZipCodeChange = (event:ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        const zipcode = target?.value ?? ''
        setZipCode(zipcode)
    }
/*     const handleCityChange = async (event:ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        const city = target?.value ?? ''
        setCity(city)
        //const suggestions = await handleLookUpCity(city)
        //setCitiesSuggestion(suggestions)
    } */
    const handleLookupZipCode = async (event:FocusEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const zipcode = target?.value ?? ''
        if (zipcode.length <= 2) return;
        setZipApiStatus("loading");
        const loc = await getDataByZipcode(zipcode, country);
        if(!loc) {setZipCodeFound(false), setZipApiStatus("failed"); return;}
        setZipCodeFound(true)
        setZipApiStatus("success");
        setLocation(loc);
        setCity(loc.city)
    }
/*     const handleLookUpCity = async (city:string) => {
        //setSuggestionOn(true)
        const citiesList = [...cities ?? []];
        const filteredCities = citiesList.filter((cityName) => {
            return cityName.toLowerCase().startsWith(city.toLowerCase())
        })
        return filteredCities
    } */
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
        setCountry('')
        setZipCode('')
        setCity('')
        setCountrySelected(false)
        setCountryFound(false)
        setZipCodeFound(false)
        setValidZipCode(false)
        setValidCountry(false)
        setZipApiStatus("idle");
        setShowAPIPop(false);
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
        const touched = userNameTouched && passwordTouched && confirmPasswordTouched && emailTouched && countrySelected && zipCodeTouched
        if(!touched){
            setUserNameTouched(true)
            setPasswordTouched(true)
            setConfirmPasswordTouched(true)
            setEmailTouched(true)
            setZipCodeTouched(true)
            setCountrySelected(true)
        }
        const valid = passwordMatch && usernameLength && passwordLength && emailValid && !usernameExists && !emailExists && countryFound && zipCodeFound
        if (valid) {
            const newUser = {
                username: username,
                password: bcrypt.hashSync(password, 10),
                email: email,
                location: location,
                firstName: "",
                lastName: "",
                profilePicturePath: "",
                bio: "",
                featuredWeather: null,
                favoriteWeathers: [],
                backgroundPicturePath: "",
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
        setValidZipCode(!zipCodeTouched || zipCodeFound);
    }, [zipCodeTouched, zipCodeFound])
    useEffect(() => {
        setValidCountry(!countrySelected || (countryFound && country !== ""));
    }, [countrySelected, countryFound, country])
    return (
        <>
            <ApiStatusPop  redirectPageName='Login' redirectDuration={3} status={apiStatus} setApiStatus={setApiStatus} show={showAPIPop} setReveal={setShowAPIPop}redirectButtonText='Go to Login Page' redirect="/authentication/login"/>
            <div className={"glass flex flex-col " + style['form-container']}>
                <div className="form-container flex-row w-2/5 my-auto mx-auto">
                    <BackButton />
                    <h3 className="form-title w-full">
                        Register
                    </h3>
                    <div className="lg:half form-row lg:mr-4 w-full mr-0">
                        <label>
                            Username
                        </label>
                        <input type="text" className={"p-4 border rounded border w-full "+ (validUsername ? "" : " border-red-400")} placeholder="Username" value={username} onChange={handleUsernameChange} onBlur={()=>{
                            validateUsername()
                            validateUsernameExists()
                        }} />
                        {<p className={"text-red-400 " + (validUsername && "opacity-0")}>{!usernameLength ? "Username must be at least 5 characters long" : "Placholder"} {usernameExists&&"Username already existed!"}</p>}
                    </div>
                    <div className="form-row lg:half w-full">
                        <label>
                            Email
                        </label>
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
                    <div className="form-row lg:half lg:mr-4 w-full mr-0">
                        <label>
                            Password
                        </label>
                        <input type="password" value={password} className={"p-4 border rounded self-start border w-full"+ (validPassword ? "" : " border-red-400")} placeholder="Password" onChange={handlePasswordChange} onBlur={()=>{
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
                    <div className="form-row lg:half w-full">
                        <label>
                            Confirm Password
                        </label>
                        <input type="password" value={confirmPassword}  className={"p-4 border rounded "+ (validPasswordMatch ? "" : "border-red-400")} placeholder="Retype password to confirm" onChange={handleConfirmPasswordChange} onBlur={()=>{
                                validatePasswordMatch()
                                validatePassword()
                            }} />
                            {<p className={"text-red-400 " + (validPasswordMatch && "opacity-0")}>Passwords do not match!</p>}
                    </div>

                  
                    <div className="form-row w-full">
                        <label>
                            Your country
                        </label>
                       <select className={"p-4 border rounded " + style['country-select-input'] + (validCountry ? "" : " border-red-400")} onChange={ (event) => {handleCountriesSelect(event) }}>
                            <option value="">Select a country before entering your zip code</option>
                            {COUNTRIES.map((country, index) => {
                                return <option  key={index} value={country.value}>{country.description}</option>
                            }
                            )}
                        </select>
                        <p className={"text-red-400 " + (validCountry && "opacity-0")}>Please select a country before you can enter your zip code!</p>
                    </div>

                    <div>
                        <h5  className={countrySelected ? "" : "text-gray-300"}>Enter Your zip code</h5>
                        <label></label>
                        <input type="text" className={"p-4 border rounded " + (validZipCode ? "" : "border-red-400") } disabled={!countrySelected}  value={zipCode} placeholder="Zip code" onBlur={handleLookupZipCode} onChange={(event) => { handleZipCodeChange(event) }} />
                        {zipApiStatus == "loading" && <p className="text-blue-400">Looking up city...</p>}
                        {zipApiStatus == "failed" && <p className="text-red-400">Error! cannot find the city</p>}
                        {zipApiStatus == "success" && <p className="text-green-400">City found! Your location is <span>{city}</span></p>}
                        {zipApiStatus == "idle" && <p className="opacity-0">Enter zip code or city name</p>}
                        <p className={"text-red-400 " + (validZipCode && "opacity-0")}>Please enter a valid zip code!</p>
    {/*                     <div className="relative">
                            <input className="p-4" type="text" disabled={!countrySelected}  value={city} placeholder="City" onBlur={()=>{setSuggestionOn(false)}} onFocus={(event)=>{
                                setZipCode('')
                            }}  onChange={handleCityChange} />
                            {
                                suggestionOn && citiesSuggestion.length && <ul className="absolute p-4 top-14 bg-white border h-50 overflow-y-auto">
                                    {citiesSuggestion.map((city, index) => {
                                        return <li data-city={city} className='hover:bg-purple-200 cursor-pointer' onMouseDown={(event: React.MouseEvent<HTMLLIElement>) => {
                                            const target = event.target as HTMLLIElement;
                                            setCity(target.dataset.city ?? "");
                                            setSuggestionOn(false);
                                        }} key={index}>{city}</li>
                                    })}
                                </ul>
                            }
                        </div> */}


                    </div>   
                    <button onClick={handleSubmit} className="action-btn w-full">Register</button>
                </div>
                
            </div>
        </>
    )
}