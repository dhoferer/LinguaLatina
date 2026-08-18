-- ============================================================================
-- Migration: Sicherheits-Haertung "players" + optionaler Klassenbeitritt
-- ============================================================================
-- WICHTIG - BITTE VOR DEM AUSFUEHREN LESEN:
--
-- 1) Dieses Skript wurde NICHT gegen eine echte Supabase-Instanz getestet.
--    Ich (Claude) habe keinen Zugriff auf produktive Zugangsdaten und habe
--    absichtlich NICHTS gegen eure Datenbank ausgefuehrt. Bitte fuehrt dieses
--    Skript selbst im Supabase SQL Editor aus und meldet Fehlermeldungen
--    zurueck, falls welche auftreten.
--
-- 2) Das Skript ist so geschrieben, dass es KEINE bestehenden Zeilen in
--    "players" loescht oder ueberschreibt. Es aendert ausschliesslich:
--      - Berechtigungen (GRANT/REVOKE)
--      - Row Level Security Policies
--      - Eine neue View (leaderboard_view)
--      - Neue Funktionen (RPCs)
--    Bestehende Profile/Lernstaende bleiben erhalten.
--
-- 3) Nach dem Ausfuehren funktioniert KEIN direkter Tabellenzugriff auf
--    "players" mehr aus dem Browser (weder lesend noch schreibend). Das ist
--    beabsichtigt. Die App muss dafuer den zeitgleich veroeffentlichten
--    Frontend-Code verwenden (der bereits auf RPCs umgestellt ist).
--
-- 4) Empfohlene Reihenfolge: Dieses SQL zuerst ausfuehren, DANACH den
--    aktualisierten Code deployen (oder umgekehrt - die App faellt bei
--    fehlenden RPCs automatisch auf "nur lokal, ohne Cloud-Sync" zurueck,
--    es gibt also keinen Absturz in beiden Reihenfolgen).
--
-- 5) Bitte VORHER in Supabase pruefen (Dashboard):
--      - Database > Backups: Ist Point-in-Time-Recovery aktiv? Falls ja,
--        seid ihr gegen Fehler in diesem Skript zusaetzlich abgesichert.
--      - Database > Roles: Es wird davon ausgegangen, dass nur die
--        Standard-Rollen "anon" und "authenticated" existieren (Supabase-
--        Default). Falls ihr eigene Rollen mit Tabellenzugriff angelegt
--        habt, muesst ihr diese Revokes zusaetzlich anpassen.
-- ============================================================================

-- Fuer kryptografisch sichere Zufallswerte (gen_random_bytes, gen_random_uuid)
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1) Spalten sicherstellen (idempotent - falls schon vorhanden, passiert nichts)
-- ----------------------------------------------------------------------------
alter table public.players add column if not exists sync_code text unique;
alter table public.players add column if not exists completed_lessons jsonb default '[]'::jsonb;
alter table public.players add column if not exists vocab_progress jsonb default '{}'::jsonb;
alter table public.players add column if not exists unlocked_badges jsonb default '[]'::jsonb;

-- Phase 2: Klassencode ist jetzt optional (kein Beitrittszwang mehr)
alter table public.players alter column class_code drop not null;

-- Sinnvolle Wertebereiche als zusaetzliche Absicherung (Defense in Depth,
-- unabhaengig von der Validierung in den Funktionen weiter unten)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'players_xp_nonneg') then
    alter table public.players add constraint players_xp_nonneg check (xp >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'players_streak_nonneg') then
    alter table public.players add constraint players_streak_nonneg check (streak >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'players_alias_len') then
    alter table public.players add constraint players_alias_len check (char_length(alias) between 1 and 24);
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 2) Alte, komplett offene Policies entfernen
-- ----------------------------------------------------------------------------
-- Diese drei Policies (falls ihr meine urspruenglichen Anweisungen 1:1
-- ausgefuehrt habt) erlaubten JEDEM mit dem oeffentlichen anon-Key
-- uneingeschraenktes Lesen/Schreiben/Aendern JEDER Zeile. Das war der
-- Kern-Fehler - nicht der anon-Key selbst, sondern das Fehlen echter
-- RLS-Einschraenkungen.
drop policy if exists "read_all" on public.players;
drop policy if exists "insert_all" on public.players;
drop policy if exists "update_all" on public.players;

alter table public.players enable row level security;
alter table public.players force row level security;
-- Ab hier: RLS ist aktiv, aber es existiert KEINE Policy mehr fuer
-- anon/authenticated -> impliziter Deny-All fuer jeden direkten Zugriff.

-- ----------------------------------------------------------------------------
-- 3) Direkte Tabellenrechte fuer anon/authenticated vollstaendig entziehen
-- ----------------------------------------------------------------------------
revoke all on public.players from anon, authenticated;

