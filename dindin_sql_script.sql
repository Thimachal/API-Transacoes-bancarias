create table if not exists usuarios(
	id serial primary key,
	nome text not null,
	email varchar (80) not null,
	senha text not null
);
create table if not exists categorias(
	id serial primary key,
	descricao varchar (80) not null
);

create table if not exists transacoes(
	id serial primary key,
	descricao varchar (80) not null,
	valor int not null,
	data timestamptz,
	categoria_id integer not null,
	usuario_id integer not null,
	foreign key (categoria_id) references categorias (id), 
	foreign key (usuario_id) references usuarios (id),
	tipo varchar (7) check (tipo = 'entrada' or tipo = 'saida') not null
);

insert into categorias (descricao) values
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');

select * from usuarios;
select * from categorias;
select * from transacoes;
