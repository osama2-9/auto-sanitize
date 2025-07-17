"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  autoSanitize: () => autoSanitize
});
module.exports = __toCommonJS(src_exports);

// src/utils.ts
function sanitizeString(str, config, fieldName) {
  if (!str || typeof str !== "string") {
    return config.allowEmptyStrings ? "" : null;
  }
  if (config.ignoreFields?.includes(fieldName || "")) {
    return str;
  }
  if (config.sanitizeOnlyFields?.length && !config.sanitizeOnlyFields.includes(fieldName || "")) {
    return str;
  }
  let result = str;
  if (config.trimStrings) {
    result = result.trim();
  }
  if (config.removeHTML) {
    result = result.replace(/<[^>]*>/g, "");
  }
  if (config.escapeQuotes) {
    result = result.replace(/['"]/g, "");
  }
  if (config.removeEmojis) {
    result = result.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "");
  }
  if (config.removeUnicodeControl) {
    result = result.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  }
  if (config.blockScriptKeywords) {
    result = result.replace(/script/gi, "");
  }
  if (config.blockedPatterns) {
    config.blockedPatterns.forEach((pattern) => {
      result = result.replace(pattern, "");
    });
  }
  if (config.stripSQLMeta) {
    result = result.replace(/[*;]/g, "").replace(/--/g, "");
  }
  if (config.lowercaseEmails && fieldName === "email") {
    result = result.toLowerCase();
  }
  if (config.normalizeFields?.includes(fieldName || "")) {
    result = result.toLowerCase();
  }
  if (config.unicodeNormalizeForm) {
    result = result.normalize(config.unicodeNormalizeForm);
  }
  if (config.allowedChars) {
    result = result.split("").filter((char) => config.allowedChars.test(char)).join("");
  }
  if (config.collapseWhitespace) {
    result = result.replace(/\s+/g, " ");
  }
  if (!result.trim() && !config.allowEmptyStrings) {
    return null;
  }
  if (config.maxStringLength && result.length > config.maxStringLength) {
    const shouldTruncate = !(fieldName === "email" || config.stripSQLMeta && result.includes("SELECT"));
    if (shouldTruncate) {
      result = result.substring(0, config.maxStringLength);
    }
  }
  return result;
}
function cleanObject(obj, config) {
  if (obj === null || obj === void 0) {
    return obj;
  }
  if (Array.isArray(obj)) {
    if (!config.sanitizeArrays) {
      return obj;
    }
    return obj.map((item) => cleanObject(item, config)).filter((item) => item !== null);
  }
  if (typeof obj === "string") {
    return sanitizeString(obj, config);
  }
  if (typeof obj === "object") {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = typeof value === "string" ? sanitizeString(value, config, key) : cleanObject(value, config);
      if (cleanedValue !== null) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }
  return obj;
}

// src/index.ts
var defaultConfig = {
  trimStrings: true,
  removeHTML: true,
  lowercaseEmails: true,
  escapeQuotes: true,
  stripSQLMeta: true,
  blockScriptKeywords: true,
  sanitizeArrays: true,
  allowEmptyStrings: false,
  maxStringLength: 500,
  normalizeFields: [],
  ignoreFields: [],
  removeEmojis: false,
  removeUnicodeControl: false,
  unicodeNormalizeForm: "NFC",
  blockedPatterns: [],
  allowedChars: /./,
  sanitizeOnlyFields: [],
  collapseWhitespace: false
};
function autoSanitize(userConfig) {
  const config = { ...defaultConfig, ...userConfig };
  return function(req, res, next) {
    ["body", "query", "params"].forEach((key) => {
      const original = req[key];
      if (original) {
        const cleaned = cleanObject(original, config);
        if (Array.isArray(original)) {
          original.length = 0;
          original.push(...cleaned);
        } else if (typeof original === "object") {
          Object.assign(original, cleaned);
        }
      }
    });
    next();
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  autoSanitize
});
