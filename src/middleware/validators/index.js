const validateRegisterUser = (data) => {
    const { name, email, password } = data;

    if (!name) return { success: false, message: "Name is required." };
    if (!email) return { success: false, message: "Email is required." };
    if (!password) return { success: false, message: "Password is required." };

    return { success: true };
};

const validateLoginUser = (data) => {
    const { email, password } = data;

    if (!email) return { success: false, message: "Email is required." };
    if (!password) return { success: false, message: "Password is required." };

    return { success: true };
};

module.exports = {
    validateRegisterUser,
    validateLoginUser,
};
