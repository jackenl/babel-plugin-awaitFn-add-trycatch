const { defaultOptions } = require('./default');

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

function mergeOptions(options) {
  if (!options) {
    return defaultOptions;
  }

  const { exclude, include } = options;
  if (exclude) options.exclude = toArray(exclude);
  if (include) options.include = toArray(include);

  return Object.assign({}, defaultOptions, options);
}

function matchesFile(list, filename) {
  return list.find((name) => name && filename.includes(name));
}

const catchConsole = (filePath, funcName, customLog) => `
filePath: ${filePath}
funcName: ${funcName}
${customLog}:`;

module.exports = {
  toArray,
  mergeOptions,
  matchesFile,
  catchConsole,
};
