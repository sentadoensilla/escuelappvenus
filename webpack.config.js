const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/index.js", // main js
  output: {
    path: path.resolve(__dirname, "build"), // output folder
    publicPath: "/",
  },
  resolve: {
    extensions: ['.*', '.js', '.jsx'],
  },
  devServer: {
    port: 3000, // you can change the port
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader", // for styles
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
      }
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          chunks: 'initial',
          filename: 'vendors.[contenthash].js',
          priority: 1,
          maxInitialRequests: 2,
          minChunks: 3, // count of entries
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // base html
      filename: './index.html',
      favicon: './public/favicon.ico'
    }),
  ],
};