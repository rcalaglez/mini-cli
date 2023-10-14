const fs = require("fs");

function getKeysWithTranslations(translationPaths) {
  let result = {};

  for (let lang in translationPaths) {
    const translations = JSON.parse(
      fs.readFileSync(translationPaths[lang], "utf-8")
    );
    const flattened = flattenTranslations(translations);

    for (let key in flattened) {
      if (!result[key]) result[key] = {};
      result[key][lang] = flattened[key];
    }
  }

  return result;
}

function flattenTranslations(data, parentKey = "") {
  let entries = {};

  for (let key in data) {
    if (typeof data[key] === "object") {
      const childEntries = flattenTranslations(
        data[key],
        `${parentKey}${key}.`
      );

      entries = { ...entries, ...childEntries };
    } else {
      entries[`${parentKey}${key}`] = data[key];
    }
  }

  return entries;
}

module.exports = { flattenTranslations, getKeysWithTranslations };
