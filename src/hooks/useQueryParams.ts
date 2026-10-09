import { useSearchParams } from "next/navigation";


/**
 * @returns URLSearchParams object
 * @description This hook returns a new URLSearchParams object
 *              unless the useSearchparams hook it's readonly but this is editable 
 *              use this hook when you need to push or replace params in the URL  
 */
export const useQueryParams = () => {
    const Params = useSearchParams()
    const searchParams = new URLSearchParams(Params.toString())
    return searchParams
}

