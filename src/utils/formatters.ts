export const formatMonto = (value: string): string => {
    const numeros = value.replace(/\D/g, '');
    if (!numeros) return '';
    return new Intl.NumberFormat('es-CO').format(parseInt(numeros));
};

export const parseMonto = (value: string): number => {
    const numeros = value.replace(/\D/g, '');
    return numeros ? parseInt(numeros) : 0;
};