import { createClient } from "@supabase/supabase-js";

/*
  1) Kostenloses Projekt auf supabase.com anlegen
  2) Project Settings -> API -> "Project URL" und "anon public" Key kopieren
  3) Hier unten einfügen (Anführungszeichen drin lassen)
*/
const SUPABASE_URL = "https://atlxglaxivcvdwkagwlq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bHhnbGF4aXZjdmR3a2Fnd2xxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDM3MjQsImV4cCI6MjEwMjM3OTcyNH0.W77fOkyT_htgrFFpothAxVyrpBkGoFMBN1ADmiyoeuw";

const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_URL.includes("DEINE_");

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const cloudEnabled = isConfigured;
