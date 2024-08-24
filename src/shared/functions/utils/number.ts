export const insertMaskInNumber3 = (value:string | number): string => {
    if(value){
        return String(value)
            .replace(/\D/g, '')
            //.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            .replace(/(\d+)(\d{3})$/, '$1,$2');
    }
    return '';
}

export function formatNumber(input: any): string {
    let valorStr: string = String(input);

    valorStr = valorStr.replace(/[^\d.]/g, '');
    valorStr = valorStr.replace('.', ',');

    let partes: string[] = valorStr.split(',');

    if (partes.length > 1) {
        partes[1] = partes[1].padEnd(3, '0').slice(0, 3);
    } else {
        partes.push('000');
    }

    return partes.join(',');
}

export function formatNumberToKgIf3Decimal(input: number): string {
    let gramsPerKilogram = 1000;
    let numberFormat = input/gramsPerKilogram;
    let valorStr: string = String(numberFormat);

    valorStr = valorStr.replace(/[^\d.]/g, '');
    valorStr = valorStr.replace('.', ',');

    let partes: string[] = valorStr.split(',');

    if (partes.length > 1) {
        partes[1] = partes[1].padEnd(3, '0').slice(0, 3);
    } else {
        partes.push('000');
    }

    return partes.join(',');
}