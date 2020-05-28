declare module '@slash/test-utils' {
  function fixtures(dirname: string, fn: string, options: object): void;
  function fixtures(
    dirname: string,
    file: string,
    fn: string,
    options: object,
  ): void;

  function withTest(editor: any): any;
}
