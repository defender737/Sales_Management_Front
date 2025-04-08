import { Cookies } from "react-cookie";

interface Cookie {
    cookieName: string;
    value: string;
    options? : any
}


const cookies = new Cookies();

export const setCookie = ({cookieName, value, options} : Cookie) => {
    return cookies.set(cookieName, value, {...options});
}

export const getCookie = (cookieName: string) => {
    return cookies.get(cookieName);
}