import React from "react";

export interface ISearchContext {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>
}

export const SearchContext = React.createContext<ISearchContext>({} as ISearchContext);