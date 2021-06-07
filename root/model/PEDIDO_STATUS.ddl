create table PEDIDO_STATUS
(
	ID int generated always as identity,
	NOME_EXIBICAO VARCHAR(64) not null,
	CRIADO_EM TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table PEDIDO_STATUS is 'Representa os possíveis estados (status) de pedidos.';

comment on column PEDIDO_STATUS.ID is 'Representa o ID unico de um status de pedido.';

comment on column PEDIDO_STATUS.NOME_EXIBICAO is 'Representa o nome de exibição de um status.';

comment on column PEDIDO_STATUS.CRIADO_EM is 'Representa a data de criação de um status.';

create unique index PEDIDO_STATUS_ID_UINDEX
	on PEDIDO_STATUS (ID);

create unique index PEDIDO_STATUS_NOME_EXIBICAO_UINDEX
	on PEDIDO_STATUS (NOME_EXIBICAO);

alter table PEDIDO_STATUS
	add constraint PEDIDO_STATUS_PK
		primary key (ID);


INSERT into PEDIDO_STATUS(NOME_EXIBICAO) VALUES ('ABERTO')
INSERT into PEDIDO_STATUS(NOME_EXIBICAO) VALUES ('PENDENTE')
INSERT into PEDIDO_STATUS(NOME_EXIBICAO) VALUES ('ANALISE')
INSERT into PEDIDO_STATUS(NOME_EXIBICAO) VALUES ('CANCELADO')
INSERT into PEDIDO_STATUS(NOME_EXIBICAO) VALUES ('REJEITADO')
INSERT into PEDIDO_STATUS(NOME_EXIBICAO) VALUES ('CONCLUIDO')
