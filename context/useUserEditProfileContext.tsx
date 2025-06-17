import {createContext, useContext} from 'react';

type UserEditProfileContextType = {
    featuredWeather: string;
    setFeaturedWeather: React.Dispatch<React.SetStateAction<string>>
}

type UserEditProfileContextValue = {
    featuredWeather: string;
    setFeaturedWeather: React.Dispatch<React.SetStateAction<string>>
}

export const UserEditProfileContext = createContext<UserEditProfileContextType | null>(null);

export const useUserEditProfileContext = () => {
    const context = useContext(UserEditProfileContext);
   /*  if (context === null) {
        throw new Error('useUserEditProfileContext must be used within a UserEditProfileProvider');
    }     */
    return context
}

export function UserEditProfileContextProvider({children, value}: {children: React.ReactNode, value: UserEditProfileContextValue}) {
    return (
        <UserEditProfileContext.Provider value={value}>
            {children}
        </UserEditProfileContext.Provider>
    )
}