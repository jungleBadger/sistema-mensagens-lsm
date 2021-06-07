create table PEDIDO
(
	ID int generated always as identity,
	STATUS_ID int not null
		constraint PEDIDO_PEDIDO_STATUS_ID_FK
			references PEDIDO_STATUS,
	USUARIO_ID int not null
		constraint PEDIDO_USUARIO_ID_FK
			references USUARIO,
	CRIADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null,
	ATUALIZADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table PEDIDO is 'Representa um novo pedido no Sistema LSM.';

comment on column PEDIDO.ID is 'Representa o ID unico de um pedido.';

comment on column PEDIDO.STATUS_ID is 'Representa o ID de um status existente.';

comment on column PEDIDO.USUARIO_ID is 'Representa o ID do usuário dono da ordem.';

comment on column PEDIDO.CRIADO_EM is 'Representa a data de criação de um pedido.';

comment on column PEDIDO.ATUALIZADO_EM is 'Representa a data de atualização de um pedido.';

create unique index PEDIDO_ID_UINDEX
	on PEDIDO (ID);

alter table PEDIDO
	add constraint PEDIDO_PK
		primary key (ID);

