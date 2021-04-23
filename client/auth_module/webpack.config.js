"use strict";

const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const {VueLoaderPlugin} = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
				"filename": path.join(__dirname, "dist", "index.html"),
				"template": path.join(__dirname, "src", "index.ejs"),
				"inject": false
			})
		],
		"entry": {
			"index": path.resolve(__dirname, "src", "js", "main.js")
		},
		"output": {
			"path": path.resolve(__dirname, "dist", "js"),
			"filename": `[contenthash].bundle${env.NODE_ENV === "production" ? ".prod" : ""}.js`,
			"library": "SurveyModule",
			"libraryTarget": "umd",
			"publicPath": "/auth_module/dist/js/"
		},
		"performance": {
			"hints": env.NODE_ENV === "production" ? "warning" : false
		},
		"target": "web",
		"resolve": {
			"modules": [path.resolve(__dirname, "node_modules"), "node_modules", "../../node_modules", "./node_modules"],
			"extensions": [".js", ".json", ".vue"],
			"fallback": {
				"util": false,
				"path": false,
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
