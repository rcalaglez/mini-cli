const fs = require("fs");
const { NEW, MODIFIED } = require("../utils/constants");

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

function getKeysComparison(keysWithTranslations, previousData) {
  const comparison = {};

  for (let key in keysWithTranslations) {
    if (!previousData[key]) {
      keysWithTranslations[key].state = NEW;
      comparison[key] = keysWithTranslations[key];
    } else {
      for (let lang in keysWithTranslations[key]) {
        if (keysWithTranslations[key][lang] !== previousData[key][lang]) {
          keysWithTranslations[key].state = MODIFIED;
          comparison[key] = keysWithTranslations[key];
          break;
        }
      }
    }
  }

  return comparison;
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
  const header = ["key"];

  header.push("es", "en", "state");
  return objectToCsv(data, header);
}

function objectToCsv(data, header) {
  const csv = [header.join(";")];

  console.log("headers", csv);

  for (let key in data) {
    const row = [key];
    for (let lang of header.slice(1, -1)) {
      row.push(data[key][lang] || "");
    }
    row.push(data[key].state);
    csv.push(row.join(";"));
  }

  return csv.join("\n");
}

function csvToObject(csvData) {
  const lines = csvData.split("\n");
  const header = lines[0].split(";");

  const data = {};

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(";");
    const entry = {};

    for (let j = 1; j < header.length; j++) {
      entry[header[j]] = values[j];
    }

    data[values[0]] = entry;
  }

  return data;
}

module.exports = {
  flattenTranslations,
  getKeysWithTranslations,
  keysWithTranslationsToCsv,
  csvToObject,
  getKeysComparison,
};
