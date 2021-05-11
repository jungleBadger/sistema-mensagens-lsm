create table LOG_OPERACAO
(
    ID                int generated always as identity,
    REFERENCIA_ID     int                                 not null,
    REFERENCIA_TABELA varchar(64)                         not null,
    ACAO              varchar(16)                         not null,
    OPERADOR_FANTASIA varchar(256),
    OPERADOR_ID       int
        constraint LOG_OPERACAO_USUARIO_ID_FK
            references USUARIO
            on delete set null,
    CRIADO_EM         TIMESTAMP default CURRENT_TIMESTAMP not null
);

comment on table LOG_OPERACAO is 'Representa um log unico de operação no sistema LSM.';

comment on column LOG_OPERACAO.ID is 'Representa um log unico.';

comment on column LOG_OPERACAO.REFERENCIA_ID is 'Representa o ID da entidade manipulada.';

comment on column LOG_OPERACAO.REFERENCIA_TABELA is 'Representa a tabela origem da entidade manipulada.';

comment on column LOG_OPERACAO.ACAO is 'Representa a ação executada na entidade. (CRIAR, EDITAR, DELETAR)';

comment on column LOG_OPERACAO.OPERADOR_FANTASIA is 'Representa nome fantasia do operador. Email ou "sistema" sao exemplos de valores esperados.';

comment on column LOG_OPERACAO.OPERADOR_ID is 'Representa o relacionamento com um usuário do sistema. Se o usuário for deletado esta chave será configurado para "NULL" mas o OPERADOR_FANTASIA permanece oferecendo um nivel de identificacao.';

comment on column LOG_OPERACAO.CRIADO_EM is 'Data de criacao do log de operação.';

create unique index LOG_OPERACAO_ID_UINDEX
    on LOG_OPERACAO (ID);

alter table LOG_OPERACAO
    add constraint LOG_OPERACAO_PK
        primary key (ID);

