import { findByApiKey } from "../repositories/companyRepository";


export async function validateApiKeyFormat(apiKey: string){

    const bussines = await findByApiKey(apiKey);
    if(!bussines) {
        throw {type: "unauthorized" };
    }

}