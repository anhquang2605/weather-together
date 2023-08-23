
import {createContext, useContext, useState} from 'react';
interface UserFilter{
    nearbyCities: string[];
    featuredWeathers: string[];
}
type FilterContextType = {
    filter: UserFilter;
    setFilter: React.Dispatch<React.SetStateAction<UserFilter>>;
  };
interface FilterProviderProps{
    children: React.ReactNode;
}
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider ({children}:FilterProviderProps) {
    const [filter, setFilter] = useState<UserFilter>({
        nearbyCities: [],
        featuredWeathers: []
    });
    return <FilterContext.Provider value={{filter, setFilter}}>{children}</FilterContext.Provider>
    
};

export const useFilter = (): FilterContextType => {
    const context = useContext(FilterContext);
    if (!context) {
      throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
  };