create table MENSAGEM
(
	ID int generated always as identity,
	EVENTO_ID int not null
		constraint MENSAGEM_EVENTO_ID_FK
			references EVENTO,
	IRMAO_ID int not null
		constraint MENSAGEM_IRMAO_ID_FK
			references IRMAO,
	ORDEM int not null,
	TITULO VARCHAR(512) not null,
	DATA_MINISTRADO TIMESTAMP not null,
	VALOR DECIMAL(10,2) default 1.00 not null,
	CAMINHO_ARQUIVO_AUDIO VARCHAR(512),
	CAMINHO_ARQUIVO_ESBOCO VARCHAR(512),
	HABILITADO BOOLEAN default false not null,
	CRIADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null,
	ATUALIZADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table MENSAGEM is 'Representa uma MENSAGEM ministrada por um IRMAO pertencente a um EVENTO.';

comment on column MENSAGEM.ID is 'Representa o ID unico de uma mensagem.';

comment on column MENSAGEM.EVENTO_ID is 'Representa o relacionamento com a tabela EVENTO. Uma mensagem pertence a um evento.';

comment on column MENSAGEM.IRMAO_ID is 'Representa o relacionamento com a tabela IRMAO. Um irmão ministra N mensagens..';

comment on column MENSAGEM.ORDEM is 'Representa a ordem da mensagem.';

comment on column MENSAGEM.TITULO is 'Representa o título de uma mensagem.';

comment on column MENSAGEM.DATA_MINISTRADO is 'Representa a data da MENSAGEM. Deve estar entre DATA_INICIO e DATA_FIM de um EVENTO.';

comment on column MENSAGEM.VALOR is 'Representa o valor de uma mensagem. Valor padrão é 01.00 real.';

comment on column MENSAGEM.CAMINHO_ARQUIVO_AUDIO is 'Representa o caminho do arquivo audio dentro do sistema de arquivos.';

comment on column MENSAGEM.CAMINHO_ARQUIVO_ESBOCO is 'Representa o caminho do arquivo pdf do esboço dentro do sistema de arquivos.';

comment on column MENSAGEM.HABILITADO is 'Representa se a mensagem está habilitada para compra.';

comment on column MENSAGEM.CRIADO_EM is 'Data da criação da mensagem.';

comment on column MENSAGEM.ATUALIZADO_EM is 'Data da ultima atualização da mensagem.';

create unique index MENSAGEM_EVENTO_ID_TITULO_UINDEX
	on MENSAGEM (EVENTO_ID, TITULO);

create unique index MENSAGEM_ID_UINDEX
	on MENSAGEM (ID);

alter table MENSAGEM
	add constraint MENSAGEM_PK
		primary key (ID);

