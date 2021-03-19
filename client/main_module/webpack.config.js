"use strict";

const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const {VueLoaderPlugin} = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");


module.exports = env => {
	return {
		"mode": env.NODE_ENV,
		"devtool": env.NODE_ENV === "production" ? false : "eval-source-map",
		"module": {
			"rules": [
				{
					"test": /\.scss$/,
					"use": [
						"vue-style-loader",
						{
							"loader": "css-loader",
							"options": {
								"esModule": false,
								"url": false
							}
						},
						"fast-sass-loader"
					]
				},
				{
					"test": /\.vue$/,
					"use": ["vue-loader"],
					"exclude": /(node_modules|bower_components)/
				},
				// this will apply to both plain `.js` files
				// AND `<script>` blocks in `.vue` files
				{
					"test" : /\.jsx?$/,
					"exclude": /(node_modules|bower_components)/,
					"use": {
						"loader": "babel-loader",
						"options": {
							"presets": [
								["@babel/preset-env"]
							],
							"plugins": [
								"@babel/plugin-proposal-object-rest-spread",
								"@babel/plugin-transform-spread",
								"@babel/transform-runtime",
								"@babel/plugin-proposal-optional-chaining",
								"@babel/plugin-proposal-nullish-coalescing-operator"
							],
							"ignore": ["node_modules"]
						}
					}
				},
				// this will apply to both plain `.js` files
				// AND `<script>` blocks in `.vue` files
				{
					"test" : /\.json?$/,
					"loader": "json-loader",
					"type": "javascript/auto",
					"exclude": /(node_modules|bower_components)/
				}
			]
		},
		"optimization": {
			"splitChunks": {
				"chunks": "all"
			}
		},
		"plugins": [
			new CleanWebpackPlugin(),
			new webpack.DefinePlugin({
				"__VUE_I18N_LEGACY_API__": false
			}),
			new webpack.EnvironmentPlugin({
				"NODE_ENV": env.NODE_ENV,
				"DEFAULT_LOCALE": "en",
				"DEFAULT_FALLBACK": "en"
			}),
			new VueLoaderPlugin(),
			new HtmlWebpackPlugin({
				"filename": path.join(__dirname, "app", "index.html"),
				"template": path.join(__dirname, "app", "index.ejs")
			}),
			new ScriptExtHtmlWebpackPlugin({
				"defaultAttribute": "async"
			})
		],
		"entry": {
			"index": path.resolve(__dirname, "app", "js", "main.js")
		},
		"output": {
			"path": path.resolve(__dirname, "app", "dist", "js"),
			"filename": `[contenthash].bundle${env.NODE_ENV === "production" ? ".prod" : ""}.js`,
			"library": "SurveyModule",
			"libraryTarget": "umd",
			"publicPath": "dist/js/"
		},
		"performance": {
			"hints": env.NODE_ENV === "production" ? "warning" : false
		},
		"target": "web",
		"resolve": {
			"extensions": [".js", ".json", ".vue"],
			"fallback": {
				"util": require.resolve("util"),
				"path": require.resolve("path-browserify"),
				"crypto": false,
				"url": false,
				"https": false,
				"http": false,
				"vm": false,
				"querystring": false,
				"os": false,
				"fs": false,
				"buffer": false,
				"tty": false,
				"stream": false,
				"assert": false,
				"constants": false
			}
		},
		"watch": env.ENABLE_WATCH,
		"watchOptions": {
			"ignored": /(node_modules|bower_components)/
		}
	};
};
