# Convite — Fernando & Sthefany

Convite interativo (HTML + CSS + JS) com link único: cada convidado confirma presença informando nome e sobrenome de quem vai, e as respostas são gravadas numa planilha do Google.

## Ver funcionando agora (modo demonstração)

```bash
cd "convite de casamento"
python3 -m http.server 8000
```

Abra `http://localhost:8000`.
Enquanto `apiUrl` estiver vazio em `js/config.js`, as respostas ficam só no navegador (aparecem no painel "Modo demonstração").

## O que editar

Tudo está em **`js/config.js`**: data, local, Pix, WhatsApp, fotos, música. Procure os comentários `>>> TROQUE`.

- **Fotos do casal:** coloque em `assets/fotos/` e liste em `fotos` (a abertura em slides aparece depois do envelope).
- **Música:** coloque o mp3 em `assets/` e informe em `musica`.

## Ligar a planilha (10 minutos)

1. Crie uma planilha em <https://sheets.new> (nome sugerido: *Convidados Casamento*).
2. **Extensões → Apps Script**. Apague o conteúdo e cole o arquivo `apps-script/Code.gs`. Salve.
3. Selecione a função **`configurarPlanilha`** e clique em **Executar**. Autorize o acesso (aviso "app não verificado" → *Avançado → Acessar*). Isso cria as abas **Respostas** e **Resumo**.
4. **Implantar → Nova implantação → Tipo: App da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
   - Copie a URL que termina em `/exec`.
5. Cole essa URL em `js/config.js` → `apiUrl`.

> Se alterar o `Code.gs` depois, use **Implantar → Gerenciar implantações → Editar → Versão: Nova versão**; a URL continua a mesma.
>
> Se o Apps Script der "Página não encontrada" ao abrir pela planilha, é por causa de várias contas Google logadas no mesmo Chrome. Use uma janela anônima só com a conta da planilha.

## Como funciona (link único)

Todos os convidados recebem o mesmo link. Ao confirmar presença, cada um escreve **nome e sobrenome** de quem vai (ele mesmo e os acompanhantes), marca "Vou/Não vou" e "Criança", e envia.

**Aba Respostas** — uma linha por pessoa:

| Data/hora | Código | Família | Nome | Status | Criança? | WhatsApp | Recado |
|---|---|---|---|---|---|---|---|

- *Código* é gerado automaticamente e é igual para todas as pessoas do mesmo envio. *Família* é o nome da primeira pessoa do envio.
- Quem enviar duas vezes aparece duas vezes: apague as linhas repetidas à mão.
- Use essa aba para conferir os nomes com a lista de convidados do casal.

**Aba Resumo** — contadores automáticos (fórmulas sobre a aba Respostas): pessoas confirmadas, das quais crianças, adultos e pessoas que não vão. Não apague as fórmulas.

O máximo de pessoas por envio é `maxPessoas` em `js/config.js` (mantenha igual a `MAX_PESSOAS` no `Code.gs`).

## Publicar no GitHub Pages

1. Crie um repositório e envie estes arquivos (a pasta `apps-script/` é opcional).
2. **Settings → Pages → Deploy from a branch → `main` / root**.
3. O endereço será `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Privacidade

A planilha é privada (só quem tem acesso à conta). A URL do Apps Script fica visível no código do site — por isso o script só aceita gravar na aba Respostas, limita o número de pessoas por envio e neutraliza textos que virariam fórmulas.
