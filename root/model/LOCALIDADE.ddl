create table LOCALIDADE
(
	ID int generated always as identity,
	PAIS VARCHAR(64) not null,
	ESTADO VARCHAR(64) not null,
	CIDADE VARCHAR(64) not null,
	DESCRICAO VARCHAR(256),
	CRIADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null,
	ATUALIZADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table LOCALIDADE is 'Coleção de Localidades para registro de EVENTOS.';

comment on column LOCALIDADE.PAIS is 'Representa um país valido.';

comment on column LOCALIDADE.ESTADO is 'Representa um Estado de um País.';

comment on column LOCALIDADE.CIDADE is 'Representa uma Cidade de um Estado.';

comment on column LOCALIDADE.DESCRICAO is 'Representa a descrição opcional de uma localidade.';

comment on column LOCALIDADE.CRIADO_EM is 'Data de criacao da Localidade.';

comment on column LOCALIDADE.ATUALIZADO_EM is 'Data de atualização da Localidade.';

create unique index LOCALIDADE_ID_UINDEX
	on LOCALIDADE (ID);

create unique index LOCALIDADE_PAIS_ESTADO_CIDADE_UINDEX
	on LOCALIDADE (PAIS, ESTADO, CIDADE);

alter table LOCALIDADE
	add constraint LOCALIDADE_PK
		unique (ID);

