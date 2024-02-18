const updateUserName = `UPDATE users SET username = ? WHERE id = ?;`;
const updateEmail = `UPDATE users SET email = ? WHERE id = ?;`;
const updatePassword = `UPDATE users SET password = ? WHERE id = ?;`;

export { updateUserName, updateEmail, updatePassword };
