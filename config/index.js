'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const packageJson = require('../package')

const biobankSubjectsResponse = require('./dev-responses/biobank-subjects-response.js')
const biobankSubjectsIncludeCategoriesResponse = require('./dev-responses/biobank-subjects-include-categories-response.js')
const filteredBiobankSubjectsResponse = require('./dev-responses/filtered-biobank-subjects-response.js')
const biobankAggregateResponse = require('./dev-responses/biobank-aggregate-response.js')
const smokingAggregateResponse = require('./dev-responses/smoking-aggregate-response.js')
const sexAggregateResponse = require('./dev-responses/sex-aggregate-response.js')
const ageYearsAggregateResponse = require('./dev-responses/age-years-aggregate-response.js')
const genotypesAggregateResponse = require('./dev-responses/genotypes-aggregate-response.js')
const metabolomeAggregateResponse = require('./dev-responses/metabolome-aggregate-response.js')
const methylomeAggregateResponse = require('./dev-responses/methylome-aggregate-response.js')
const transcriptomeAggregateResponse = require('./dev-responses/transcriptome-aggregate-response.js')
const wgsAggregateResponse = require('./dev-responses/wgs-aggregate-response.js')
const cellcountsAggregateResponse= require('./dev-responses/cellcounts-aggregate-response.js')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/v2': {
        target: 'http://localhost:8080'
      }
    },

    // Various Dev Server settings
    host: process.env.JENKINS_AGENT_NAME || 'localhost', // can be overwritten by process.env.HOST
    port: 3000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,

    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    cssSourceMap: true,

    before (app) {
      app.get('/api/v2/bbmri_subjects', function (request, response) {
        if (request.query.aggs) {
          const attr = request.query.aggs.split('==')[1]
          if (attr === 'biobank') response.json(biobankAggregateResponse)
          if (attr === 'sex') response.json(sexAggregateResponse)
          if (attr === 'ever_smoked') response.json(smokingAggregateResponse)
          if (attr === 'age') response.json(ageYearsAggregateResponse)
          if (attr === 'genotypes') response.json(genotypesAggregateResponse)
          if (attr === 'metabolome') response.json(metabolomeAggregateResponse)
          if (attr === 'methylome') response.json(methylomeAggregateResponse)
          if (attr === 'transcriptome') response.json(transcriptomeAggregateResponse)
          if (attr === 'whole_genome_sequencing') response.json(wgsAggregateResponse)
          if (attr === 'cell_counts') response.json(cellcountsAggregateResponse)
        } else if (request.query.q) {
          response.json(filteredBiobankSubjectsResponse)
        } else if (request.query.includeCategories) {
          response.json(biobankSubjectsIncludeCategoriesResponse)
        } else {
          response.json(biobankSubjectsResponse)
        }
      })
    }
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: '/plugin/app/' + packageJson.name + '/',

    /**
     * Source Maps
     */
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
