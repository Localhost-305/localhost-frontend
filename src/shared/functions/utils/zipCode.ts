import axios from "axios";

export const insertMaskInZipCode = (zipCode: string): string => {
    if(zipCode){
        let sanitizedZipCode = zipCode.replace(/\D/g, '');
        return sanitizedZipCode.replace(/(\d{5})(\d{0,3}).*/, '$1-$2');
    }
    return '';
}

export interface Address {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    ddd: string;
}

export const getDataByZipCode = async (zipCode: string): Promise<Address> => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching address:', error);
        throw error;
    }
}