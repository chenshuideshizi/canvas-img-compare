const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devServer: {
        static: {
          directory: path.join(__dirname, 'static'),
        },
        compress: true,
        port: 9000,
      }
    
}