import { ChangeEvent, useState, FocusEvent } from "react";
import * as CITIES from './../../../../data/cities.json';
import {COUNTRIES} from './../../../../constants/countries';
import {getDataByZipcode } from './../../../../libs/zipcode';
import { User } from "../../../../types/User";
import { Information } from "../../../../types/User";
interface EditInformationFormProps {
    user: User,
}
const API_PREFFIX = "/api";
export default function EditInformationForm({user}:EditInformationFormProps){
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [city, setCity] = useState(user.location?.city);
    const [country, setCountry] = useState(user.location?.country_code ?? "");
    const [zipCode, setZipCode] = useState(user.location?.postal_code);
    const [email, setEmail] = useState(user.email);
    const [location, setLocation] = useState(user.location);
    //Found state
    const [emailExists, setEmailExists] = useState(false)
    const [countrySelected, setCountrySelected] = useState(false)
    const [zipCodeFound, setZipCodeFound] = useState(false)
    const [countryFound, setCountryFound] = useState(false)
    //valid state
    const [validZipCode, setValidZipCode] = useState(true)
    const [validEmail, setEmailValid] = useState(true)
    //api status
    const [apiStatus, setApiStatus] = useState({
        type: "idle",
        message: ""
    });
    const [zipApiStatus, setZipApiStatus] = useState("idle");
    const [showAPIPop, setShowAPIPop] = useState(false);    
    
    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    }
    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    }
    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
    }
    const handleCountriesSelect = (event:ChangeEvent) => {
        const target = event.target as HTMLSelectElement;
        const theCountry = target?.value ?? ''
        const countryName = target.options[target.selectedIndex].dataset.name ?? ''
        if(theCountry !== ''){
            setCountry(theCountry)
            setCountrySelected(true)
            setCountryFound(true)
        }

    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setZipCode(e.target.value);
    }
    
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
    const validateEmailPattern = () => {
        const emailPattern = new RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)
        if (emailPattern.test(email ?? "")) {
            setEmailValid(true)
        } else {
            setEmailValid(false)
        }
    }

    const validateEmailExists = async () => {
        if(email === user.email) {
            setEmailExists(false)
            return;
        };
        const response = await fetch(API_PREFFIX + "/user-by-email/?email=" + email);
        const data = await response.json();
        const existingUser = data.user;
        if (existingUser) {
            setEmailExists(true)
        } else {
            setEmailExists(false)
        }
    }
    const handleSubmit = () => {
        const valid = validEmail && validZipCode && !emailExists;
        if (!valid) return;
        const information = {
            firstName,
            lastName,
            email,
            location: location,
        }
        setApiStatus({
            type: "loading",
            message: "Updating your information..."
        })
        fetch(API_PREFFIX + "/update-user", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...user,
                ...information
            })
        }).then(async (response) => {
            const data = await response.json();
            if (response.status === 200) {
                setApiStatus({
                    type: "success",
                    message: "Your information has been updated!"
                })
            } else {
                setApiStatus({
                    type: "error",
                    message: data.message
                })
            }
        })
    }
    
    return (
            <>
                <div className="text-indigo-900 flex flex-row flex-wrap justify-between w-full">
                    <div className="form-row dark half">
                        <label htmlFor="first-name">First name</label>
                        <input type="text" value={firstName} className="p-4 border rounded" placeholder="First Name" onChange={handleFirstNameChange} />
                    </div>
                    <div className="form-row dark half">
                        <label htmlFor="last-name">Last name</label>
                        <input type="text" value={lastName} className="p-4 border rounded" placeholder="Last Name" onChange={handleLastNameChange} />
                    </div>
                    <div className="form-row dark w-full mt-4">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={email} className={"p-4 border rounded "+ (validEmail ? "" : "border-red-400")} placeholder="Email" onChange={handleEmailChange} onBlur={()=>{
                            validateEmailPattern()
                            validateEmailExists()
                        }} />
                        {<p className={"text-red-400 " + (validEmail && "opacity-0")}>{
                            emailExists && "Email already existed!"
                        }
                        {
                            !validEmail ? "Email is not valid!" : "it is oke to use this email!"
                        }
                        </p>}
                    </div>
                    <div className="form-row dark half">
                        <label htmlFor="country">Country</label>
                        <select value={country} className={"p-4 border rounded"} onChange={ (event) => {handleCountriesSelect(event) }}>
                            {COUNTRIES.map((country, index) => {
                                return <option data-name={country.name} key={index} value={country.code}>{country.name}</option>
                            }
                            )}
                        </select>
                    </div>

                    <div className="form-row dark half">

                        <h5  className={countrySelected ? "" : "text-gray-300"}>Enter Your zip code</h5>
                        <label></label>
                        <input type="text" className={"p-4 border rounded " + (validZipCode ? "" : "border-red-400") } value={zipCode} placeholder="Zip code" onBlur={handleLookupZipCode} onChange={(event) => { handleZipCodeChange(event) }} />
                        {zipApiStatus == "loading" && <p className="text-blue-400">Looking up city...</p>}
                        {zipApiStatus == "failed" && <p className="text-red-400">Error! cannot find the city</p>}
                        {zipApiStatus == "success" && <p className="text-green-400">City found! Your location is <span>{city}</span></p>}
                        {zipApiStatus == "idle" && <p className="opacity-0">Enter zip code or city name</p>}
                        <p className={"text-red-400 " + (validZipCode && "opacity-0")}>Please enter a valid zip code!</p>

                    </div>
                    <div className="flex flex-row">
                        <button className="action-btn " onClick={()=>{handleSubmit()}}>Update</button>  
                        <p className="grow p-4 text-lg">
                        {apiStatus.type === 'success' && <span className="text-green-500">{apiStatus.message}</span>}
                        {apiStatus.type === 'error' && <span className="text-red-500">{apiStatus.message}</span>}
                        {apiStatus.type === 'loading' && <span className="text-blue-500">{apiStatus.message} </span>}
                        {apiStatus.type === 'idle' && <span className="text-transparent">idle </span>}
                    </p>
                    </div>
                    

                </div>
            </>
        )
}