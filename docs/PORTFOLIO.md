# RPG MASTER + Mesa Virtual — estudo de projeto

## Resumo

O RPG MASTER + Mesa Virtual é um projeto pessoal de aplicação web estática criado para apoiar a preparação e a condução de sessões presenciais de RPG de mesa. A solução combina uma central de organização para o mestre com um tabuleiro visual independente, mantendo as fichas e as rolagens dos jogadores no ambiente físico.

**Aplicação:** https://felipefurtuna.github.io/RPG-MASTER/  
**Código-fonte:** https://github.com/FelipeFurtuna/RPG-MASTER

## Objetivo do produto

Reunir, em uma ferramenta acessível pelo navegador, recursos que ajudam o mestre antes e durante a sessão: organização de campanhas, referência de personagens, criação de criaturas, inspiração narrativa, anotações e apoio visual do tabuleiro.

A decisão central de escopo foi preservar o caráter presencial do jogo. A aplicação não tenta substituir fichas físicas, dados ou decisões da mesa.

## Módulos

### RPG MASTER

- Campanhas e contexto narrativo.
- Perfis de aventureiros para consulta do mestre.
- Bestiário personalizável.
- Geradores de NPC, missão e encontro.
- Diário do mestre.
- Exportação e importação de backup em JSON.

### Mesa Virtual

- Mapas, miniaturas e movimentação.
- Névoa de guerra e campo de visão.
- Transições individuais por portas.
- Controle manual da vez dos participantes.
- Controle visual de PV, dano e cura.
- Efeitos visuais e ambientação climática.
- Fontes de luz configuráveis.
- Música, efeitos sonoros, inventário e títulos de cena.

## Decisões e trade-offs

- **Dois módulos separados:** mantém a preparação do mestre independente da interface do tabuleiro.
- **Sem backend nesta versão:** reduz a complexidade de hospedagem e permite executar o projeto como site estático.
- **Persistência local:** os dados ficam no navegador, sem envio automático para servidores.
- **Jogo presencial:** dados físicos e fichas dos jogadores continuam sendo usados; o sistema oferece apoio de organização e visualização, não um motor de regras completo.

## Tecnologias e conceitos demonstrados

- HTML5 para estrutura.
- CSS3 para layout e identidade visual.
- JavaScript sem framework para lógica e interações.
- Canvas API para renderização e interação com o tabuleiro.
- localStorage para persistência no navegador.
- JSON e File API para backup e restauração.
- GitHub Pages para publicação de aplicação estática.

## Participação do autor

O autor conduziu a concepção do produto, definiu o problema e o escopo, priorizou funcionalidades, tomou decisões de experiência e direção visual, selecionou referências e materiais visuais, testou os fluxos e orientou a correção de problemas observados durante o uso.

A implementação técnica e a evolução do código contaram com assistência de ferramentas de inteligência artificial. Essa colaboração é apresentada de forma transparente. O projeto também demonstra atividades de produto e desenvolvimento: transformar uma ideia em requisitos, avaliar alternativas, testar resultados, identificar falhas e conduzir melhorias.

## Texto curto para currículo

**RPG MASTER + Mesa Virtual | Projeto pessoal**  
Concepção e evolução de uma aplicação web para apoio a sessões presenciais de RPG. Definição de requisitos e fluxos, direção visual, testes funcionais e validação de funcionalidades. Projeto implementado com HTML, CSS e JavaScript, utilizando Canvas API, localStorage, JSON e GitHub Pages, com assistência de ferramentas de IA.

## Apresentação em entrevista

“Eu idealizei uma ferramenta para facilitar a preparação de campanhas e a condução de sessões presenciais de RPG. Separei a solução em dois módulos: um painel para o mestre organizar campanhas, criaturas e anotações, e uma mesa virtual para mapas, miniaturas, névoa, iluminação e efeitos. Durante o desenvolvimento, trabalhei na definição dos requisitos, nas decisões de interface, nos testes e na priorização das melhorias. Usei ferramentas de IA como apoio à implementação e validei as funcionalidades no navegador.”

## Limitações conhecidas

- Não há backend, autenticação ou banco de dados remoto.
- Os dados são armazenados localmente no navegador.
- Não existe sincronização automática entre dispositivos.
- A aplicação não possui rolador de dados nem iniciativa automática.
- A integração dos módulos depende de serem executados na mesma origem.

## Próximas etapas sugeridas

1. Adicionar capturas reais da interface.
2. Criar testes automatizados para os fluxos principais.
3. Separar melhor os módulos JavaScript da Mesa Virtual.
4. Avaliar persistência remota e sincronização como uma evolução futura.
5. Melhorar acessibilidade, documentação e tratamento de erros.
