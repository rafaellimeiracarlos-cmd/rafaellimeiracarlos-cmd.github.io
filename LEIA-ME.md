# Rafael.Dev V7 — Demo funcional

Abra `index.html` no navegador ou publique a pasta toda no GitHub Pages.

A seção **Demo interativa** carrega `demo.html` dentro de um iframe local. Mantenha `demo.html`, `script.js`, `styles.css`, `config.js` e os demais recursos junto do `index.html`.

**Funcionalidades:** visualização Site, Tablet, Android e iPhone; loja demonstrativa; busca de produtos; favoritos; carrinho com quantidades e total; simulação de pedido; tarefas com inclusão, conclusão e exclusão. Os dados de demonstração são fictícios e ficam no armazenamento local do navegador. Nenhuma venda ou pagamento real é efetuado.

**Teste:** selecione uma plataforma; abra Loja, adicione um item e confira Carrinho; crie uma tarefa e marque como concluída. A função Reiniciar demonstração recarrega a experiência e apaga os dados de exemplo.

Publicado em HTTPS no GitHub Pages, o mesmo iframe funciona no site. Para testar localmente, prefira `python -m http.server 8000` na pasta e acesse `http://localhost:8000`.

## Vitrine de projetos
A seção Projetos agora possui filtros, cartões e modal para examinar detalhes. Os links dos repositórios são definidos em `config.js`. As capas são ilustrações até serem substituídas por imagens reais.


## ATUALIZAÇÃO V8 — Foto original e apresentação profissional
- Foto **original** enviada pelo Rafael, sem regeneração nem alterações faciais. A versão `assets/foto-rafael.png` tem apenas recorte circular e transparência; `assets/foto-original.png` guarda a imagem recebida inteira.
- Foto circular com moldura azul na apresentação inicial e avatar menor na navegação.
- Melhorias de responsividade, legibilidade, iluminação visual e hierarquia de texto.
- Os projetos, botões, navegação, demo interativa e configurações da versão 7 foram preservados.

**Para testar:** abra `index.html` no navegador. Para publicar, envie TODOS os arquivos, incluindo a pasta `assets`, ao repositório GitHub Pages.
