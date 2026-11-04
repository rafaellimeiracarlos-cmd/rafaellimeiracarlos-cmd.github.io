# Portfólio Rafael Limeira Carlos — versão 3 interativa

Website estático em HTML, CSS e JavaScript puro, pronto para GitHub Pages. Responsivo para celular, tablet e desktop.

## Melhorias realizadas
- Fundo tecnológico azul otimizado (`fundo-tecnologico.webp`), baseado na arte criada para o portfólio.
- Interface de editor de código e aplicativo Android **reais em HTML/CSS** (não são prints): animações de hover, elevação e parallax com mouse.
- Laboratório interativo: botões **Desktop / Tablet / Celular** alternam de verdade o tamanho da interface.
- Animações de entrada ao rolar a página, efeito de hover em serviços/projetos e menu de celular.
- Cards de projetos ligados a repositórios públicos visíveis no GitHub. Revise cada descrição antes de compartilhar profissionalmente.
- Sistema opcional de screenshots reais dos projetos, configurados por projeto em `config.js`.
- GitHub, e-mail e botões de LinkedIn, WhatsApp e currículo em PDF (estes três últimos só aparecem se houver link válido).
- Barra de progresso de leitura e botão voltar ao topo.
- Acessibilidade básica: navegação por teclado, controle de menu, foco visível e respeito à preferência de movimento reduzido.

## Ver o site no computador
1. Extraia este ZIP.
2. Abra `index.html` pelo navegador ou pelo VS Code + Live Server.
3. Edite `config.js` para trocar seu nome, habilidades, descrição, repositórios e contatos.

## Como colocar capturas REAIS dos seus aplicativos
1. Dentro da pasta do projeto, crie `assets/projetos` se ela ainda não existir.
2. Copie para ela uma imagem do seu aplicativo, por exemplo `rcar-app.png`.
3. Em `config.js`, localize o objeto de projeto e troque `imagem: ""` por `imagem: "assets/projetos/rcar-app.png"`.
4. Repita para os outros projetos. Sem uma imagem, o site mostra **CAPA ILUSTRATIVA**, em vez de fingir que existe uma captura real.
5. Envie também a pasta `assets` para o GitHub.

## Contato e LinkedIn
- `email` está preenchido com o endereço exibido na captura do seu GitHub. Caso não queira torná-lo público, apague o endereço das aspas e o site ocultará o botão de e-mail e desativará o formulário.
- `linkedin` está vazio pois não temos a URL exata: preencha com seu endereço real.
- `whatsapp`: código do país + DDD + número, somente dígitos; é opcional.
- `curriculo`: use `assets/curriculo-rafael.pdf` depois de colocar o seu PDF nessa pasta.
- O formulário NÃO envia mensagens sozinho: ele abre o programa de e-mail do visitante com uma mensagem pré-preenchida.

## Atualizar o GitHub Pages que você JÁ criou
Seu repositório: https://github.com/rafaellimeiracarlos-cmd/rafaellimeiracarlos-cmd.github.io

1. Abra o repositório no GitHub.
2. Clique em **Add file → Upload files**.
3. Extraia o ZIP e envie para a **raiz** do repositório os arquivos: `index.html`, `styles.css`, `script.js`, `config.js`, `favicon.svg` e `fundo-tecnologico.webp`. Envie também `assets` quando adicionar screenshots ou currículo.
4. Confirme a substituição/atualização dos quatro arquivos anteriores, se for solicitado.
5. Em **Commit changes**, escreva: `Atualiza portfólio com animações e versão responsiva`.
6. Aguarde a publicação automática do GitHub Pages. Não é necessário reconfigurar Pages: seu repositório já usa `main / (root)`.
7. Acesse https://rafaellimeiracarlos-cmd.github.io/ e atualize a página (Ctrl+F5) se aparecer a versão antiga.

## Notas
- O fundo e todos os elementos de interação funcionam sem back-end.
- As animações de hover são progressivas: em dispositivos de toque há layout adaptado, sem depender de mouse.
- Os projetos de demonstração são capas ilustrativas e devem ser substituídos por capturas reais assim que possível.
- Nenhuma estatística fictícia, depoimento ou experiência profissional foi inventada.
