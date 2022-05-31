"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../env"));
const mailTemplate = {
    signup: {
        default(code) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code d'activation</title>
</head>
<body>
    Bienvenue sur Nkoulouloun Market, la plateforme en pleine croissance et dotée d'une communauté diversifiée dans tous les sens. <br><br>
    Confirmez votre inscription en entrant le code ci-dessous.
    <br />
    <br />
    <strong>${code}</strong>
    <br />
    <br />
    À très bientôt sur <a href="${env_1.default.clientUrl}" onclick="window.open(this.href); return false;">NKOULOULOUN MARKET</a>.

</body>
</html>`;
        },
    },
    notConnected: {
        resetPassword(code) {
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code d'activation</title>
</head>
<body>
    Bienvenue sur Nkoulouloun Market. <br><br>
    Utilisez le code ci-dessous pour réinitialiser votre mot de passe.
    <br />
    <br />
    <strong>${code}</strong>
    <br />
    <br />
    À très bientôt sur <a href="${env_1.default.clientUrl}" onclick="window.open(this.href); return false;">NKOULOULOUN MARKET</a>.

</body>
</html>`;
        }
    }
};
exports.default = mailTemplate;
