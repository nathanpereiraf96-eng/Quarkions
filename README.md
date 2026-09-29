# Quarkions — site institucional

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Motion. As regras de marca, texto e motion estão em [`CLAUDE.md`](CLAUDE.md).

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # e preencha os valores
npm run dev                  # http://localhost:3000 (ou: npm run dev -- -p 3001)
```

Antes de publicar: `npm run lint` e `npm run build` precisam passar sem erros.

## Variáveis de ambiente

Todas estão listadas em [`.env.example`](.env.example).

| Variável | Obrigatória | Para quê |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sim | Domínio público, sem barra no fim. Usado no canonical, sitemap, robots, Open Graph e JSON-LD. |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase da Quarkions. |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave secreta do Supabase. **Só no servidor** — nunca com prefixo `NEXT_PUBLIC_`. |
| `RESEND_API_KEY`, `EMAIL_NOTIFICACAO`, `RESEND_FROM` | Não | E-mail de aviso a cada pedido de diagnóstico. Sem elas, o aviso é pulado. |
| `NEXT_PUBLIC_GTM_ID` | Não | Contêiner do Google Tag Manager (`GTM-WWNNVG88`). Só carrega depois do "Aceitar" no aviso de cookies. GA4 e Meta Pixel são configurados **dentro** do GTM, nunca no código. |
| `META_PIXEL_ID` | Para a API de Conversões | Id do Pixel da Meta. Só no servidor. |
| `META_CAPI_TOKEN` | Para a API de Conversões | Token de acesso da API de Conversões. **Secreto, só no servidor.** |
| `META_GRAPH_VERSION` | Para a API de Conversões | Versão atual da Graph API, conforme a documentação da Meta (ex.: `v23.0`). |
| `META_TEST_EVENT_CODE` | Não | Código de "Testar eventos" do Gerenciador de Eventos. Só durante testes; vazio em produção. |

## Banco de dados (Supabase)

1. Crie um projeto Supabase para a Quarkions.
2. No SQL Editor, rode, nesta ordem, [`001_diagnosticos.sql`](supabase/migrations/001_diagnosticos.sql) e [`002_event_id.sql`](supabase/migrations/002_event_id.sql). Eles criam a tabela `diagnosticos` com RLS ligado e sem políticas públicas (só o servidor do site, com a service role, lê e escreve) e a coluna `event_id`.
3. Em *Project Settings → API Keys*, copie a URL e a chave secreta para as variáveis acima.
4. Teste: envie um diagnóstico pelo site e confira a nova linha em *Table Editor → diagnosticos*.

## Deploy na Vercel

1. Suba o repositório para o GitHub e importe em [vercel.com/new](https://vercel.com/new). O framework (Next.js) é detectado sozinho; não mude os comandos de build.
2. Em *Settings → Environment Variables*, cadastre as variáveis da tabela para **Production** (e **Preview**, se quiser testar os envios lá). Marque `SUPABASE_SERVICE_ROLE_KEY` como *Sensitive*.
3. Em `NEXT_PUBLIC_SITE_URL`, use o domínio final, por exemplo `https://quarkions.com.br`. Variáveis `NEXT_PUBLIC_*` entram no build: depois de mudar uma delas, faça um novo deploy.
4. Faça o deploy e confira a URL `*.vercel.app` gerada.

### Domínio

1. Em *Settings → Domains*, adicione o domínio (ex.: `quarkions.com.br`) e também o `www`.
2. No provedor do domínio (Registro.br, por exemplo), crie os registros DNS que a Vercel mostrar — normalmente um registro `A` no domínio raiz apontando para o IP indicado e um `CNAME` em `www` apontando para `cname.vercel-dns.com`.
3. Escolha qual versão é a principal (com ou sem `www`) e deixe a outra redirecionando. Ela precisa ser igual à `NEXT_PUBLIC_SITE_URL`.
4. O certificado HTTPS é emitido automaticamente depois que o DNS propagar.

### Depois do primeiro deploy

- Abra `/robots.txt` e `/sitemap.xml` e confira se mostram o domínio certo.
- Cadastre o domínio no Google Search Console e envie o sitemap.
- Teste a prévia de compartilhamento (Open Graph) colando um link do site no WhatsApp ou num validador de OG.
- Envie um pedido de diagnóstico de teste e confira no Supabase.

## Rastreamento (GTM, dataLayer e API de Conversões)

- Nada de medição carrega antes do "Aceitar" no aviso de cookies. Ao aceitar, o GTM carrega na hora. Se a pessoa aceitar e depois recusar (em "Preferências de cookies", no rodapé), os cookies `_ga*`, `_fbp` e `_fbc` são apagados e a página recarrega.
- O código só empurra eventos para o `dataLayer` ([`src/lib/rastreamento.ts`](src/lib/rastreamento.ts)); as tags vivem no contêiner. Nomes e parâmetros são o contrato com o GTM:

| Evento | Quando | Parâmetros |
|---|---|---|
| `diagnostico_aberto` | Abrir o modal ou carregar `/diagnostico` | `origem` |
| `diagnostico_etapa_2` | Avançar para a etapa 2 | `origem` |
| `diagnostico_enviado` | Só depois da resposta `ok` da API | `origem`, `event_id`, `tipo_clinica`, `volume_leads` |
| `como_funciona_concluido` | Partícula chega à etapa 5 (uma vez por sessão) | — |
| `whatsapp_clique` | Clique em link `wa.me` | `origem` |
| `virtual_page_view` | Troca de rota (exceto o primeiro carregamento) | `page_path` |

- Nenhum dado pessoal vai para o `dataLayer`. O Lead também é enviado pelo servidor à API de Conversões da Meta ([`src/lib/meta-capi.ts`](src/lib/meta-capi.ts)), com o **mesmo `event_id`** do navegador — a Meta descarta a duplicata. O envio só acontece com cookies aceitos, roda depois da resposta ao visitante e nunca derruba o formulário.
- Testes da API de Conversões: `npm test`.

### Como testar

1. **GTM:** no Tag Manager, clique em *Visualizar* e informe `http://localhost:3000` (ou a URL publicada). No site, aceite os cookies, navegue, abra e envie o formulário, e confira no Tag Assistant se cada tag dispara no evento certo.
2. **GA4:** em *Relatórios → Tempo real* ou *Administrador → DebugView*, confira o `generate_lead` com o parâmetro `origem` (o nome do evento no GA4 é definido na tag do GTM).
3. **Meta:** no Gerenciador de Eventos, abra *Testar eventos*, copie o código para `META_TEST_EVENT_CODE`, reinicie o servidor e envie um diagnóstico com cookies aceitos. O Lead deve aparecer duas vezes (Navegador e Servidor) e ser marcado como deduplicado. Depois, apague o código.
4. **Recusa:** em uma janela anônima, abra o DevTools → *Network*, clique em "Recusar" e use o site. Nenhuma requisição pode ir para `googletagmanager.com`, `google-analytics.com`, `facebook.net` ou `graph.facebook.com`.

## Antes de publicar de verdade

- [ ] Nenhum número de resultado no site sem métricas reconciliadas (fonte, período e denominador).

## Estrutura

- `src/app/` — páginas, rota `api/diagnostico`, metadata, imagens Open Graph, sitemap e robots.
- `src/components/home/` — uma seção da home por componente; `como-funciona/` é a trilha da partícula.
- `src/components/diagnostico/` — formulário, modal e contexto do "Agendar diagnóstico".
- `src/lib/` — dados institucionais, schema do formulário, motion, SEO, consentimento e analytics.
- `assets/` — fontes TTF usadas só nas imagens Open Graph.
