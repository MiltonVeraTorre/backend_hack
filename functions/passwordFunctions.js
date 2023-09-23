import bcrypt from 'bcrypt';
export async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
}
