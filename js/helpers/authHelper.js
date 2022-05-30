const auth = {
    extractToken(authorization) {
        return authorization
            .replace(".super_salt.", "")
            .replace("lakaf-token", "")
            .trim();
    },
};
export default auth;
