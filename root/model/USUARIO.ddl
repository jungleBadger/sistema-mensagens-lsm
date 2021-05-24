create table USUARIO
(
    ID               INTEGER generated always as identity not null,
    EMAIL            VARCHAR(256)                         not null,
    SENHA            VARCHAR(128)                         not null,
    NOME_EXIBICAO    VARCHAR(512),
    ADMINISTRADOR    BOOLEAN   default FALSE              not null,
    SENHA_REGISTRADA BOOLEAN   default FALSE              not null,
    EMAIL_CONFIRMADO BOOLEAN   default FALSE              not null,
    CRIADO_EM        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ATUALIZADO_EM       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

comment
on table USUARIO is 'Representa um usuario do sistema LSM.';

comment
on column USUARIO.ID is 'ID unico de cada usuario.';

comment
on column USUARIO.EMAIL is 'Email unico de cada usuario.';

comment
on column USUARIO.SENHA is 'Senha criptografada.';

comment
on column USUARIO.NOME_EXIBICAO is 'Nome de exibicao opcional de cada usuario. Texto livre com 64 caracteres de limite.';

comment
on column USUARIO.ADMINISTRADOR is 'Define se usuario possui privilegios de administrador ou nao.';

comment
on column USUARIO.SENHA_REGISTRADA is 'Define se usuario configurou a senha apos criar conta com rede social ou manualmente por um administrador.';

comment
on column USUARIO.EMAIL_CONFIRMADO is 'Define se usuario confirmou o email; Possiveis meios de confirmacao: atraves de um link unico enviado ao email ou registrou a conta via rede social ou foi adicionado por um administrador.';

comment
on column USUARIO.CRIADO_EM is 'Data de criacao do usuario.';

comment
on column USUARIO.ATUALIZADO_EM is 'Data da ultima atualizacao do usuario.';

create
unique index USUARIO_EMAIL_UINDEX
	on USUARIO (EMAIL);

create
unique index USUARIO_ID_UINDEX
	on USUARIO (ID);

alter table USUARIO
    add constraint USUARIO_PK
        primary key (ID);

