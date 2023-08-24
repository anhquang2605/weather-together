
import {createContext, useContext, useState} from 'react';
export interface UserFilter{
    nearbyCities: string[];
    featuredWeathers: string[];
}
type FilterContextType = {
    filter: UserFilter;
    setFilter: React.Dispatch<React.SetStateAction<UserFilter>>;
    filterBusy: boolean;
    setFilterBusy: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [filterBusy, setFilterBusy] = useState<boolean>(false);
    return <FilterContext.Provider value={{filter, setFilter, filterBusy, setFilterBusy}}>{children}</FilterContext.Provider>
    
};

export const useFilter = (): FilterContextType => {
    const context = useContext(FilterContext);
    if (!context) {
      throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
  };