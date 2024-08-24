export const formatDateTime = (dateISO: string): string => {
    if(dateISO){
        const date = new Date(dateISO);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
    
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconts = date.getSeconds().toString().padStart(2, '0');
    
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconts}`;
    }
    return '';
}

export const formatDate = (dateISO: string): string => {
    if(dateISO){
        const date = new Date(dateISO);

        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
    
        return `${day}/${month}/${year}`;
    }
    return '';
}