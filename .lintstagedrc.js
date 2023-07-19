/**
 * @description
 *   lint-staged configuration for git hooks.
 *   These exist outside of the package.json so we
 *   can choose to run a command for any number
 *   of files regardless of how many you have currently
 *   staged, e.g. "typecheck all files if one JS file changed."
 * @see
 *   https://github.com/okonet/lint-staged
 */
module.exports = {
  'src/**/*.ts?(x)': (filenames) => [
    `prettier --write ${convertToCmdArgs(filenames)}`,
    /**
     * eslint: Fix all warnings / errors but only display errors
     */
    `eslint ${convertToCmdArgs(filenames)} --quiet --fix`,
    `git add ${convertToCmdArgs(filenames)}`,
  ],
  '*.json': (filenames) => `prettier --write ${convertToCmdArgs(filenames)}`,
  '*.css': (filenames) => `prettier --write ${convertToCmdArgs(filenames)}`,
  '*.md': (filenames) => `prettier --write ${convertToCmdArgs(filenames)}`,
}

/**
 * @description
 *   Converts an array of filenames into
 *   a space-delimited string. This allows us to
 *   pass an array of filenames into a command as
 *   arguments.
 * @example
 *   // without util
 *   `eslint src/foo.js src/bar.js src/baz.js`
 *   // with util
 *   `eslint ${convertToCmdArgs(filenames)}`
 * @param {Array<string>} filenames
 * @returns {string}
 */
function convertToCmdArgs(filenames) {
  return filenames.join(' ')
}
