export const insertMaskInPhone = (phone: string): string => {
    if (phone) {
        const noMask = phone.replace(/\D/g, '').slice(0,11);
        const { length } = noMask;

        if (length <= 11) {
            if (length <= 10) {
                return noMask
                    .replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                return noMask
                    .replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2');
            }
        }
        return phone;
    }
    return '';
}