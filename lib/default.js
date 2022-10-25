const defaultOptions = {
  customLog: 'Error',
  exclude: ['node_modules'],
  include: [],
};

const tryTemplate = `
try {
} catch (e) {
  console.log(CatchError, e)
}`;

module.exports = {
  defaultOptions,
  tryTemplate,
};
