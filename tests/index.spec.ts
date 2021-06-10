describe("", () => {
  let i18nFilesDirPath: string;
  let langFilePath: string = null;
  let invalidPath: string = null;
  let path: any;

  let setUp: (config: any) => void;
  let load: () => void;
  let i18n: (
    key: string,
    lang?: string,
    props?: {
      [k: string]: any;
    }
  ) => string;

  let setDefaultLang: (lang: string) => void;

  beforeEach(() => {
    return Promise.all([import("path"), import("../src")]).then(
      ([pathModule, libModule]) => {
        path = pathModule;
        setUp = libModule.setUp;
        load = libModule.load;
        i18n = libModule.i18n;
        setDefaultLang = libModule.setDefaultLang;

        i18nFilesDirPath = path.join(__dirname, "i18n");
        langFilePath = path.join(i18nFilesDirPath, "en.json");
        invalidPath = path.join(i18nFilesDirPath, "invalid");
      }
    );
  });
  afterEach(() => {
    jest.resetModules();
  });
  describe('The "setUp" function', () => {
    describe("should throw an error", () => {
      it("when called with no parameter or with a parameter that is falsy", () => {
        const expectedErrMsg =
          'The "setUp" function must be called with a parameter representing the configuration. The configuration must be an object with "path", "languages" and "defaultLanguage" attributes.';
        // @ts-ignore
        expect(() => setUp()).toThrow(expectedErrMsg);
        expect(() => setUp(undefined)).toThrow(expectedErrMsg);
        expect(() => setUp(null)).toThrow(expectedErrMsg);
      });

      it("when called with a parameter that is not an object", () => {
        const expectedErrMsg =
          'Invalid config ! The config must be an object with "path", "languages" and "defaultLanguage" attributes.';
        // @ts-ignore
        expect(() => setUp("22")).toThrow(expectedErrMsg);
        // @ts-ignore
        expect(() => setUp(22)).toThrow(expectedErrMsg);
      });

      it('when called with an object that does not contain the "path", "languages" and "defaultLanguage" attribute', () => {
        const expectedErrMsg =
          'Invalid config ! The config must be an object with "path", "languages" and "defaultLanguage" attributes.';
        // @ts-ignore
        expect(() => setUp({})).toThrow(expectedErrMsg);
        // @ts-ignore
        expect(() => setUp({ path: "" })).toThrow(expectedErrMsg);
        expect(() =>
          setUp({ path: i18nFilesDirPath, languages: ["en"] })
        ).not.toThrow(expectedErrMsg);
      });
      it("when the path to the folder containing the translation files is not specified", () => {
        const expectedErrMsg =
          'The "path" to the translation files directory is required.';
        expect(() => setUp({ path: null, languages: ["en"] })).toThrow(
          expectedErrMsg
        );
      });
      it('when the "path" is not a directory', () => {
        const expectedErrMsg = `"${langFilePath}" is not a directory.`;
        expect(() => setUp({ path: langFilePath, languages: ["en"] })).toThrow(
          expectedErrMsg
        );
      });

      it('when the "path" is not a valid path', () => {
        expect(() => setUp({ path: invalidPath, languages: ["en"] })).toThrow();
      });

      it('when the "languages" is not specified in the config', () => {
        const expectedErrMsg = 'The "languages" is required';
        expect(() =>
          setUp({ path: i18nFilesDirPath, languages: null })
        ).toThrow(expectedErrMsg);
      });

      it('when the value of "languages" is not an array', () => {
        const expectedErrMsg = 'The "languages" must be an array.';
        expect(() => {
          //@ts-ignore
          setUp({ path: i18nFilesDirPath, languages: 2 });
        }).toThrow(expectedErrMsg);
      });

      it('when the value of "languages" is an empty array', () => {
        const expectedErrMsg =
          'The "languages" can not be an empty array. You must specify at least one language.';
        expect(() => setUp({ path: i18nFilesDirPath, languages: [] })).toThrow(
          expectedErrMsg
        );
      });

      it('when the value of "languages" is not an array of string', () => {
        const expectedErrMsg = 'The "languages" must be an array of string.';
        expect(() => {
          //@ts-ignore
          setUp({ path: i18nFilesDirPath, languages: ["en", 2] });
        }).toThrow(expectedErrMsg);
      });

      it('when the "defaultLanguage" is not a string', () => {
        const expectedErrMsg = 'The "defaultLanguage" must be a string.';
        expect(() => {
          setUp({
            path: i18nFilesDirPath,
            languages: ["en", "fr"],
            //@ts-ignore
            defaultLanguage: 2,
          });
        }).toThrow(expectedErrMsg);
      });

      it('when the "defaultLanguage" is not a string in the "languages" array', () => {
        const languages = ["en", "fr"];
        const expectedErrMsg = `The "defaultLanguage" must take one of the following values : "${languages.join(
          '", "'
        )}".`;
        expect(() => {
          setUp({
            path: i18nFilesDirPath,
            languages,
            defaultLanguage: "es",
          });
        }).toThrow(expectedErrMsg);
      });
      /* 







*/
    });
    // it("", () => {});
    /* it("", () => {});
    it("", () => {});

    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {});
    it("", () => {}); */
  });

  describe('The "load" function', () => {
    describe("should throw an error", () => {
      it('when it is not called after the "setUp" function', () => {
        const expectedErrMsg =
          'No config found ! Please call the "setUp" function to set the config before calling the "load" function.';
        expect(() => load()).toThrow(expectedErrMsg);
      });

      it('when a json file corresponding to a language specified in the "languages" attribute of the config is not found', () => {
        const filePath = path.join(i18nFilesDirPath, "es.json");
        const expectedErrMsg = `The file "${filePath}" doesn't exist.`;
        setUp({ path: i18nFilesDirPath, languages: ["en", "es", "fr"] });
        expect(() => load()).toThrow(expectedErrMsg);
      });

      it('when the path to a json file corresponding to a language specified in the "languages" attribute of the config is not a file path', () => {
        const expectedErrMsg = `The path "${path.join(
          i18nFilesDirPath,
          "it.json"
        )}" is not a valid file path.`;
        setUp({ path: i18nFilesDirPath, languages: ["en", "it", "fr"] });
        expect(() => load()).toThrow(expectedErrMsg);
      });

      it("when a json file corresponding to a language does not contains a valid json", () => {
        // const filePath = path.join(i18nFilesDirPath, "ch.json");
        // const expectedErrMsg = `An error happened when parsing the file ${"ch"}.json (${filePath}).`;
        setUp({ path: i18nFilesDirPath, languages: ["en", "ch", "fr"] });
        // const spy = jest.spyOn(console, "log");
        // expect(spy).toHaveBeenCalledWith(expectedErrMsg);
        expect(() => load()).toThrow("SyntaxError:");
      });
    });
  });

  describe('The "setDefaultLang" function', () => {
    describe("should throw an error", () => {
      it('when it is not called after the "setUp" function', () => {
        const expectedErrMsg =
          'No config found ! Please call the "setUp" function to set the config before calling the "setDefaultLang" function.';
        expect(() => setDefaultLang("fr")).toThrow(expectedErrMsg);
      });

      it('when it is not called after the "setUp" and "load" functions called', () => {
        setUp({ path: i18nFilesDirPath, languages: ["en", "fr"] });

        const expectedErrMsg =
          'Translation files are not yet loaded. Please call the "load" function to load the translation files before calling the "setDefaultLang" function.';
        expect(() => setDefaultLang("fr")).toThrow(expectedErrMsg);
      });

      it("when called with no parameter or with a parameter that is falsy", () => {
        setUp({ path: i18nFilesDirPath, languages: ["en", "fr"] });
        load();
        const expectedErrMsg =
          "The value of the new default language is required.";
        // @ts-ignore
        expect(() => setDefaultLang()).toThrow(expectedErrMsg);
        expect(() => setDefaultLang(undefined)).toThrow(expectedErrMsg);
        expect(() => setDefaultLang(null)).toThrow(expectedErrMsg);
      });

      it("when called with a parameter that is not a string", () => {
        setUp({ path: i18nFilesDirPath, languages: ["en", "fr"] });
        load();
        const expectedErrMsg =
          "The value of the new default language must be a string.";
        // @ts-ignore
        expect(() => setDefaultLang(22)).toThrow(expectedErrMsg);
        // @ts-ignore
        expect(() => setDefaultLang(true)).toThrow(expectedErrMsg);
      });

      it('called with a value that is not in the "languages" array of the config', () => {
        const languages = ["en", "fr"];
        setUp({ path: i18nFilesDirPath, languages });
        load();
        const expectedErrMsg = `The new default language is invalid. The new default language must take one of the following values : "${languages.join(
          '", "'
        )}".`;
        expect(() => setDefaultLang("it")).toThrow(expectedErrMsg);
        expect(() => setDefaultLang("fr")).not.toThrow(expectedErrMsg);
        expect(() => setDefaultLang("en")).not.toThrow(expectedErrMsg);
      });
    });
  });

  describe('The "i18n" function', () => {
    describe("should throw an error", () => {
      it('when it is not called after the "setUp" function', () => {
        const expectedErrMsg =
          'No config found ! Please call the "setUp" function to set the config before calling the "i18n" function.';
        expect(() => i18n("fr")).toThrow(expectedErrMsg);
      });

      it('when it is not called after the "setUp" and "load" functions called', () => {
        setUp({ path: i18nFilesDirPath, languages: ["en", "fr"] });

        const expectedErrMsg =
          'Translation files are not yet loaded. Please call the "load" function to load the translation files before calling the "i18n" function.';
        expect(() => i18n("fr")).toThrow(expectedErrMsg);
      });

      it('when the third parameter of the "i18n" is defined but is not an object', () => {
        setUp({
          path: i18nFilesDirPath,
          languages: ["en", "fr"],
          defaultLanguage: "fr",
        });
        load();
        const expectedErrMsg =
          'The third parameter of the "i18n" function must be an object (i.e a key-value pair).';
        // @ts-ignore
        expect(() => i18n("i_x_years", null, 2)).toThrow(expectedErrMsg);
      });
    });

    it("Should not throw error when the config is valid", () => {
      setUp({ path: i18nFilesDirPath, languages: ["en", "fr"] });
      load();
      expect(() => i18n("username")).not.toThrow();
    });

    it("Should return the right translation", () => {
      setUp({
        path: i18nFilesDirPath,
        languages: ["en", "fr"],
      });
      load();
      expect(i18n("username", "fr")).toBe("Nom d'utilisateur");
      expect(i18n("username", "en")).toBe("Username");
    });

    it("Should return the translation key when no corresponding tranlation is found", () => {
      setUp({
        path: i18nFilesDirPath,
        languages: ["en", "fr"],
      });
      load();
      expect(i18n("hello_world", "fr")).toBe("hello_world");
      expect(i18n("hello_world", "en")).toBe("hello_world");
    });

    it("Should return the right translation with the right string interpolation", () => {
      const age = 12;
      const name = "Ghost";

      const str1Fr = `J'ai ${age} ans.`;
      const str1En = `I am ${age} old.`;

      const str2Fr = `age: ${age} Nom: ${name} age: ${age}.`;
      const str2En = `age: ${age} Name: ${name} age: ${age}.`;

      setUp({ path: i18nFilesDirPath, languages: ["en", "fr"] });
      load();

      expect(i18n("i_x_years", "fr", { age })).toBe(str1Fr);
      expect(i18n("i_x_years", "en", { age })).toBe(str1En);

      expect(i18n("test", "fr", { age, name })).toBe(str2Fr);
      expect(i18n("test", "en", { age, name })).toBe(str2En);
    });

    it('Should translate to the "defaultLanguage" when no language is specified when calling the "i18n" function', () => {
      const age = 12;
      const strFr = `J'ai ${age} ans.`;

      setUp({
        path: i18nFilesDirPath,
        languages: ["en", "fr"],
        defaultLanguage: "fr",
      });
      load();
      expect(i18n("i_x_years", null, { age })).toBe(strFr);
      expect(i18n("username", null)).toBe("Nom d'utilisateur");
    });

    it('Should update the default language when the "setDefaultLang" function is called', () => {
      const age = 12;
      const strFr = `J'ai ${age} ans.`;
      const strEn = `I am ${age} old.`;

      setUp({
        path: i18nFilesDirPath,
        languages: ["en", "fr"],
        defaultLanguage: "fr",
      });
      load();

      setDefaultLang("fr");
      expect(i18n("i_x_years", null, { age })).toBe(strFr);
      expect(i18n("username", null)).toBe("Nom d'utilisateur");

      setDefaultLang("en");
      expect(i18n("i_x_years", null, { age })).toBe(strEn);
      expect(i18n("username", null)).toBe("Username");
    });
  });
});
