const i18nLib = require("@rblmdt/i18n-lib");
const path = require("path");
const { i18n, load, setUp } = i18nLib;

setUp({ languages: ["fr", "en"], path: path.join(__dirname, "translates") });
load();

console.log(i18n("username")); // Nom d'utilisateur
console.log(i18n("username", "en")); // Username
console.log(i18n("great", "en", { name: "Anonymous" })); // Hello Anonymous
