create table CATEGORIA
(
	ID int generated always as identity,
	NOME VARCHAR(64) not null,
	CRIADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null,
	ATUALIZADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table CATEGORIA is 'Representa uma Categoria do sistema LSM.';

comment on column CATEGORIA.NOME is 'Representa o nome unico de uma Categoria.';

comment on column CATEGORIA.CRIADO_EM is 'Data da criação da Categoria.';

comment on column CATEGORIA.ATUALIZADO_EM is 'Data da ultima atualização da categeoria.';

create unique index CATEGORIA_ID_UINDEX
	on CATEGORIA (ID);

create unique index CATEGORIA_NOME_UINDEX
	on CATEGORIA (NOME);

alter table CATEGORIA
	add constraint CATEGORIA_PK
		primary key (ID);

