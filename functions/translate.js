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

function keysWithTranslationsToCsv(data) {
  const header = ["key", ...Object.keys(data[Object.keys(data)[0]])];
  return objectToCsv(data, header);
}

function objectToCsv(data, header) {
  const csv = [header.join(";")];

  for (let key in data) {
    const row = [key];
    for (let lang of header.slice(1)) {
      row.push(data[key][lang]);
    }
    csv.push(row.join(";"));
  }

  return csv.join("\n");
}

module.exports = {
  flattenTranslations,
  getKeysWithTranslations,
  keysWithTranslationsToCsv,
};
