create table PROVEDOR_SOCIAL
(
    ID                  int generated always as identity,
    NOME                VARCHAR(64)            not null,
    LOGIN_HABILITADO    BOOLEAN   default true not null,
    REGISTRO_HABILITADO BOOLEAN   default true not null,
    CRIADO_EM           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ATUALIZADO_EM          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

comment on table PROVEDOR_SOCIAL is 'Representa um provedor social de login disponivel no sistema.';

comment on column PROVEDOR_SOCIAL.NOME is 'Nome do provedor social. Exemplo: Google.';

comment on column PROVEDOR_SOCIAL.LOGIN_HABILITADO is 'Define se provedor esta habilitado para usuarios realizarem login no sistema.';

comment on column PROVEDOR_SOCIAL.REGISTRO_HABILITADO is 'Define se provedor esta habilitado para novos usuarios se cadastrarem no sistema.';

comment on column PROVEDOR_SOCIAL.CRIADO_EM is 'Data de criacao do provedor social.';

comment on column PROVEDOR_SOCIAL.ATUALIZADO_EM is 'Data da ultima atualizacao do provedor social.';

create unique index PROVEDOR_SOCIAL_ID_UINDEX
    on PROVEDOR_SOCIAL (ID);

create unique index PROVEDOR_SOCIAL_NOME_UINDEX
    on PROVEDOR_SOCIAL (NOME);

alter table PROVEDOR_SOCIAL
    add constraint PROVEDOR_SOCIAL_PK
        primary key (ID);

