const CopyWebpackPlugin = require("copy-webpack-plugin")
const nodeExternals = require("webpack-node-externals")
const path = require("path")

module.exports = {
  context: path.resolve(__dirname),
  target: "node",
  mode : "development",
  devtool: "source-map",
  externals: nodeExternals(),
  node: {
    __dirname: false,
    __filename: false
  },
  entry: "./src/server/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js"
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2)?$/,
        use: [
          { 
            loader: "url-loader",
            options: {
              limit: 50000,
              mimetype: "application/font-woff",
              name: "fonts/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          {loader: "babel-loader"}
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true
            }
          }
        ]
      },
      {
        test: /\.s?css$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "css-loader/locals",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]",
              sourceMap: false,
              minimize: false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: false
            }
          },
          {
            loader: "resolve-url-loader",
            options: {
              sourceMap: false
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src", "static"),
        to: path.resolve(__dirname, "dist", "assets"),
        dot: false
      }
    ])
  ],
  resolve: {
    extensions: [".js", ".json", ".jsx"],
    alias: {
      config: path.resolve(__dirname, "config"),
      connected: path.resolve(__dirname, "src", "shared", "components", "connected"),
      constants: path.resolve(__dirname, "src", "shared", "constants"),
      contexts: path.resolve(__dirname, "src", "shared", "contexts"),
      functional: path.resolve(__dirname, "src", "shared", "functional"),
      presentational: path.resolve(__dirname, "src", "shared", "components", "presentational"),
      store: path.resolve(__dirname, "src", "shared", "store"),
      routes: path.resolve(__dirname, "src", "shared", "routes"),
      scss: path.resolve(__dirname, "src", "shared", "scss"),
      svg: path.resolve(__dirname, "src", "shared", "svg"),
      libs: path.resolve(__dirname, "src", "shared", "libs")
    }
  },
}
