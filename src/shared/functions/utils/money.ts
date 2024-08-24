export const convertNumberToMoney = (value: number): string => {
    if(value >= 0){
        return value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    }
    return '';
};