# Revisão do Portal Nipponflex — 16/11/2026

Revisão baseada na última versão publicada, preservando o visual aprovado de cada
interface. A validação é de frontend estático, não uma certificação de segurança
ou de integrações empresariais.

## Resultado resumido

- Arquivos públicos: 173 → 79.
- Tamanho sem compressão: aproximadamente 88 MB → 34 MB, redução de cerca de 61%.
- Recursos idênticos compartilhados por hash; removidos 14 recursos de mídia sem referência.
- Eliminadas 1.452 declarações repetidas de CSS na mesma combinação de seletor,
  propriedade e contexto. Estilos dos indicadores também foram reescritos em um
  único módulo final, removendo mais 155 declarações históricas.
- CSS inline e núcleo JavaScript extraídos das páginas; separação explícita entre
  base compartilhada, Desktop e mobile. A ordem de dependências foi preservada.

## Correções realizadas

- Retirada de controles e estados da agenda que pertenciam a versões abandonadas.
- Remoção do globo oculto e dos antigos cards e ferramentas ocultos da home Desktop.
- Remoção de um carrossel antigo de notícias e de seus temporizadores, substituídos
  pela versão final que já aparecia para o usuário.
- Remoção da decoração oculta que podia ser inserida repetidamente na home.
- Correção da prioridade de fontes nos indicadores: 32 px nos números, 16 px em
  situação/graduação, cards de 110 px e azul-escuro #0B224B.
- Correção da entrada direta em `portal.html#Puntos`, que podia renderizar a versão
  compartilhada antes de carregar as adaptações finais do Desktop.
- Correção de caminhos de bandeiras construídos dinamicamente pelo JavaScript.
- Adicionado estado vazio seguro ao gráfico de colunas.
- Foco de teclado visível no perfil; retorno do foco e contenção de Tab no detalhe
  de eventos. A rotação das notícias respeita a preferência de movimento reduzido.
- Links antigos de `mobile-fabio` preservados por redirecionamento.

## Verificações

- Sintaxe de todos os 29 arquivos JavaScript, incluindo as bibliotecas distribuídas.
- Referências de páginas, estilos, imagens e documentos, incluindo o conjunto de bandeiras.
- Seis testes automatizados do consolidador de estilos e contratos funcionais dos
  indicadores, escala das roscas, colunas mensais, dados vazios/zero e isolamento mobile.
- Navegação pelas 13 telas principais Desktop e cinco seções mobile.
- Menu recolhível, paginação da agenda, alternância Lista/Agenda, seletor de mês,
  seleção da rosca e download concluído de um PDF de exemplo.
- Home mobile com as mesmas medidas observadas antes da refatoração em 402 × 874.
- Sem transbordamento horizontal da página nas larguras verificadas.

## Ambientes e limites

Testes no Chrome, com áreas de conteúdo em pixels CSS: 1366 × 768, 1536 × 864,
1280 × 720, 402 × 874 e 360 × 800. São referências de notebook e celular;
não houve teste em um Samsung Galaxy Book físico nem no Safari de um iPhone 17 Pro.
Touch, teclado virtual, barras dinâmicas e comportamento específico do Safari
precisam de uma rodada nesses aparelhos. Os dados continuam demonstrativos e a
persistência existente continua no navegador. Não foram trocadas bibliotecas de
terceiros sem um motivo funcional verificado.
