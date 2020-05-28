/* eslint-disable @typescript-eslint/no-var-requires */
const { paramCase } = require('change-case');
const inquirer = require('inquirer');
const checkboxPlugin = require('@inquirer/checkbox');
const dayjs = require('dayjs');

inquirer.registerPrompt('checkbox', checkboxPlugin);
const prompt = inquirer.createPromptModule();

const interfaces = [
  'elements',
  'leaves',
  'renderElement',
  'renderLeaf',
  'onKeyDown',
  'decorate',
  'normalizeNode',
  'insertData',
  'onDOMBeforeInput',
];

module.exports = {
  prompt: ({ args }) => {
    const argsImplements = [];
    const questions = [];
    if (!args.name) {
      questions.push({
        type: 'input',
        name: 'name',
        message: 'What is the plugin called? (e.g. RichText)',
      });
    }

    if (!args.desc) {
      questions.push({
        type: 'input',
        name: 'description',
        message: 'Describe the plugin in a few words.',
      });
    }

    let hasMethodArgument = false;
    interfaces.forEach((method) => {
      if (args[method]) {
        argsImplements.push(method);
        hasMethodArgument = true;
      }
    });

    if (!hasMethodArgument) {
      questions.push({
        type: 'checkbox',
        message: 'Which interfaces will this plugin implement?',
        name: 'implements',
        choices: interfaces.map((name) => ({ name })),
        validate: function (answer) {
          if (answer.length < 1) {
            return 'Please choose at least one interface.';
          }

          return true;
        },
      });
    }

    return prompt(questions).then((answers) => {
      const implements = answers.implements || argsImplements;
      const description = answers.description || args.desc;
      const values = {
        ...answers,
        description,
        date: dayjs().format('MMMM D, YYYY'),
        package: `plugin-${paramCase(answers.name || args.name)}`,
      };

      values.implements = interfaces.reduce(
        (imp, method) => ({ ...imp, [method]: implements.includes(method) }),
        {},
      );

      return values;
    });
  },
};
