import fs from 'fs';
import { basename, extname, resolve } from 'path';
import { SlashEditor } from '../withPlugins';

interface TestModule {
  input: SlashEditor;
  output: SlashEditor;
  run: (editor: SlashEditor) => void;
}

interface TestFunctionArguments {
  module: TestModule;
  name: string;
  path: string;
}

type TestFunction = (args: TestFunctionArguments) => void;

interface FixtureOptions {
  skip: boolean;
}

export function fixtures(
  root: string,
  directory: string,
  fn: TestFunction,
  options?: FixtureOptions,
): void {
  options = options || { skip: false };

  const path = resolve(root, directory);
  const files = fs.readdirSync(path);
  const dir = basename(path);
  const d = options.skip ? describe.skip : describe;

  d(dir, () => {
    for (const file of files) {
      const p = resolve(path, file);
      const stat = fs.statSync(p);

      if (stat.isDirectory()) {
        fixtures(path, file, fn);
      }

      if (
        stat.isFile() &&
        file.endsWith('.tsx') &&
        !file.startsWith('.') &&
        // Ignoring `index.js` files allows us to use the fixtures directly
        // from the top-level directory itself, instead of only children.
        file !== 'index.js'
      ) {
        const name = basename(file, extname(file));

        // This needs to be a non-arrow function to use `this.skip()`.
        it(`${name} `, function () {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const module = require(p);

          if (module.skip) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.skip();
            return;
          }

          fn({ name, path, module });
        });
      }
    }
  });
}

fixtures.skip = (
  path: string,
  directory: string,
  callback: TestFunction,
): void => {
  fixtures(path, directory, callback, { skip: true });
};
