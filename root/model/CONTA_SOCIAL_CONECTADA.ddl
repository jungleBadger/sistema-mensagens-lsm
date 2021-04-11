create table CONTA_SOCIAL_CONECTADA
(
	ID int generated always as identity,
	USUARIO_ID int not null
		constraint CONTA_SOCIAL_CONECTADA_USUARIO_ID_FK
			references USUARIO
				on delete cascade,
	PROVEDOR_SOCIAL_ID int not null
		constraint CONTA_SOCIAL_CONECTADA_PROVEDOR_SOCIAL_ID_FK
			references PROVEDOR_SOCIAL
				on delete cascade,
	CRIADO_EM TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

comment on table CONTA_SOCIAL_CONECTADA is 'Representa uma conexão entre uma conta de USUARIO e um PROVEDOR_SOCIAL.';

comment on column CONTA_SOCIAL_CONECTADA.USUARIO_ID is 'Representa a qual USUARIO a conta conectada pertence. Quando um usuario for deletado, todas as contas conectadas serao deletadas tambem.';

comment on column CONTA_SOCIAL_CONECTADA.PROVEDOR_SOCIAL_ID is 'Representa qual PROVEDOR_SOCIAL da conta conectada. Quando um provedor social for deletado, todas as contas conectadas serao deletadas tambem.';

comment on column CONTA_SOCIAL_CONECTADA.CRIADO_EM is 'Data de criacao da conexao.';

create unique index CONTA_SOCIAL_CONECTADA_ID_UINDEX
	on CONTA_SOCIAL_CONECTADA (ID);

