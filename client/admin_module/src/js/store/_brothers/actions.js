"use strict";

import brothersFactory from "../../factory/brothers";

export default {

	async createBrother(context, displayName) {
		return await brothersFactory.createBrother({displayName});
	},

	async retrieveTotalBrothersCount(context) {
		let result = await brothersFactory.retrieveTotalBrothersCount();
		context.commit("totalBrothersCount", result.count);
	},

	async retrieveBrothers(context) {
		const {skip, limit} = context.getters["pagination"];
		let brothers = await brothersFactory.retrieveBrothers(skip, limit);
		context.commit("brotherItems", brothers.results);
	},

	async retrieveBrotherById(context, brotherId) {
		return await brothersFactory.retrieveBrotherById(brotherId);
	},


	async updateBrother(context, brother) {
		return await brothersFactory.updateBrother(brother);
	},

	async deleteBrother(context, brotherId) {
		return await brothersFactory.deleteBrother(brotherId);
	}

};