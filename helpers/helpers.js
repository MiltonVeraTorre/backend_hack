export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const generarId = () => {
    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);
    return random + fecha;
};
