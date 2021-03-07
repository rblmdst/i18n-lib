import * as path from "path";
import * as fs from "fs";

interface Config {
  path: string;
  languages: string[];
  defaultLanguage: string;
}

const lib: {
  _config: Config;
  _langData: { [k: string]: { [k: string]: string } };
} = {
  _config: null,
  _langData: null,
};

export const setUp = (config: Config) => {
  const { path, languages, defaultLanguage } = config;
  lib._config = { path, languages, defaultLanguage };
};
export const load = () => {
  if (!lib._config) {
    throw new Error(
      "Not config found please call the setUp function to set the config before calling the load function"
    );
  }

  if (!(typeof lib._config === "object")) {
    throw new Error(
      "Invalid config, the confi must be an object with 'path', 'languages' and 'defaultLanguage' attributes"
    );
  }

  const { path: i18nFilesDirpath, languages, defaultLanguage } = lib._config;
  if (!i18nFilesDirpath) {
    throw new Error("The path is required");
  } else {
    try {
      if (!fs.statSync(i18nFilesDirpath).isDirectory()) {
        throw new Error("The path must be a path to a directory");
      }
    } catch (error) {
      console.log("file or directory does not exist");
      throw error;
    }
  }

  if (!languages) {
    throw new Error("The languages is required");
  } else if (!languages.length) {
    throw new Error("The languages is required");
  } else {
    const containsNonString = languages.some(
      (langKey) => typeof langKey !== "string"
    );
    if (containsNonString) {
      throw new Error("The languages is required");
    }
  }

  if (defaultLanguage) {
    if (typeof defaultLanguage !== "string") {
      throw new Error("The defaultLanguage must be a string");
    } else if (!languages.includes(defaultLanguage)) {
      throw new Error(
        "The defaultLanguage must take of the follwing values : ['en']"
      );
    }
  } else {
    // use the first lanaguage as default if not specified
    lib._config.defaultLanguage = lib._config.languages[0];
  }

  const translationsInfos = languages.map((langkey) => ({
    langkey,
    path: path.join(i18nFilesDirpath, `${langkey}.json`),
  }));
  // check that all the json languages files exist
  for (let translationInfo of translationsInfos) {
    try {
      if (!fs.statSync(translationInfo.path).isFile()) {
        throw new Error("fr.json is not a file");
      }
    } catch (error) {
      throw new Error("The file fr.json doesn't exist");
    }
  }

  lib._langData = {};
  // load each files content
  translationsInfos.forEach((info) => {
    if (!(info.langkey in lib._langData)) {
      const rawData = fs.readFileSync(info.path);
      try {
        const langData = JSON.parse(rawData.toString());
        lib._langData[info.langkey] = langData;
        console.log("File en.json loaded");
      } catch (error) {
        console.log("An error happened when parsing the file en.json.");
        throw new Error(error);
      }
    }
  });
  console.log("Language files successfully loaded.");
};
export const i18n = (key: string, lang?: string) => {
  if (!lib._config) {
    throw new Error(
      "Not config found please call the setUp function to set the config before calling the i18n function"
    );
  }

  const i18nLang =
    !lang || (lang && !lib._config.languages.includes(lang))
      ? lib._config.defaultLanguage
      : lang;

  // TODO: manage case props
  return lib._langData[i18nLang][key] || key;
};

export const setDefaultLang = (lang: string) => {
  if (!lang) {
    throw new Error("The new defaultlang is required");
  }
  if (typeof lang !== "string") {
    throw new Error("The  new defaultlang must be a string");
  } else if (!lib._config.languages.includes(lang)) {
    throw new Error("The lang must take of the follwing values : ['en']");
  }
  lib._config.defaultLanguage = lang;
};
