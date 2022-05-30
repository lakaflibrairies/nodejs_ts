import env from "../env";
const customConsole = {
    log(message, ...optionalParams) {
        if (env.mode === "production") {
            console.log(message, ...optionalParams);
        }
        return;
    },
    error(message, ...optionalParams) {
        if (env.mode === "production") {
            console.error(message, ...optionalParams);
        }
        return;
    },
};
export default customConsole;
