create table EVENTO
(
	ID int generated always as identity,
	CATEGORIA_ID int not null
		constraint EVENTO_CATEGORIA_ID_FK
			references CATEGORIA,
	LOCALIDADE_ID int not null
		constraint EVENTO_LOCALIDADE_ID_FK
			references LOCALIDADE (ID),
	TITULO VARCHAR(512) not null,
	DATA_INICIO TIMESTAMP not null,
	DATA_FIM TIMESTAMP not null,
	DESCRICAO VARCHAR(1024),
	CRIADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null,
	ATUALIZADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table EVENTO is 'Representa um EVENTO que agrupa MENSAGENS no Sistema LSM.';

comment on column EVENTO.CATEGORIA_ID is 'Representa a conexão entre a tabela EVENTO com a tabela CATEGORIA.';

comment on column EVENTO.LOCALIDADE_ID is 'Representa a conexão entre a tabela EVENTO com a tabela LOCALIDADE.';

comment on column EVENTO.TITULO is 'Representa o Título de um evento.';

comment on column EVENTO.DATA_INICIO is 'Representa a data de inicio de um evento.';

comment on column EVENTO.DATA_FIM is 'Representa a data de finalizacao de um evento.';

comment on column EVENTO.DESCRICAO is 'Representa a descrição opcional de um evento.';

comment on column EVENTO.CRIADO_EM is 'Data de criacao do evento.';

comment on column EVENTO.ATUALIZADO_EM is 'Data de atualização do evento.';

create unique index EVENTO_ID_UINDEX
	on EVENTO (ID);

create unique index EVENTO_TITULO_UINDEX
	on EVENTO (TITULO);

alter table EVENTO
	add constraint EVENTO_PK
		primary key (ID);

