@AGENTS.md

# Quarkions — regras do projeto

## Stack
Next.js App Router, TypeScript, Tailwind v4, Motion (motion/react). Fonte única: Schibsted Grotesk.

## Conceito visual: "Câmara de nuvens"
Cada lead é uma partícula; a Quarkions dá trajetória a ela. Trilhas finas e curvas (SVG, stroke 1–1.5px) aparecem com parcimônia.
- Ultramar = IA. Âmbar = humano. Essa codificação é semântica: use âmbar SEMPRE que o conteúdo for sobre handoff/pessoa, e em nenhum outro lugar.
- Ciano só sobre fundo `camara`.
- Um único momento ousado no site: a trilha da partícula (seção "Como funciona"). Todo o resto é calmo.

## Regras de motion
- Easing padrão "orbita": cubic-bezier(0.22, 1, 0.36, 1). Durações: 0.2s (feedback), 0.45s (transição), 0.9s (orquestração).
- Movimento não disparado pelo usuário só em: sequência de carregamento do hero e trilha no scroll. PROIBIDO fade/slide-in genérico em cada seção e hover animado em cada card.
- Animações que respondem a ações (abrir, expandir, confirmar, trocar de etapa) são bem-vindas.
- `prefers-reduced-motion`: todo movimento tem fallback estático equivalente em conteúdo.
- Animar só transform e opacity (e pathLength em SVG).

## Regras de texto
- Sentence case sempre. Sem CAIXA ALTA em rótulos, sem eyebrow acima de cada título, sem "→" em botões, sem destacar uma palavra do título em outra cor.
- O CTA se chama sempre "Agendar diagnóstico". O envio do formulário se chama "Agendar diagnóstico"; a confirmação diz "Diagnóstico solicitado".
- Falar de dor e resultado, não de tecnologia. Evitar "LLM", "prompt", "modelo", "revolucionário", "inteligência artificial de ponta".
- PROIBIDO: números de resultado (%, "x vezes mais"), depoimentos inventados, logos de clientes ou de marcas, preços, apresentar ESTER/MARIA/Voice AI/plataforma como produtos disponíveis, prometer autonomia total ou resultado garantido.
- O agente nunca faz diagnóstico clínico — reforçar isso onde fizer sentido.
- A Quarkions (Quarkions Technology LTDA) não tem relação com a Alivi nem com o Grupo Alivi: nunca citar a Alivi no site, em metadata ou em dados estruturados.

## Qualidade
Responsivo a partir de 360px, foco de teclado visível (outline ultramar 2px, offset 3px; branco sobre fundo escuro — `data-tema="escuro"` ou `.foco-claro`), contraste AA, HTML semântico, Lighthouse ≥ 95 em acessibilidade.

## Tokens (Tailwind)
- Cores: `nevoa`, `grafite`, `grafite-suave`, `linha`, `ultramar`, `ciano`, `ambar`, `camara`, `camara-linha` (paleta padrão do Tailwind desativada; só `white`, `transparent`, `current` além destas).
- Tipo: `text-display`, `text-h2`, `text-h3`, `text-lead`, `text-body`, `text-small` (já incluem peso, entrelinha e tracking). Algarismos tabulares: use `<Nums>` (ui/Nums), não `.nums` direto em texto com ":" ou "," — o `tnum` desta fonte alarga a pontuação.
- Raios: `rounded-botao` (10px), `rounded-painel` (20px), `rounded-pilula` (999px). Sem sombras.
- Layout: `container-site` (1240px, padding 20/40px), `grid-site` (12 colunas, gutter 24px), `max-w-texto` (68ch).
- Easing: `ease-orbita`.
- Breakpoint `nav:` (900px): navegação completa do header.

## Componentes base
- `lib/motion.ts`: `EASE_ORBITA`, `DUR`, `useReducedMotionSafe()`. `MotionConfig reducedMotion="user"` no layout. Motion não-transform (clipPath, pathLength) precisa checar `useReducedMotionSafe` e zerar a duração.
- `lib/site.ts`: dados institucionais (campos vazios são omitidos), `NAVEGACAO`, `CTA`.
- `Trilha` (motion/Trilha): `desenhar` omitido = estática; `false` = oculta; `true` = desenha (com movimento reduzido, aparece pronta). `comParticula` para a partícula na ponta.
- `Botao` (ui/Botao): `primario` | `secundario` | `sobre-escuro`; `href` vira link.
- `Section` (tema claro/branco/escuro, aplica `data-tema`) e `Container` (layout). Seções escuras DEVEM usar `data-tema="escuro"`: o header depende disso.

