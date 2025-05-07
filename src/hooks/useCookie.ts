import { Cookies } from "react-cookie";

interface Cookie {
    cookieName: string;
    value: string;
    options?: any;
}

const cookies = new Cookies();

export const useCookie = () => {
    const setCookie = ({ cookieName, value, options }: Cookie) => {
        return cookies.set(cookieName, value, { ...options });
    };

    const getCookie = (cookieName: string) => {
        return cookies.get(cookieName);
    };

    return { setCookie, getCookie };
};