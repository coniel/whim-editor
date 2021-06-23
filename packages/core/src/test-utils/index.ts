Object.defineProperty(Array.prototype, 'flat', {
  value: function (depth = 1) {
    return this.reduce(function (flat: unknown[], toFlatten: unknown) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten,
      );
    }, []);
  },
});

export * from './fixtures';
export * from './jsx';
export * from './withTest';
export * from './components';
export * from './TestEditor';