## Home
- `src/app/page.tsx` monta as seções de `src/components/home/`, uma por componente.
- `Hero`: única sequência orquestrada de carregamento (~1.6s). `HeroSimulacao`: roteiro numa linha do tempo em ms (`ROTEIRO`); o estado é derivado do tempo decorrido, pausar = parar o relógio. O cronômetro "Primeira resposta" é parte da simulação e não aparece em nenhum outro lugar.
- Para decidir só a `transition` (que não vai para o HTML do servidor), pode usar `useReducedMotion()` direto; para decidir o que é renderizado, use `useReducedMotionSafe()`.
- `ComoFunciona` (seção-assinatura, `home/como-funciona/`): a escolha entre versões é só CSS — `TrilhaSticky` (500vh, a partir de `nav:` com `motion-safe:`) e `TrilhaLista` (mobile e movimento reduzido). Nós, partícula e partículas secundárias ficam no path via `offset-path`; o scroll só mexe em MotionValues, e o estado do React muda apenas ao cruzar um nó.
- `pathOffset` do Motion não funciona com MotionValue em `style`: para traço que começa no meio do path, use `pathLength={1}` + `strokeDasharray`/`strokeDashoffset` manuais.
- Motion lê `prefers-reduced-motion` uma vez, no carregamento. Ao testar, recarregue a página depois de mudar a preferência (trocar só o `#hash` não recarrega).
- Ordem da home (fixa): Hero → Problema → Integrações → Para quem é → Como funciona → Implantação → O que medimos → Segurança → FAQ → CTA final. "Para quem é" e "Como funciona" são escuras e vizinhas: separadas por borda `camara-linha`.
- `CtaFinal`: a trilha é montada em px a partir da posição medida do título e do botão (ResizeObserver), para a partícula terminar exatamente no botão.

## Diagnóstico (formulário)
- Todo botão "Agendar diagnóstico" usa `BotaoDiagnostico origem="<id-da-seção>"`: é link para `/diagnostico` e, com JS, abre o modal (`useDiagnostico().abrir(origem)`).
- Schema único em `lib/diagnostico/schema.ts` (cliente e servidor). Servidor em `lib/diagnostico/servidor.ts` (`server-only`): service role, rate limit em memória, e-mail via Resend opcional.
- `SUPABASE_SERVICE_ROLE_KEY` nunca com prefixo `NEXT_PUBLIC_` nem importada em componente cliente.
- Foco preso em modais/painéis: `useFocoPreso(ref, ativo, aoFechar)`; o foco inicial vai para `[data-foco-inicial]`.
- Erros de campo: texto específico + `aria-invalid` + `aria-describedby`, resumo em `aria-live`, foco no primeiro campo com erro. Sem cor de erro fora da paleta.

## Páginas de apoio
- `/como-implantamos`, `/seguranca`, `/sobre`, `/privacidade`: `PageHero` no topo, blocos editoriais com `Bloco` (título à esquerda, texto à direita), `CtaFinal` no fim. Sem simulação nem trilha por scroll.
- Etapas da implantação vivem em `lib/implantacao.ts` (home e /como-implantamos).
- Acordeões: `ui/Acordeao` (usado no FAQ e em /seguranca).
- `/privacidade` foi revisada e aprovada pelo jurídico: mudanças no texto passam por nova revisão.
- `components/sobre/Equipe.tsx` fica desativado até existirem fotos reais.

## SEO, consentimento e performance
- Metadata por página com `metadados()` (lib/seo.ts): título ≤ 60, descrição ≤ 155, canonical. `metadataBase` vem de `NEXT_PUBLIC_SITE_URL`.
- Open Graph: `opengraph-image.tsx` por rota, gerado por `imagemOg(titulo)` (lib/og.tsx) com as TTFs de `assets/`.
- JSON-LD: `Organization` no layout, `FAQPage` na home (dados em lib/faq.ts).
- Consentimento: cookie `quarkions_consentimento` (180 dias). O aviso vem no HTML do servidor; `SCRIPT_CONSENTIMENTO` no <head> o esconde antes da pintura se já houver escolha (não atrasa o LCP). "Preferências de cookies" reabre o aviso; aceito → recusado apaga `_ga*`/`_fbp`/`_fbc` e recarrega.

## Rastreamento (contrato com o GTM — não renomear)
- Só o GTM (`NEXT_PUBLIC_GTM_ID`) entra no front, carregado por `components/Rastreamento.tsx` após o aceite. GA4 e Meta Pixel vivem no contêiner: nenhum id deles no código do cliente.
- Eventos só via `track()` (lib/rastreamento.ts, união tipada): `diagnostico_aberto`, `diagnostico_etapa_2`, `diagnostico_enviado` (com `event_id` e slugs), `como_funciona_concluido`, `whatsapp_clique`, `virtual_page_view`. NUNCA nome, e-mail, telefone ou texto livre no dataLayer.
- Lead duplicado de propósito: navegador (Pixel via GTM) e servidor (`lib/meta-capi.ts`, via `after()` na rota) com o mesmo `event_id`; a Meta deduplica. CAPI só com `consentimento_cookies === true`. `META_*` só no servidor.
- Links `wa.me`: `whatsapp_clique` é automático; use `data-origem` no link (ou no container) para definir a origem.
- Testes: `npm test` (node:test em `tests/`).
- A entrada do hero é CSS (`.hero-*` em globals.css), não Motion: o texto é o LCP e não pode esperar a hidratação.
- "Como funciona" chega no HTML como `EtapasEstaticas`; a trilha interativa entra por `dynamic()` quando a seção se aproxima (`CarregarPerto`).
