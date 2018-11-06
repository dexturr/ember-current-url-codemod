export default function transformer(file, api) {
    const j = api.jscodeshift;
  
    return j(file.source)
      .find(j.CallExpression, {
        arguments: [{
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'currentURL',
          },
        }],
        callee: {
          object: {
            type: 'Identifier',
            name: 'assert',
          },
          property: {
            type: 'Identifier',
            name: 'equal',
          },
        },
      })
      .forEach((path) => {
        const { value } = path;
        const remainingArgs = value.arguments.slice(1);
        const callExpression = j.callExpression(
          j.memberExpression(
            j.identifier('assert'),
            j.identifier('currentUrl')
          ),
          remainingArgs
        );
        path.replace(callExpression);
      })
      .toSource();
  }
