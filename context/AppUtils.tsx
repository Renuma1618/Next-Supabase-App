"use client";
import { createContext, useContext, useEffect, useState } from "react";
import loader from "@/components/Loader";


interface UserProfile {
  name?: string;
  email?: string;
  gender?: string;
  phone?: string;
}


interface AppUtilsType{
    isLoggedIn: boolean;
    setAuthToken:(state:string |null)=>void;
    setIsLoggedIn:(state:boolean)=>void;
    userProfile: UserProfile | null;
    setUserProfile:(state:UserProfile |null)=>void;
    setIsLaoding:(state:boolean)=>void;
}
const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);
export const AppUtilsProvider =({
   Children,
}:{
    Children:React.ReactNode;
})=>{

    const[isLoggedIn,setIsLoggedIn] = useState<boolean>(false);
    const[, setAuthToken] = useState<null|string>(null);
    const[userProfile, setUserProfile] = useState<null | any>(null);
    const[isLoading, setIsLaoding] = useState(false);

    useEffect(()=>{
        const token = localStorage.getItem("acess_token");
        const userProfile = localStorage.getItem("user_profile")
        if(token){
            setAuthToken(token);
            setUserProfile(userProfile ? JSON.parse(userProfile) : null);
        }
    },[])
    return(
        <AppUtilsContext.Provider 
            value={{ 
            isLoggedIn,
            setAuthToken,
            setIsLoggedIn, 
            userProfile, 
            setUserProfile,
            setIsLaoding,
            }}
        >
            {isLoading ? loader() : Children}
        </AppUtilsContext.Provider>
       
    );
};
export const myAppHook =()=>{
    const context =useContext(AppUtilsContext);
    if(!context){
        throw new Error("App Utils functions must be wrapped in AppUtilsProvider");
    }
    return context;

}