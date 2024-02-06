import React, { useContext } from "react"
export const AuthContext =  React.createContext(undefined)

export function useUserContext(){
    const user = useContext(AuthContext)
    if(user===undefined){
        throw new Error('useUserContext must be used with a AuthContext')
    }
    return user
}