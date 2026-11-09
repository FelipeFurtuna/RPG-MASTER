# RPG MASTER + Mesa Virtual — D&D 5e

Projeto pessoal de apoio à preparação e condução de sessões presenciais de RPG de mesa, inspirado no fluxo de jogo de Dungeons & Dragons 5ª edição. O projeto reúne dois módulos distintos e integrados: o **RPG MASTER**, voltado à preparação do mestre, e a **Mesa Virtual**, voltada à representação visual do tabuleiro durante a sessão.

> Projeto independente, não afiliado, patrocinado ou endossado pela Wizards of the Coast. Dungeons & Dragons é uma marca de seus respectivos titulares.

## Módulos

### RPG MASTER — preparação do mestre
- Organização de campanhas e contexto narrativo.
- Geradores de NPCs, missões e encontros.
- Bestiário com criação e edição de criaturas.
- Cadastro descritivo dos aventureiros (nome, jogador, raça, classe, nível e observações).
- Diário do mestre e anotações.
- Exportação e importação de backups.

### Mesa Virtual — apoio visual à sessão
- Mapas e ambientes ilustrados, miniaturas e movimentação.
- Névoa de guerra e campo de visão.
- Transições individuais entre ambientes/portas.
- Controle manual da vez dos participantes.
- Controle de PV, dano e cura para criaturas/miniaturas com controle digital.
- Efeitos visuais de condições, clima, chuva e modo noturno.
- Iluminação dinâmica configurável: tochas, lanternas, velas, orbes mágicos e pedras lunares, com cor, alcance, intensidade e tremulação ajustáveis.
- Música e efeitos sonoros.
- Títulos cinematográficos sobre o mapa.

As fichas dos jogadores e as rolagens de dados permanecem físicas, na mesa real. O sistema não inclui rolador de dados nem iniciativa automática.

## Estrutura

```text
RPG-MASTER/
├── index.html          # Interface principal do RPG MASTER
├── app.js              # Lógica do RPG MASTER
├── style.css           # Estilos do RPG MASTER
├── mesa-virtual.html   # Mesa Virtual integrada
├── README.md           # Documentação do projeto
└── .gitignore          # Arquivos locais que não devem ser versionados
```

A Mesa Virtual atual é um HTML independente, com seus estilos, scripts e recursos visuais incorporados. Por isso, não há uma pasta `assets/` obrigatória nesta versão.

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)
- Canvas API para renderização e interação com o mapa
- `localStorage` para persistência local no navegador
- JSON e File API para exportação/importação de dados e backups

Não é necessário instalar dependências nem executar um processo de build.

## Executar localmente

1. Baixe ou clone este repositório.
2. Mantenha os quatro arquivos principais na mesma pasta.
3. Abra `index.html` no navegador.
4. Acesse **Mesa Virtual** pelo menu do RPG MASTER.

Para testar a integração entre os módulos com uma origem HTTP local, abra a pasta em um servidor local, como a extensão **Live Server** do Visual Studio Code. Outra opção é executar `python -m http.server 8000` na pasta e abrir `http://localhost:8000`.

## Publicar com GitHub Pages

1. Crie um repositório público chamado `RPG-MASTER`.
2. Envie os arquivos desta pasta para a raiz do repositório.
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)`, depois salve.
6. Aguarde a publicação. O endereço normalmente será `https://SEU-USUARIO.github.io/RPG-MASTER/`.

## Dados e limitações atuais

- Campanhas, criaturas, anotações, mapas personalizados, miniaturas e configurações são armazenados localmente no navegador (`localStorage`).
- Os dados locais não são enviados automaticamente para um servidor e não são sincronizados entre computadores ou navegadores diferentes.
- Use os recursos de exportação/importação de backup para transportar seus dados. Guarde os arquivos de backup fora do repositório público.
- A integração em tempo real entre os módulos depende de ambos serem abertos na mesma origem (por exemplo, no GitHub Pages ou em um servidor local). Se necessário, use a exportação/importação JSON.
- GitHub Pages hospeda os arquivos estáticos; esta versão não possui backend, autenticação ou banco de dados remoto.

## Desenvolvimento e autoria

Projeto idealizado, especificado, dirigido e testado pelo autor, com assistência de ferramentas de inteligência artificial na implementação e evolução do código. A descrição das funcionalidades e decisões de produto reflete o escopo atual do projeto.

## Segurança antes de publicar

Não envie backups pessoais, tokens, senhas, chaves de API, dados privados de jogadores ou material de terceiros que você não tenha autorização para redistribuir.
