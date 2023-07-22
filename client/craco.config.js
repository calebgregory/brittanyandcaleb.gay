const path = require(`path`)
const { getLoader } = require('@craco/craco')

module.exports = {
  webpack: {
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    // https://stackoverflow.com/questions/74126812/import-a-yaml-file-in-react-with-craco-and-yaml-loader
    {
      plugin: {
        overrideWebpackConfig: ({ context, webpackConfig }) => {
          console.log(webpackConfig.module.rules.find((rule) => rule.hasOwnProperty('oneOf')))
          const { isFound, match: fileLoaderMatch } = getLoader(
            webpackConfig,
            (rule) => rule.type === 'asset/resource'
          )

          if (!isFound) {
            throw {
              message: `Can't find file-loader in the ${context.env} webpack config!`,
            }
          }

          fileLoaderMatch.loader.exclude.push(/\.ya?ml$/)

          const yamlLoader = {
            use: 'yaml-loader',
            test: /\.(ya?ml)$/,
          }
          webpackConfig.module.rules.push(yamlLoader)
          return webpackConfig
        },
      },
    },
  ],
}
