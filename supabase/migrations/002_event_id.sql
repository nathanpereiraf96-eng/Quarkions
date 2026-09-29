-- event_id do pedido: o mesmo enviado ao Pixel (navegador, via GTM) e à API de Conversões
-- (servidor), para a Meta deduplicar o Lead.
alter table public.diagnosticos add column if not exists event_id text;
