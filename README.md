Simple internationalization library for Node.JS

## Install

`npm install `

## Usage

1 - Create a translation folder and files
Start by creating a folder that will contains the translation files
A transalation file is a json file which contains a key-value pairs
the key represent the translation key which will later be passed to the translation function
the value represent the translated text

By assuming that we want to support English and French and we want to put our translation files under the folder `i18n` let's create the `en.json` and `fr.json` files

```json
// i18n/en.json
{
  "username": "Username",
  "i_x_years": "I am {{age}} old.",
  "test": "age: {{age}} Name: {{name}} age: {{age}}."
}
// i18n/fr.json
{
  "username": "Nom d'utilisateur",
  "i_x_years": "J'ai {{age}} ans.",
  "test": "age: {{age}} Nom: {{name}} age: {{age}}."
}
```

2 - Configure and load translation files

Now we have to tell the library where to find the translation files and the supported languages.
We do that by calling the `setup()` function

The setup function take as a parameter a configuration that is an simple Javascript Object
with the following schema

```ts
interface Config {
  path: string;
  languages: string[];
  defaultLanguage?: string;
}
```

- `path`: the absolute path to folder that contains the translation files
- `languages`: the array of the supported languages, eg: `["en", "fr", "it"]`. A translation file should be present in the `path` for each supported language.
- `defaultLanguage`: the language into which to translate when the i18n is called without specifying a language. If not specified its value will be the first item of the `languages` array.

After the setup is done you have to call the `load()` function which will load the translation files.

```js
// index.js
import * as path from "path";
import { setUp, load, i18n } from "__";

const config = {
  path: path.join(__dirname, "i18n"),
  languages: ["en", "fr"],
  defaultLanguage: "en",
};
// set up the library
setUp(config);

// load the translation files
load();

// translation
i18n("username"); // "Username"
i18n("username", "fr"); // "Nom d'utilisateur"

i18n("i_x_years", "en", { age: 10 }); // "I am 10 old."
```

3 - translation

As you may have already noticed it in the previous snippet, after the setup and the translation files loaded you just have to call the `i18n()` function with one of the translation key you have defined in the translation files and the desired language key (not required) to get the translated text.

```js
// simple text sepecifying the language
// i.e default language will be used
i18n("username"); // "Username"

// simple text by sepecifying the language
i18n("username", "fr"); // "Nom d'utilisateur"

// translation by passing dynamic values
i18n("i_x_years", "en", { age: 10 }); // "I am 10 old."
```

4 - Change the default language

After the setup you can call the `setDefaultLanguage()` function at any time during the application execution to update the default language.

```js
// index.js
import * as path from "path"
import { setUp, load, i18n } from "__"

const config = {
  path: path.join(__dirname, "i18n");
  languages: ["en", "fr"];
  defaultLanguage: "en";
}
// set up the library
setUp(config)

// load the translation files
load()

// translation
i18n("username") // "Username"

setDefaultLanguage("fr")
i18n("username") // "Nom d'utilisateur"

setDefaultLanguage("en")
i18n("username") // "Username"
```

## Functions signatures

- `setUp : (config: { path: string; languages: string[]; defaultLanguage?: string }) => void`

  Should be called to set up the library.

  Throws error when the config is invalid.

- `load : () => void`

  Should be called just after the `setUp()` function.

  Throws error :

  - when called before the `setUp()` function
  - when a translation file is not found
  - when a translation file is invalid

- `i18n : (key: string, lang?: string, props?: { [k: string]: any }) => string`

  Should be called just after the `setUp()` and `load()` functions.

## Examples
