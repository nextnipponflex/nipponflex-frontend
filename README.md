# Portal Nipponflex — HTML revisado

Protótipo estático em espanhol, com entradas independentes para Desktop e mobile.
O visual final aprovado foi mantido; os módulos compartilhados e recursos de mídia
agora possuem uma única cópia.

## Executar

No repositório, execute `python3 -m http.server 8080 --directory dist`.
No ZIP exportado, execute `python3 -m http.server 8080` na pasta extraída.
Abra `http://localhost:8080/` ou `http://localhost:8080/portal.html`.
A interface mobile é selecionada automaticamente abaixo de 1024 pixels CSS.
A consulta e a rota atual são preservadas ao trocar de interface.

## Organização

| Caminho | Responsabilidade |
|---|---|
| `index.html`, `portal.html` | Entrada Desktop |
| `mobile/index.html`, `mobile/portal.html` | Entrada mobile |
| `assets/js/shared/` | Dados demonstrativos, componentes, relatórios, formulários e roteamento |
| `assets/js/desktop/` | Menu lateral, home, indicadores e gráficos Desktop |
| `assets/js/mobile/` | Home, calendário, contato e pequenas diferenças mobile |
| `assets/css/shared.css` | Base e componentes compartilhados |
| `assets/css/desktop.css` | Layout e componentes Desktop |
| `assets/css/desktop/points.css` | Configuração final dos seis indicadores de Mis puntos |
| `assets/css/mobile.css` | Layout e componentes mobile |
| `assets/css/landing-*.css` | Página de entrada de cada interface |
| `assets/media/`, `assets/flags/`, `assets/docs/` | Recursos compartilhados, sem cópias por interface |
| `assets/vendor/` | Bibliotecas de exportação e respectivas licenças |
| `mobile-fabio/` | Redirecionamentos de compatibilidade com os links antigos |

Os scripts são clássicos e dependem da ordem declarada nas páginas. Não ordene
alfabeticamente as inclusões e não transforme arquivos isolados em módulos ES sem
adaptar suas dependências. Nenhum gerenciador de pacotes ou compilação é necessário.

## Verificar alterações

- `python3 tools/validate.py` — sintaxe JavaScript e referências locais HTML/CSS.
- `python3 -m unittest discover -s tests` — regras da limpeza de estilos.
- `node tests/point-contracts.cjs` — indicadores, escalas de cor, colunas e casos vazios.

As páginas de teste e cópias de versões anteriores não fazem parte da publicação.
O relatório da revisão está em `REVISAO.md`.

## Limites do protótipo

A limpeza não transforma os dados demonstrativos em dados reais. O acesso de
demonstração é implementado no frontend; autenticação, autorização e integrações
reais exigem backend. Arquivos, preferências e formulários salvos no navegador
continuam locais e não são transportados pelo ZIP. Bibliotecas de terceiros foram
preservadas com suas licenças, sem atualização cega de versões.

O acesso ao protótipo usa o botão de demonstração, sem código ou senha. Não há autenticação real no frontend.
