import {createContext, useContext, useEffect, useState} from 'react';

type UserEditProfileContextType = {
    featuredWeather: string;
    setFeaturedWeather: React.Dispatch<React.SetStateAction<string>>
}

const UserEditProfileContext = createContext<UserEditProfileContextType | null>(null);

export const useUserEditProfileContext = () => {
    const context = useContext(UserEditProfileContext);
    if (context === null) {
        throw new Error('useUserEditProfileContext must be used within a UserEditProfileProvider');
    }    
    return context
}

export function UserEditProfileContextProvider({children}: {children: React.ReactNode}) {
    const [featuredWeather, setFeaturedWeather] = useState<string>('');
    const value = {
        featuredWeather,
        setFeaturedWeather
    }
    return (
        <UserEditProfileContext.Provider value={value}>
            {children}
        </UserEditProfileContext.Provider>
    )
}