-- ----------------------------------------------------------------------------
-- 4) Oeffentliche Rangliste: View mit NUR unkritischen Spalten
-- ----------------------------------------------------------------------------
-- device_secret, sync_code, completed_lessons, vocab_progress sind hier
-- bewusst NICHT enthalten und daher ueber die Rangliste nie abrufbar.
drop view if exists public.leaderboard_view;
create view public.leaderboard_view as
select id, alias, avatar, xp, streak, class_code
from public.players
where class_code is not null;

grant select on public.leaderboard_view to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 5) Interne Validierungs-Helfer (nicht direkt von aussen aufrufbar, siehe unten)
-- ----------------------------------------------------------------------------
create or replace function public._validate_alias(p_alias text)
returns text
language plpgsql
as $$
declare
  v_alias text := btrim(coalesce(p_alias, ''));
begin
  if char_length(v_alias) < 2 or char_length(v_alias) > 24 then
    raise exception 'Spitzname muss zwischen 2 und 24 Zeichen lang sein.';
  end if;
  if v_alias ~ '[<>{}$;\\"]' then
    raise exception 'Spitzname enthaelt nicht erlaubte Zeichen.';
  end if;
  return v_alias;
end;
$$;

create or replace function public._validate_avatar(p_avatar text)
returns text
language plpgsql
as $$
declare
  v_allowed text[] := array['🦅','🛡️','⚔️','🔥','🌿','🦁','🐺','🏛️','⚡','🐍','🌊','☀️'];
begin
  if p_avatar is null or not (p_avatar = any(v_allowed)) then
    raise exception 'Ungueltiger Avatar.';
  end if;
  return p_avatar;
end;
$$;

create or replace function public._validate_class_code(p_code text)
returns text
language plpgsql
as $$
declare
  v_code text;
begin
  if p_code is null or btrim(p_code) = '' then
    return null;
  end if;
  v_code := lower(btrim(p_code));
  if char_length(v_code) > 40 then
    raise exception 'Klassencode ist zu lang (max. 40 Zeichen).';
  end if;
  if v_code ~ '[<>{}$;\\"]' then
    raise exception 'Klassencode enthaelt nicht erlaubte Zeichen.';
  end if;
  return v_code;
end;
$$;

-- Kryptografisch zufaelliger Sync-Code: 10 Zeichen aus 32 Symbolen
-- (keine verwechselbaren Zeichen wie O/0, I/1) = 32^10 ≈ 1,1 * 10^15
-- moegliche Kombinationen. Praktisch nicht erratbar, unabhaengig davon
-- aber ohnehin nie ueber die Rangliste oder select("*") abrufbar.
create or replace function public._generate_sync_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  loop
    result := '';
    for i in 1..10 loop
      result := result || substr(chars, 1 + (get_byte(gen_random_bytes(1), 0) % length(chars)), 1);
    end loop;
    exit when not exists (select 1 from public.players where sync_code = result);
  end loop;
  return result;
end;
$$;

