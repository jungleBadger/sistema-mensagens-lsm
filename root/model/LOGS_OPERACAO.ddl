create table LOGS_OPERACAO
(
    ID                INTEGER                                not null,
    REFERENCIA_ID     INTEGER                                not null,
    REFERENCIA_TABELA VARCHAR(64)                            not null,
    ACAO              VARCHAR(16)                            not null,
    OPERADOR_FANTASIA VARCHAR(256)                           not null,
    OPERADOR_ID       INTEGER
        constraint LOGS_OPERACAO_USUARIO_ID_FK
			references USUARIO
				on delete SET NULL,
    CRIADO_EM         TIMESTAMP(6) default CURRENT TIMESTAMP not null
);

comment on table LOGS_OPERACAO is 'Representa um log unico de uma operação no sistema LSM.';

comment on column LOGS_OPERACAO.ID is 'Representa um log unico';

comment on column LOGS_OPERACAO.REFERENCIA_ID is 'Representa o ID da entidade manipulada.';

comment on column LOGS_OPERACAO.REFERENCIA_TABELA is 'Representa a tabela origem da entidade manipulada.';

comment on column LOGS_OPERACAO.ACAO is 'Representa a ação executada na entidade. (CRIAR, EDITAR, DELETAR)';

comment on column LOGS_OPERACAO.OPERADOR_FANTASIA is 'Representa nome fantasia do operador. Email ou "sistema" sao exemplos de valores esperados.';

comment on column LOGS_OPERACAO.OPERADOR_ID is 'Representa o relacionamento com um usuário do sistema. Se o usuário for deletado esta chave será configurado para "NULL" mas o OPERADOR_FANTASIA permanece oferecendo um nivel de identificacao.';

comment on column LOGS_OPERACAO.CRIADO_EM is 'Data de criacao do log de operação.';

create unique index LOGS_OPERACAO_ID_UINDEX
    on LOGS_OPERACAO (ID);

alter table LOGS_OPERACAO
    add constraint LOGS_OPERACAO_PK
        primary key (ID);

