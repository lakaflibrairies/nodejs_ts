import mailTemplate from "./mailTemplateHelper";
import phone from "./phoneHelper";
import mail from "./mailHelper";
import auth from "./authHelper";
import logs from "./logsHelper";
import customConsole from "./customConsoleHelper";
const helpers = {
    generateKey(length) {
        var result = "";
        const dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            result += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
        }
        return result;
    },
    mail,
    phone,
    mailTemplate,
    auth,
    logs,
    customConsole
};
export default helpers;