-- ----------------------------------------------------------------------------
-- 6) RPC: Profil anlegen
-- ----------------------------------------------------------------------------
create or replace function public.create_player_profile(
  p_alias text,
  p_avatar text,
  p_class_code text default null
)
returns table (
  id uuid, device_secret uuid, sync_code text,
  alias text, avatar text, class_code text,
  xp int, streak int, completed_lessons jsonb, vocab_progress jsonb, unlocked_badges jsonb
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid := gen_random_uuid();
  v_secret uuid := gen_random_uuid();
  v_sync text := public._generate_sync_code();
  v_alias text := public._validate_alias(p_alias);
  v_avatar text := public._validate_avatar(p_avatar);
  v_class text := public._validate_class_code(p_class_code);
begin
  insert into public.players
    (id, device_secret, sync_code, alias, avatar, class_code, xp, streak, completed_lessons, vocab_progress, unlocked_badges, updated_at)
  values
    (v_id, v_secret, v_sync, v_alias, v_avatar, v_class, 0, 0, '[]'::jsonb, '{}'::jsonb, '[]'::jsonb, now());

  return query
  select v_id, v_secret, v_sync, v_alias, v_avatar, v_class, 0, 0, '[]'::jsonb, '{}'::jsonb, '[]'::jsonb;
end;
$$;

grant execute on function public.create_player_profile(text, text, text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 7) RPC: Fortschritt aktualisieren (Besitznachweis + Plausibilitaetspruefung)
-- ----------------------------------------------------------------------------
create or replace function public.update_player_progress(
  p_id uuid,
  p_device_secret uuid,
  p_xp int,
  p_streak int,
  p_completed_lessons jsonb,
  p_vocab_progress jsonb,
  p_unlocked_badges jsonb
)
returns table (xp int, streak int)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_current record;
begin
  select * into v_current from public.players where id = p_id and device_secret = p_device_secret;
  if not found then
    raise exception 'Nicht autorisiert.';
  end if;

  -- Grobe Plausibilisierung gegen simple API-Manipulation. Verhindert KEINEN
  -- technisch versierten Angriff vollstaendig (siehe Risikohinweise), macht
  -- ihn aber deutlich schwerer als ein einfacher "setze XP auf 999999"-Call.
  if p_xp < v_current.xp then
    raise exception 'XP kann nicht sinken.';
  end if;
  if p_xp - v_current.xp > 200 then
    raise exception 'XP-Zuwachs unplausibel hoch.';
  end if;
  if p_streak < 0 or p_streak > v_current.streak + 1 then
    raise exception 'Serie unplausibel.';
  end if;

  update public.players
  set xp = p_xp,
      streak = p_streak,
      completed_lessons = coalesce(p_completed_lessons, completed_lessons),
      vocab_progress = coalesce(p_vocab_progress, vocab_progress),
      unlocked_badges = coalesce(p_unlocked_badges, unlocked_badges),
      updated_at = now()
  where id = p_id;

  return query select p_xp, p_streak;
end;
$$;

grant execute on function public.update_player_progress(uuid, uuid, int, int, jsonb, jsonb, jsonb) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 8) RPC: Alias/Avatar aendern
-- ----------------------------------------------------------------------------
create or replace function public.update_player_identity(
  p_id uuid,
  p_device_secret uuid,
  p_alias text,
  p_avatar text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_alias text := public._validate_alias(p_alias);
  v_avatar text := public._validate_avatar(p_avatar);
begin
  update public.players
  set alias = v_alias, avatar = v_avatar, updated_at = now()
  where id = p_id and device_secret = p_device_secret;
  if not found then
    raise exception 'Nicht autorisiert.';
  end if;
end;
$$;

grant execute on function public.update_player_identity(uuid, uuid, text, text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 9) RPC: Klasse beitreten / verlassen (Phase 2 - optionaler Klassenbeitritt)
-- ----------------------------------------------------------------------------
create or replace function public.join_class(
  p_id uuid,
  p_device_secret uuid,
  p_class_code text
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_class text := public._validate_class_code(p_class_code);
begin
  if v_class is null then
    raise exception 'Klassencode darf nicht leer sein.';
  end if;
  update public.players set class_code = v_class, updated_at = now()
  where id = p_id and device_secret = p_device_secret;
  if not found then
    raise exception 'Nicht autorisiert.';
  end if;
  return v_class;
end;
$$;

create or replace function public.leave_class(
  p_id uuid,
  p_device_secret uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.players set class_code = null, updated_at = now()
  where id = p_id and device_secret = p_device_secret;
  if not found then
    raise exception 'Nicht autorisiert.';
  end if;
end;
$$;

grant execute on function public.join_class(uuid, uuid, text) to anon, authenticated;
grant execute on function public.leave_class(uuid, uuid) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 10) RPC: Profil per Sync-Code wiederherstellen (rotiert den Code bei Erfolg)
-- ----------------------------------------------------------------------------
create or replace function public.restore_profile_by_sync_code(
  p_sync_code text
)
returns table (
  id uuid, device_secret uuid, sync_code text,
  alias text, avatar text, class_code text,
  xp int, streak int, completed_lessons jsonb, vocab_progress jsonb, unlocked_badges jsonb
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_row public.players%rowtype;
  v_new_code text;
begin
  select * into v_row from public.players where sync_code = upper(btrim(p_sync_code));
  if not found then
    raise exception 'Code ungueltig oder bereits verwendet.';
  end if;

  -- Einmal-Verwendung: der alte Code ist ab sofort ungueltig, ein neuer wird
  -- ausgegeben. Begrenzt das Zeitfenster, in dem ein mitgehoerter/kopierter
  -- Code missbraucht werden koennte.
  v_new_code := public._generate_sync_code();
  update public.players set sync_code = v_new_code, updated_at = now() where id = v_row.id;

  return query
  select v_row.id, v_row.device_secret, v_new_code, v_row.alias, v_row.avatar, v_row.class_code,
         v_row.xp, v_row.streak, v_row.completed_lessons, v_row.vocab_progress, v_row.unlocked_badges;
end;
$$;

grant execute on function public.restore_profile_by_sync_code(text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 11) Interne Hilfsfunktionen vor direktem Aufruf von aussen schuetzen
-- ----------------------------------------------------------------------------
revoke execute on function public._validate_alias(text) from anon, authenticated, public;
revoke execute on function public._validate_avatar(text) from anon, authenticated, public;
revoke execute on function public._validate_class_code(text) from anon, authenticated, public;
revoke execute on function public._generate_sync_code() from anon, authenticated, public;

-- ============================================================================
-- Ende der Migration.
--
-- ZUR KONTROLLE (im SQL Editor ausfuehren):
--   select * from pg_policies where tablename = 'players';        -- sollte leer sein
--   select grantee, privilege_type from information_schema.role_table_grants
--     where table_name = 'players';                                -- sollte anon/authenticated NICHT mehr auflisten
--   select routine_name from information_schema.routines
--     where routine_schema = 'public' and routine_name like '%player%'; -- sollte die neuen RPCs zeigen
-- ============================================================================
