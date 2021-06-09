import * as path from "path";
import * as fs from "fs";

interface Config {
  path: string;
  languages: string[];
  defaultLanguage?: string;
}

const lib: {
  _config: Config;
  _langData: { [k: string]: { [k: string]: string } };
  _fileLoaded: boolean;
} = {
  _config: null,
  _langData: null,
  _fileLoaded: false,
};

export const setUp = (config: Config) => {
  // validate config
  if (!config) {
    throw new Error(
      `The "setUp" function must be called with a parameter representing the configuration. The configuration must be an object with "path", "languages" and "defaultLanguage" attributes.`
    );
  }
  if (!(typeof config === "object")) {
    throw new Error(
      `Invalid config ! The config must be an object with "path", "languages" and "defaultLanguage" attributes.`
    );
  }

  if (!("path" in config) || !("languages" in config)) {
    throw new Error(
      `Invalid config ! The config must be an object with "path", "languages" and "defaultLanguage" attributes.`
    );
  }
  const { path: i18nFilesDirpath, languages, defaultLanguage } = config;

  validateI18nFilesDirPath(i18nFilesDirpath);

  validateLanguages(languages);

  validateDefaultLangage(defaultLanguage, languages);

  lib._config = { path: i18nFilesDirpath, languages, defaultLanguage };
};

function validateI18nFilesDirPath(i18nFilesDirpath: string) {
  if (!i18nFilesDirpath) {
    throw new Error(
      `The "path" to the translation files directory is required.`
    );
  } else {
    try {
      if (!fs.statSync(i18nFilesDirpath).isDirectory()) {
        throw new Error(`"${i18nFilesDirpath}" is not a directory.`);
      }
    } catch (error) {
      console.log(
        `The file or directory "${i18nFilesDirpath}" does not exist.`
      );
      throw error;
    }
  }
}

function validateLanguages(languages: string[]) {
  if (!languages) {
    throw new Error(`The "languages" is required`);
  } else if (!Array.isArray(languages)) {
    throw new Error(`The "languages" must be an array.`);
  } else if (!languages.length) {
    throw new Error(
      `The "languages" can not be an empty array. You must specify at least one language.`
    );
  } else {
    const containsNonString = languages.some(
      (langKey) => typeof langKey !== "string"
    );
    if (containsNonString) {
      throw new Error(`The "languages" must be an array of string.`);
    }
  }
}

function validateDefaultLangage(defaultLanguage: string, languages: string[]) {
  if (defaultLanguage) {
    if (typeof defaultLanguage !== "string") {
      throw new Error(`The "defaultLanguage" must be a string.`);
    } else if (!languages.includes(defaultLanguage)) {
      throw new Error(
        `The "defaultLanguage" must take one of the following values : "${languages.join(
          '", "'
        )}".`
      );
    }
  }
}

export const load = () => {
  // validate config
  if (!lib._config) {
    throw new Error(
      `No config found ! Please call the "setUp" function to set the config before calling the "load" function.`
    );
  }

  const { path: i18nFilesDirpath, languages } = lib._config;
  const translationsInfos = languages.map((langkey) => ({
    langkey,
    path: path.join(i18nFilesDirpath, `${langkey}.json`),
  }));
  // check that all the json languages files exist
  for (let translationInfo of translationsInfos) {
    let fileStat;
    try {
      fileStat = fs.statSync(translationInfo.path);
    } catch (error) {
      throw new Error(`The file "${translationInfo.path}" doesn't exist.`);
    }
    if (!fileStat.isFile()) {
      throw new Error(
        `The path "${translationInfo.path}" is not a valid file path.`
      );
    }
  }

  lib._langData = {};
  // load each files content
  translationsInfos.forEach((info) => {
    // if the content is not already loaded
    if (!(info.langkey in lib._langData)) {
      const rawData = fs.readFileSync(info.path);
      try {
        const langData = JSON.parse(rawData.toString());
        lib._langData[info.langkey] = langData;
        console.log(`File "${info.langkey}.json" loaded.`);
      } catch (error) {
        console.log(
          `An error happened when parsing the file ${info.langkey}.json (${info.path}).`
        );
        throw new Error(error);
      }
    }
  });
  lib._fileLoaded = true;
  // use the first language default if not specified
  if (!lib._config.defaultLanguage) {
    lib._config.defaultLanguage = lib._config.languages[0];
    console.log(
      `No default language specified. The default language will be "${languages[0]}"`
    );
  }

  console.log("Language files loaded successfully.");
  console.log(
    `Available Languages : ["${lib._config.languages.join('", "')}"].`
  );
  console.log(`Default Language : "${lib._config.defaultLanguage}".`);
};

export const i18n = (
  key: string,
  lang?: string,
  props?: { [k: string]: any }
) => {
  if (!lib._config) {
    throw new Error(
      `No config found ! Please call the "setUp" function to set the config before calling the "i18n" function.`
    );
  }
  if (!lib._fileLoaded) {
    throw new Error(
      `Translation files are not yet loaded. Please call the "load" function to load the translation files before calling the "i18n" function.`
    );
  }

  const i18nLang =
    !lang || (lang && !lib._config.languages.includes(lang))
      ? lib._config.defaultLanguage
      : lang;
  let translatedString = lib._langData[i18nLang][key];
  if (translatedString) {
    if (props) {
      if (typeof props !== "object") {
        throw new Error(
          `The third parameter of the "i18n" function must be an object (i.e a key-value pair).`
        );
      }

      for (let key in props) {
        translatedString = translatedString.replace(
          new RegExp(`{{${key}}}`, "g"),
          props[key]
        );
      }
    }
    return translatedString;
  }
  return key;
};

export const setDefaultLang = (lang: string) => {
  if (!lib._config) {
    throw new Error(
      `No config found ! Please call the "setUp" function to set the config before calling the "setDefaultLang" function.`
    );
  }
  if (!lib._fileLoaded) {
    throw new Error(
      `Translation files are not yet loaded. Please call the "load" function to load the translation files before calling the "setDefaultLang" function.`
    );
  }

  if (!lang) {
    throw new Error("The value of the new default language is required.");
  }
  if (typeof lang !== "string") {
    throw new Error("The value of the new default language must be a string.");
  } else if (!lib._config.languages.includes(lang)) {
    throw new Error(
      `The new default language is invalid. The new default language must take one of the following values : "${lib._config.languages.join(
        '", "'
      )}".`
    );
  }
  lib._config.defaultLanguage = lang;
};
