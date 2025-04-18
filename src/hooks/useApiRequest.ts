import { useState } from 'react'
import axios from 'axios';

type ApiFunc<T, Args extends any[]> = (...args : Args) => Promise<T>;
type OnSuccess<T> = (data : T) => void;
type OnError = (message : string) => void;

interface UseApiRequestOptions {
    delay? : boolean;
    minDelay?: number;
}

export const useApiRequest = <T, Args extends any[]>(
    apiFunc : ApiFunc<T, Args>,
    onSuccess ?: OnSuccess<T>,
    onError ?: OnError,
    options? : UseApiRequestOptions
) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState<T | null>(null);

    const request = async (...args : Args) : Promise<T | undefined> => {
        const startTime = Date.now();
        setLoading(true);
        setSuccess(false);
        try{
            const response = await apiFunc(...args);
            await new Promise((res) => setTimeout(res, intentionalDelay(startTime, options)))
            setSuccess(true);
            onSuccess?.(response);
            setData(response);
            return response;
        } catch (error){
            if(axios.isAxiosError(error)){
                const message = error.response?.data.details || "요청 실패";
                onError?.(message);
            }
        }finally {
            setLoading(false);
        }
    };
    
    const reset = () => {
        setLoading(false);
        setSuccess(false);
        setData(null);
    }
    return {request, loading, success, data, reset};
};

// 의도적 최소 지연시간 설정
const intentionalDelay = (startTime : number, options: UseApiRequestOptions | undefined) => {
    if(options?.delay){
        const elapsed = Date.now() - startTime;
        return Math.max(0, (options?.minDelay || 500) - elapsed);
    }
}