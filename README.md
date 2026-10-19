# Convite — Fernando & Sthefany

Convite interativo (HTML + CSS + JS) com confirmação de presença gravada numa planilha do Google.

## Ver funcionando agora (modo demonstração)

```bash
cd "convite de casamento"
python3 -m http.server 8000
```

Abra `http://localhost:8000` — e para testar um convite personalizado: `http://localhost:8000/?c=silva`.
Enquanto `apiUrl` estiver vazio em `js/config.js`, as respostas ficam só no navegador (aparecem no painel "Modo demonstração").

## O que editar

Tudo está em **`js/config.js`**: data, local, Pix, WhatsApp, fotos, música. Procure os comentários `>>> TROQUE`.

- **Fotos do casal:** coloque em `assets/fotos/` e liste em `fotos` (a abertura em slides aparece depois do envelope).
- **Música:** coloque o mp3 em `assets/` e informe em `musica`.

## Ligar a planilha (10 minutos)

1. Crie uma planilha em <https://sheets.new> (nome sugerido: *Convidados Casamento*).
2. **Extensões → Apps Script**. Apague o conteúdo e cole o arquivo `apps-script/Code.gs`. Salve.
3. Selecione a função **`configurarPlanilha`** e clique em **Executar**. Autorize o acesso (aviso "app não verificado" → *Avançado → Acessar*). Isso cria as abas **Convidados**, **Respostas** e **Resumo**.
4. **Implantar → Nova implantação → Tipo: App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
   - Copie a URL que termina em `/exec`.
5. Cole essa URL em `js/config.js` → `apiUrl`.
6. Na aba **Resumo**, célula **B1**, cole o endereço do seu site (ex.: `https://usuario.github.io/convite/`). A aba **Convidados** passa a gerar o link de cada família e um botão de WhatsApp.

> Se alterar o `Code.gs` depois, use **Implantar → Gerenciar implantações → Editar → Nova versão**; a URL continua a mesma.

## Lista de convidados

Na aba **Convidados**, uma linha por convite:

| Código | Convidado / Família | Vagas | Nomes (separe com ;) |
|---|---|---|---|
| silva | Família Silva | 4 | Maria Silva; João Silva |

- O link da família é `https://seusite/?c=silva` — só quem tem o link vê os nomes já preenchidos.
- **Vagas** é o limite de pessoas. A família pode adicionar acompanhantes até esse limite.
- A aba **Respostas** é a lista oficial (uma linha por pessoa). Reenviar o formulário **substitui** a resposta anterior daquele código.
- A aba **Resumo** mostra o total de confirmados, crianças, pendentes etc.
- Use códigos difíceis de adivinhar (ex.: `silva-k7x2`) se quiser mais controle.

Para impedir respostas sem link personalizado, ponha `permitirSemCodigo: false` em `config.js` **e** `PERMITIR_SEM_CODIGO = false` no `Code.gs`.

## Publicar no GitHub Pages

1. Crie um repositório e envie estes arquivos (a pasta `apps-script/` é opcional).
2. **Settings → Pages → Deploy from a branch → `main` / root**.
3. O endereço será `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Privacidade

A planilha é privada (só você). A URL do Apps Script fica visível no código do site — por isso o script valida o código do convite e o limite de vagas, e só aceita gravar nas abas de respostas.
