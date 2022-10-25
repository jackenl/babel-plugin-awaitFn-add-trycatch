const template = require('babel-template');
const { mergeOptions, matchesFile, catchConsole } = require('./utils');
const { tryTemplate } = require('./default');

module.exports = function (babel) {
  const types = babel.types;

  const visitor = {
    AwaitExpression(path) {
      if (this.opts && !typeof this.opts === 'object') {
        return console.error('[babel-plugin-awaitFn-add-trycatch]: options need to be an object.');
      }

      if (path.findParent((p) => p.isTryStatement())) {
        return false;
      }

      const options = mergeOptions(this.options);

      const filePath = this.filename || this.file.opts.filename || 'unknown';

      if (matchesFile(options.exclude, filePath)) {
        return;
      }

      if (options.include.length && !matchesFile(options.include, filePath)) {
        return;
      }

      const node = path.node;

      const asyncPath = path.findParent(
        (p) =>
          p.node &&
          (p.isFunctionDeclaration() ||
            p.isArrowFunctionExpression() ||
            p.isFunctionExpression() ||
            p.isObjectMethod())
      );

      let asyncName = '';
      const asyncType = asyncPath.node.type;

      switch (asyncType) {
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
          const identifier = asyncPath.getSibling('id');
          asyncName = identifier && identifier.node ? identifier.node.name : '';
          break;
        case 'FunctionDeclaration':
          asyncName = (asyncPath.node.id && asyncPath.node.id.name) || '';
          break;
        case 'ObjectMethod':
          asyncName = asyncPath.node.key.name || '';
          break;
      }

      const funcName = asyncName || (node.argument.callee && node.argument.callee.name) || '';

      const temp = template(tryTemplate);

      const tempArgumentObj = {
        CatchError: types.stringLiteral(catchConsole(filePath, funcName, options.customLog)),
      };

      const tryNode = temp(tempArgumentObj);

      asyncInfo = asyncPath.node.body;

      tryNode.block.body.push(...asyncInfo.body);

      asyncInfo.body = [tryNode];
    },
  };

  return {
    name: 'babel-plugin-awaitFn-add-trycatch',
    visitor,
  };
};
