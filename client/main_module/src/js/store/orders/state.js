"use strict";

export default {
	"ownedItems": [],
	"isLoading": true,
	"totalOrdersCount": null,
	"pagination": {
		"skip": 0,
		"limit": 20,
		"orderBy": "CRIADO_EM",
		"orderDirection": "DESC"
	},
	"orderItems": [],
	"tableColumns": [
		{
			"originalId": "ID",
			"key": "id",
			"label": "Numero do pedido",
			"size": "80px"
		},
		{
			"originalId": "PEDIDO_STATUS",
			"key": "orderStatus",
			"label": "Status"
		},
		{
			"originalId": "TOTAL_ITENS",
			"key": "totalItems",
			"label": "Mensagens"
		},
		{
			"originalId": "CRIADO_EM",
			"key": "createdAt",
			"label": "Criado em",
			"type": "date"
		},
		{
			"originalId": "ATUALIZADO_EM",
			"key": "updatedAt",
			"label": "Atualizado em",
			"type": "date"
		}

	]
};