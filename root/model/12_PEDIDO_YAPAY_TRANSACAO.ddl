create table PEDIDO_YAPAY_TRANSACAO
(
	ID int generated always as identity,
	PEDIDO_ID int not null
		constraint PEDIDO_YAPAY_TRANSACAO_PEDIDO_ID_FK
			references PEDIDO,
	TRANSACAO_ID int not null,
	TRANSACAO_TOKEN VARCHAR(64),
	DATA_TRANSACAO TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table PEDIDO_YAPAY_TRANSACAO is 'Representa uma transação de PEDIDO dentro do sistema yapay.';

comment on column PEDIDO_YAPAY_TRANSACAO.PEDIDO_ID is 'Representa o ID do Pedido dentro do sistema LSM.';

comment on column PEDIDO_YAPAY_TRANSACAO.TRANSACAO_ID is 'Representa o ID da transação no sistema YaPay.';

comment on column PEDIDO_YAPAY_TRANSACAO.TRANSACAO_TOKEN is 'Representa o Token da transação gerado pelo sistema YaPay.';

comment on column PEDIDO_YAPAY_TRANSACAO.DATA_TRANSACAO is 'Representa a data da transação. Fornecido pelo sistema YaPay.';

create unique index PEDIDO_YAPAY_TRANSACAO_ID_UINDEX
	on PEDIDO_YAPAY_TRANSACAO (ID);

create unique index PEDIDO_YAPAY_TRANSACAO_PEDIDO_ID_UINDEX
	on PEDIDO_YAPAY_TRANSACAO (PEDIDO_ID);

alter table PEDIDO_YAPAY_TRANSACAO
	add constraint PEDIDO_YAPAY_TRANSACAO_PK
		primary key (ID);

