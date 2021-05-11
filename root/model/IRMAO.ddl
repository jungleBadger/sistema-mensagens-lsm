create table IRMAO
(
    ID            int generated always as identity,
    NOME_EXIBICAO VARCHAR(256)                        not null,
    CRIADO_EM     timestamp default CURRENT_TIMESTAMP not null,
    ATUALIZADO_EM timestamp default CURRENT_TIMESTAMP not null
);

comment on table IRMAO is 'Representa um Irmão no sistema LSM.';

comment on column IRMAO.NOME_EXIBICAO is 'Representa nome do Irmão.';

comment on column IRMAO.CRIADO_EM is 'Data de criacao do irmão.';

comment on column IRMAO.ATUALIZADO_EM is 'Data da ultima atualização do irmão.';

create unique index IRMAO_ID_UINDEX
    on IRMAO (ID);

create unique index IRMAO_NOME_EXIBICAO_UINDEX
    on IRMAO (NOME_EXIBICAO);

alter table IRMAO
    add constraint IRMAO_PK
        primary key (ID);

