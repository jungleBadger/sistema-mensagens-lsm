create table PEDIDO_ITEM
(
	ID int generated always as identity,
	PEDIDO_ID int not null
		constraint PEDIDO_ITEM_PEDIDO_ID_FK
			references PEDIDO,
	MENSAGEM_ID int not null
		constraint PEDIDO_ITEM_MENSAGEM_ID_FK
			references MENSAGEM,
	VALOR_APLICADO int default 1 not null,
	CRIADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null,
	ATUALIZADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table PEDIDO_ITEM is 'Representa um item dentro de um PEDIDO';

comment on column PEDIDO_ITEM.ID is 'Representa o ID unico de um produto no pedido.';

comment on column PEDIDO_ITEM.PEDIDO_ID is 'Representa o Pedido que contem os itens.';

comment on column PEDIDO_ITEM.MENSAGEM_ID is 'Representa a mensagem (item) do pedido.';

comment on column PEDIDO_ITEM.VALOR_APLICADO is 'Representa o valor aplicado para o item. Na maioria das vezes é o mesmo valor da mensagem.';

comment on column PEDIDO_ITEM.CRIADO_EM is 'Representa a data de criação do item dentro do pedido.';

comment on column PEDIDO_ITEM.ATUALIZADO_EM is 'Representa a data de atualização do item dentro do pedido.';

create unique index PEDIDO_ITEM_ID_UINDEX
	on PEDIDO_ITEM (ID);

alter table PEDIDO_ITEM
	add constraint PEDIDO_ITEM_PK
		primary key (ID);

