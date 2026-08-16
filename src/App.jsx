import React, { useState, useEffect, useMemo } from "react";
import {
  Heart, X, Lock, Check, Flame, Award, Trophy, Sparkles,
  Landmark, RotateCcw, ArrowRight, Star, PartyPopper, Zap,
  Map, User, Dices, Medal, RefreshCw, Plus, Pencil, BookOpen,
  LayoutGrid, ChevronDown,
} from "lucide-react";
import { supabase, cloudEnabled } from "./supabaseClient";

/* ------------------------------------------------------------------ */
/* DATA: LEKTIONEN */
/* ------------------------------------------------------------------ */

const UNITS = [
  {
    id: "u1",
    latin: "SALVE!",
    german: "Erste Wörter & Begrüßung",
    lessons: [
      {
        id: "u1-l1",
        title: "Begrüßung",
        exercises: [
          { type: "mc", q: "Was bedeutet „salve“?", options: ["Hallo", "Tschüss", "Danke", "Bitte"], correct: 0 },
          { type: "mc", q: "Wie sagt man „Leb wohl“ auf Latein?", options: ["Salve", "Vale", "Amicus", "Puella"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "amicus", accept: ["freund"] },
          { type: "mc", q: "„Amica“ bedeutet …", options: ["Freundin", "Lehrer", "Junge", "Mädchen"], correct: 0 },
        ],
      },
      {
        id: "u1-l2",
        title: "Personen",
        exercises: [
          { type: "mc", q: "„Puer“ bedeutet …", options: ["Junge", "Mädchen", "Lehrer", "Freund"], correct: 0 },
          { type: "mc", q: "„Puella“ bedeutet …", options: ["Freundin", "Lehrerin", "Mädchen", "Frau"], correct: 2 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "magister", accept: ["lehrer"] },
          { type: "mc", q: "Was bedeutet „quis“?", options: ["wer", "was", "wo", "warum"], correct: 0 },
        ],
      },
      {
        id: "u1-l3",
        title: "Erste Sätze",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Junge ist ein Freund.“", words: ["Puer", "amicus", "est"], correct: ["Puer", "amicus", "est"] },
          { type: "mc", q: "„Puella laeta est.“ bedeutet …", options: ["Das Mädchen ist fröhlich.", "Der Junge ist fröhlich.", "Das Mädchen ist traurig.", "Der Lehrer ist fröhlich."], correct: 0 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Lehrerin ist eine Freundin.“", words: ["Magistra", "amica", "est"], correct: ["Magistra", "amica", "est"] },
          { type: "mc", q: "„Puer amicus est.“ bedeutet …", options: ["Der Lehrer ist ein Freund.", "Das Mädchen ist eine Freundin.", "Der Junge ist ein Freund.", "Der Junge ist fröhlich."], correct: 2 },
        ],
      },
    ],
  },
  {
    id: "u2",
    latin: "FAMILIA ROMANA",
    german: "a-Deklination",
    lessons: [
      {
        id: "u2-l1",
        title: "Wortschatz",
        exercises: [
          { type: "mc", q: "„Rosa“ bedeutet …", options: ["Rose", "Wald", "Wasser", "Insel"], correct: 0 },
          { type: "mc", q: "„Silva“ bedeutet …", options: ["Straße", "Wald", "Erde", "Familie"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "aqua", accept: ["wasser"] },
          { type: "mc", q: "„Insula“ bedeutet …", options: ["Insel", "Rose", "Tochter", "Heimat"], correct: 0 },
        ],
      },
      {
        id: "u2-l2",
        title: "Nominativ & Akkusativ",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Akkusativ Singular der a-Deklination?", options: ["-am", "-a", "-ae", "-is"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „Puella ___ videt.“ (Das Mädchen sieht die Rose.)", options: ["rosa", "rosam", "rosae", "rosis"], correct: 1 },
          { type: "mc", q: "Wähle die richtige Form: „Puella ___ videt.“ (Das Mädchen sieht den Wald.)", options: ["silva", "silvae", "silvam", "silvis"], correct: 2 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Mädchen sieht die Rose.“", words: ["Puella", "rosam", "videt"], correct: ["Puella", "rosam", "videt"] },
        ],
      },
      {
        id: "u2-l3",
        title: "Sätze bilden",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Tochter trägt das Wasser.“", words: ["Filia", "aquam", "portat"], correct: ["Filia", "aquam", "portat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Familie sieht den Weg.“", words: ["Familia", "viam", "videt"], correct: ["Familia", "viam", "videt"] },
          { type: "mc", q: "„Puella silvam amat.“ bedeutet …", options: ["Das Mädchen liebt den Wald.", "Der Wald liebt das Mädchen.", "Das Mädchen sieht den Wald.", "Die Familie liebt den Wald."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "via", accept: ["weg", "straße", "strasse"] },
        ],
      },
    ],
  },
  {
    id: "u3",
    latin: "IN FORO",
    german: "o-Deklination & Verben",
    lessons: [
      {
        id: "u3-l1",
        title: "Wortschatz",
        exercises: [
          { type: "mc", q: "„Servus“ bedeutet …", options: ["Herr", "Sklave", "Gott", "Tempel"], correct: 1 },
          { type: "mc", q: "„Dominus“ bedeutet …", options: ["Herr", "Sklave", "Volk", "Markt"], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "templum", accept: ["tempel"] },
          { type: "mc", q: "„Forum“ bedeutet …", options: ["Tempel", "Markt/Forum", "Gott", "Volk"], correct: 1 },
        ],
      },
      {
        id: "u3-l2",
        title: "Verben konjugieren",
        exercises: [
          { type: "mc", q: "„Ich liebe“ heißt …", options: ["amo", "amas", "amat", "amant"], correct: 0 },
          { type: "mc", q: "„Du rufst“ heißt …", options: ["voco", "vocas", "vocat", "vocamus"], correct: 1 },
          { type: "mc", q: "„Er/Sie arbeitet“ heißt …", options: ["laboro", "laboras", "laborat", "laborant"], correct: 2 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Sklave ruft den Herrn.“", words: ["Servus", "dominum", "vocat"], correct: ["Servus", "dominum", "vocat"] },
        ],
      },
      {
        id: "u3-l3",
        title: "Sätze im Forum",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Volk betrachtet den Gott.“", words: ["Populus", "deum", "spectat"], correct: ["Populus", "deum", "spectat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Herr liebt den Tempel.“", words: ["Dominus", "templum", "amat"], correct: ["Dominus", "templum", "amat"] },
          { type: "mc", q: "„Servus in foro laborat.“ bedeutet …", options: ["Der Sklave arbeitet auf dem Forum.", "Der Herr liebt das Forum.", "Das Volk arbeitet im Tempel.", "Der Sklave ruft den Herrn."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "deus", accept: ["gott"] },
        ],
      },
    ],
  },
  {
    id: "u4",
    latin: "FAMILIA ET RES",
    german: "Dativ & Genitiv",
    lessons: [
      {
        id: "u4-l1",
        title: "Genitiv – wem gehört's?",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Genitiv Singular der a-Deklination?", options: ["-ae", "-am", "-a", "-is"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „liber ___“ (das Buch des Mädchens)", options: ["puellae", "puellam", "puella", "puellis"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „liber ___“ (das Buch des Sklaven)", options: ["servo", "servum", "servi", "servus"], correct: 2 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "liber", accept: ["buch"] },
        ],
      },
      {
        id: "u4-l2",
        title: "Dativ – wem gibt man etwas?",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Dativ Singular der a-Deklination?", options: ["-ae", "-am", "-a", "-arum"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „Pater ___ librum dat.“ (Der Vater gibt der Tochter das Buch.)", options: ["filiam", "filia", "filiae", "filias"], correct: 2 },
          { type: "mc", q: "Wähle die richtige Form: „Domina ___ rosam dat.“ (Die Herrin gibt dem Sklaven eine Rose.)", options: ["servo", "servi", "servum", "servus"], correct: 0 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Vater gibt der Tochter das Buch.“", words: ["Pater", "filiae", "librum", "dat"], correct: ["Pater", "filiae", "librum", "dat"] },
        ],
      },
      {
        id: "u4-l3",
        title: "Gemischte Sätze",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Sklavin gibt dem Herrn Wasser.“", words: ["Ancilla", "domino", "aquam", "dat"], correct: ["Ancilla", "domino", "aquam", "dat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Bruder gibt der Schwester eine Rose.“", words: ["Frater", "sorori", "rosam", "dat"], correct: ["Frater", "sorori", "rosam", "dat"] },
          { type: "mc", q: "„Servus narrat fabulam.“ bedeutet …", options: ["Der Sklave erzählt eine Geschichte.", "Der Sklave gibt ein Buch.", "Die Geschichte erzählt den Sklaven.", "Der Sklave liest ein Buch."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "narrare", accept: ["erzählen"] },
        ],
      },
    ],
  },
  {
    id: "u5",
    latin: "DEI ET DEAE",
    german: "Götter & Mythologie",
    lessons: [
      {
        id: "u5-l1",
        title: "Die Götter",
        exercises: [
          { type: "mc", q: "Wer ist der oberste Gott der Römer?", options: ["Iuppiter", "Mars", "Neptunus", "Apollo"], correct: 0 },
          { type: "mc", q: "Wer ist die Göttin der Liebe?", options: ["Minerva", "Venus", "Diana", "Iuno"], correct: 1 },
          { type: "mc", q: "Wer ist der Gott des Meeres?", options: ["Vulcanus", "Mercurius", "Neptunus", "Mars"], correct: 2 },
          { type: "mc", q: "Wer ist der Gott des Krieges?", options: ["Mars", "Apollo", "Iuppiter", "Mercurius"], correct: 0 },
        ],
      },
      {
        id: "u5-l2",
        title: "Mythologische Sätze",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Iuppiter ruft die Götter.“", words: ["Iuppiter", "deos", "vocat"], correct: ["Iuppiter", "deos", "vocat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Venus liebt die Rose.“", words: ["Venus", "rosam", "amat"], correct: ["Venus", "rosam", "amat"] },
          { type: "mc", q: "„Minerva populum servat.“ bedeutet …", options: ["Minerva beschützt das Volk.", "Das Volk beschützt Minerva.", "Minerva liebt das Volk.", "Minerva ruft das Volk."], correct: 0 },
          { type: "mc", q: "Diana ist die Göttin …", options: ["der Jagd", "des Krieges", "des Meeres", "des Handels"], correct: 0 },
        ],
      },
      {
        id: "u5-l3",
        title: "Abschlusstest",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Akkusativ Singular der a-Deklination?", options: ["-am", "-ae", "-a", "-is"], correct: 0 },
          { type: "mc", q: "Welche Endung hat der Dativ Singular der o-Deklination?", options: ["-i", "-o", "-um", "-us"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Apollo betrachtet das Volk.“", words: ["Apollo", "populum", "spectat"], correct: ["Apollo", "populum", "spectat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Juno erzählt der Göttin eine Geschichte.“", words: ["Iuno", "deae", "fabulam", "narrat"], correct: ["Iuno", "deae", "fabulam", "narrat"] },
          { type: "mc", q: "„Mars servum vocat.“ bedeutet …", options: ["Mars ruft den Sklaven.", "Der Sklave ruft Mars.", "Mars liebt den Sklaven.", "Der Sklave beschützt Mars."], correct: 0 },
        ],
      },
    ],
  },
  {
    id: "u6",
    latin: "ADIECTIVA",
    german: "Adjektive & KNG-Kongruenz",
    lessons: [
      {
        id: "u6-l1",
        title: "Wortschatz Adjektive",
        exercises: [
          { type: "mc", q: "„Bonus“ bedeutet …", options: ["gut", "groß", "viel", "klein"], correct: 0 },
          { type: "mc", q: "„Magnus“ bedeutet …", options: ["klein", "groß", "schön", "gut"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "multus", accept: ["viel", "viele"] },
          { type: "mc", q: "„Parvus“ bedeutet …", options: ["klein", "groß", "viel", "gut"], correct: 0 },
        ],
      },
      {
        id: "u6-l2",
        title: "KNG-Kongruenz",
        exercises: [
          { type: "mc", q: "Wähle die richtige Form: „Puella ___ rosam amat.“ (Das gute Mädchen liebt die Rose.)", options: ["bonus", "bona", "bonum", "bonae"], correct: 1 },
          { type: "mc", q: "Wähle die richtige Form: „___ servus laborat.“ (Der gute Sklave arbeitet.)", options: ["Bona", "Bonum", "Bonus", "Bonae"], correct: 2 },
          { type: "mc", q: "Wähle die richtige Form: „Dominus ___ templum videt.“ (Der Herr sieht den großen Tempel.)", options: ["magna", "magnum", "magnus", "magnae"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das gute Mädchen liebt die Rose.“", words: ["Puella", "bona", "rosam", "amat"], correct: ["Puella", "bona", "rosam", "amat"] },
        ],
      },
      {
        id: "u6-l3",
        title: "Sätze mit Adjektiven",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Herr sieht den großen Tempel.“", words: ["Dominus", "magnum", "templum", "videt"], correct: ["Dominus", "magnum", "templum", "videt"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Volk liebt den guten Gott.“", words: ["Populus", "bonum", "deum", "amat"], correct: ["Populus", "bonum", "deum", "amat"] },
          { type: "mc", q: "„Puer parvus est.“ bedeutet …", options: ["Der Junge ist klein.", "Der Junge ist groß.", "Das Mädchen ist klein.", "Der Junge ist gut."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "magna", accept: ["groß", "grosse", "große"] },
        ],
      },
    ],
  },
  {
    id: "u7",
    latin: "TEMPUS PRAETERITUM",
    german: "Perfekt",
    lessons: [
      {
        id: "u7-l1",
        title: "Perfekt erkennen",
        exercises: [
          { type: "mc", q: "„Amavit“ bedeutet …", options: ["er/sie liebt", "er/sie hat geliebt", "er/sie liebte gerade", "sie lieben"], correct: 1 },
          { type: "mc", q: "„Vocavit“ bedeutet …", options: ["er/sie ruft", "er/sie hat gerufen", "sie rufen", "er/sie wird rufen"], correct: 1 },
          { type: "mc", q: "„Laboravit“ bedeutet …", options: ["er/sie arbeitet", "er/sie hat gearbeitet", "sie arbeiten", "er/sie wird arbeiten"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "narravit", accept: ["er hat erzählt", "sie hat erzählt", "hat erzählt"] },
        ],
      },
      {
        id: "u7-l2",
        title: "Perfekt bilden",
        exercises: [
          { type: "mc", q: "Wähle die richtige Form: „Heri dominus servum ___.“ (Gestern rief der Herr den Sklaven.)", options: ["vocat", "vocavit", "vocant", "vocamus"], correct: 1 },
          { type: "mc", q: "Wähle die richtige Form: „Puella rosam ___.“ (Das Mädchen hat die Rose geliebt.)", options: ["amat", "amavit", "amant", "amamus"], correct: 1 },
          { type: "mc", q: "Wähle die richtige Form: „Servus fabulam ___.“ (Der Sklave hat eine Geschichte erzählt.)", options: ["narrat", "narravit", "narrant", "narramus"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Mädchen hat die Rose geliebt.“", words: ["Puella", "rosam", "amavit"], correct: ["Puella", "rosam", "amavit"] },
        ],
      },
      {
        id: "u7-l3",
        title: "Sätze im Perfekt",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Sklave hat den Herrn gerufen.“", words: ["Servus", "dominum", "vocavit"], correct: ["Servus", "dominum", "vocavit"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Iuppiter hat die Götter gerufen.“", words: ["Iuppiter", "deos", "vocavit"], correct: ["Iuppiter", "deos", "vocavit"] },
          { type: "mc", q: "„Familia viam vidit.“ bedeutet …", options: ["Die Familie sieht den Weg.", "Die Familie hat den Weg gesehen.", "Die Familie wird den Weg sehen.", "Der Weg sieht die Familie."], correct: 1 },
          { type: "mc", q: "„Puer in foro laboravit.“ bedeutet …", options: ["Der Junge arbeitet auf dem Forum.", "Der Junge hat auf dem Forum gearbeitet.", "Der Junge wird auf dem Forum arbeiten.", "Der Junge liebt das Forum."], correct: 1 },
        ],
      },
    ],
  },
  {
    id: "u8",
    latin: "NUMERI ET PRONOMINA",
    german: "Zahlen & Pronomen",
    lessons: [
      {
        id: "u8-l1",
        title: "Personalpronomen",
        exercises: [
          { type: "mc", q: "„Ego“ bedeutet …", options: ["ich", "du", "wir", "ihr"], correct: 0 },
          { type: "mc", q: "„Tu“ bedeutet …", options: ["ich", "du", "wir", "ihr"], correct: 1 },
          { type: "mc", q: "„Nos“ bedeutet …", options: ["ich", "du", "wir", "ihr"], correct: 2 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "vos", accept: ["ihr"] },
        ],
      },
      {
        id: "u8-l2",
        title: "Zahlen 1–5",
        exercises: [
          { type: "mc", q: "„Unus“ bedeutet …", options: ["eins", "zwei", "drei", "vier"], correct: 0 },
          { type: "mc", q: "„Tres“ bedeutet …", options: ["zwei", "drei", "vier", "fünf"], correct: 1 },
          { type: "mc", q: "„Quattuor“ bedeutet …", options: ["drei", "vier", "fünf", "eins"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "quinque", accept: ["fünf", "funf"] },
        ],
      },
      {
        id: "u8-l3",
        title: "Abschluss",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Ich liebe die Rose.“", words: ["Ego", "rosam", "amo"], correct: ["Ego", "rosam", "amo"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Wir sehen den Tempel.“", words: ["Nos", "templum", "videmus"], correct: ["Nos", "templum", "videmus"] },
          { type: "mc", q: "„Tu amicus es.“ bedeutet …", options: ["Ich bin ein Freund.", "Du bist ein Freund.", "Wir sind Freunde.", "Ihr seid Freunde."], correct: 1 },
          { type: "mc", q: "„Duo servi laborant.“ bedeutet …", options: ["Ein Sklave arbeitet.", "Zwei Sklaven arbeiten.", "Drei Sklaven arbeiten.", "Der Sklave hat gearbeitet."], correct: 1 },
        ],
      },
    ],
  },
  {
    id: "u9",
    latin: "AD PRAEPOSITIONES",
    german: "Ablativ & Präpositionen",
    lessons: [
      {
        id: "u9-l1",
        title: "Präpositionen",
        exercises: [
          { type: "mc", q: "„In“ bedeutet …", options: ["in/auf", "mit", "ohne", "aus"], correct: 0 },
          { type: "mc", q: "„Cum“ bedeutet …", options: ["in/auf", "mit", "ohne", "aus"], correct: 1 },
          { type: "mc", q: "„Sine“ bedeutet …", options: ["in/auf", "mit", "ohne", "aus"], correct: 2 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "ex", accept: ["aus"] },
        ],
      },
      {
        id: "u9-l2",
        title: "Ablativ der o-Deklination",
        exercises: [
          { type: "mc", q: "Welche Endung hat der Ablativ Singular der o-Deklination?", options: ["-o", "-um", "-us", "-i"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „Servus cum ___ laborat.“ (Der Sklave arbeitet mit dem Herrn.)", options: ["domino", "dominum", "domini", "dominus"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „Puer in ___ est.“ (Der Junge ist im Tempel.)", options: ["templum", "templo", "templi", "templus"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Junge ist im Tempel.“", words: ["Puer", "in", "templo", "est"], correct: ["Puer", "in", "templo", "est"] },
        ],
      },
      {
        id: "u9-l3",
        title: "Sätze mit Präpositionen",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Herr schaut aus dem Tempel.“", words: ["Dominus", "ex", "templo", "spectat"], correct: ["Dominus", "ex", "templo", "spectat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Mädchen ist ohne Freundin.“", words: ["Puella", "sine", "amica", "est"], correct: ["Puella", "sine", "amica", "est"] },
          { type: "mc", q: "„Servus sine domino laborat.“ bedeutet …", options: ["Der Sklave arbeitet ohne den Herrn.", "Der Herr arbeitet ohne den Sklaven.", "Der Sklave arbeitet mit dem Herrn.", "Der Sklave ruft den Herrn."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "cum", accept: ["mit"] },
        ],
      },
    ],
  },
  {
    id: "u10",
    latin: "REX ET TEMPUS",
    german: "3. Deklination",
    lessons: [
      {
        id: "u10-l1",
        title: "Wortschatz 3. Deklination",
        exercises: [
          { type: "mc", q: "„Rex“ bedeutet …", options: ["König", "Mensch", "Stadt", "Zeit"], correct: 0 },
          { type: "mc", q: "„Homo“ bedeutet …", options: ["König", "Mensch", "Stadt", "Zeit"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "urbs", accept: ["stadt"] },
          { type: "mc", q: "„Tempus“ bedeutet …", options: ["König", "Mensch", "Stadt", "Zeit"], correct: 3 },
        ],
      },
      {
        id: "u10-l2",
        title: "Akkusativ auf -em",
        exercises: [
          { type: "mc", q: "Welche Akkusativ-Endung haben viele Wörter der 3. Deklination (z. B. rex, homo)?", options: ["-em", "-um", "-am", "-is"], correct: 0 },
          { type: "mc", q: "Wähle die richtige Form: „Populus ___ amat.“ (Das Volk liebt den König.)", options: ["rex", "regem", "regis", "rege"], correct: 1 },
          { type: "mc", q: "Wähle die richtige Form: „Servus ___ videt.“ (Der Sklave sieht den Menschen.)", options: ["homo", "hominem", "hominis", "homine"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Sklave sieht den Menschen.“", words: ["Servus", "hominem", "videt"], correct: ["Servus", "hominem", "videt"] },
        ],
      },
      {
        id: "u10-l3",
        title: "Lesetext: Rex Romanus",
        exercises: [
          {
            type: "reading",
            title: "Rex Romanus",
            latin: "Rex magnus est. Rex urbem amat. In urbe templum magnum est. Servus regem vocat: „Salve, rex!“ Rex servum spectat. Populus regem amat.",
          },
          { type: "mc", q: "Wie ist der König?", options: ["groß", "klein", "traurig", "böse"], correct: 0 },
          { type: "mc", q: "Wo steht der Tempel?", options: ["In der Stadt", "Im Wald", "Am Meer", "Auf der Insel"], correct: 0 },
          { type: "mc", q: "Wer ruft den König?", options: ["Der Sklave", "Das Volk", "Der Lehrer", "Die Göttin"], correct: 0 },
          { type: "mc", q: "Wer liebt den König am Ende des Textes?", options: ["Das Volk", "Der Sklave", "Die Familie", "Der Gott"], correct: 0 },
        ],
      },
    ],
  },
  {
    id: "u11",
    latin: "ESSE ET IRE",
    german: "Unregelmäßige Verben",
    lessons: [
      {
        id: "u11-l1",
        title: "Sein – esse",
        exercises: [
          { type: "mc", q: "„Sunt“ bedeutet …", options: ["sie sind", "er ist", "wir sind", "du bist"], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "sumus", accept: ["wir sind"] },
          { type: "mc", q: "„Es“ bedeutet …", options: ["ich bin", "du bist", "sie sind", "wir sind"], correct: 1 },
          { type: "mc", q: "„Ad“ bedeutet …", options: ["zu/nach", "mit", "ohne", "aus"], correct: 0 },
        ],
      },
      {
        id: "u11-l2",
        title: "Gehen – ire",
        exercises: [
          { type: "mc", q: "„It“ bedeutet …", options: ["er/sie geht", "er/sie ist", "sie gehen", "er/sie kam"], correct: 0 },
          { type: "mc", q: "„Eunt“ bedeutet …", options: ["er/sie geht", "sie gehen", "wir gehen", "sie sind"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Junge geht zum Markt.“", words: ["Puer", "ad", "forum", "it"], correct: ["Puer", "ad", "forum", "it"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Sklaven gehen zum Tempel.“", words: ["Servi", "ad", "templum", "eunt"], correct: ["Servi", "ad", "templum", "eunt"] },
        ],
      },
      {
        id: "u11-l3",
        title: "Götter im Himmel",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "caelum", accept: ["himmel"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die Götter sind im Himmel.“", words: ["Dei", "in", "caelo", "sunt"], correct: ["Dei", "in", "caelo", "sunt"] },
          { type: "mc", q: "„Servus ad dominum it.“ bedeutet …", options: ["Der Sklave geht zum Herrn.", "Der Herr geht zum Sklaven.", "Der Sklave ruft den Herrn.", "Der Sklave ist beim Herrn."], correct: 0 },
          { type: "mc", q: "„Servi ad templum eunt.“ bedeutet …", options: ["Die Sklaven gehen zum Tempel.", "Der Sklave geht zum Tempel.", "Die Sklaven sind im Tempel.", "Die Sklaven lieben den Tempel."], correct: 0 },
        ],
      },
    ],
  },
  {
    id: "u12",
    latin: "IMPERFECTUM ET FUTURUM",
    german: "Imperfekt & Futur I",
    lessons: [
      {
        id: "u12-l1",
        title: "Zeitangaben & Imperfekt",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "heri", accept: ["gestern"] },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "hodie", accept: ["heute"] },
          { type: "mc", q: "„Amabat“ bedeutet …", options: ["er/sie liebt", "er/sie hat geliebt", "er/sie liebte", "er/sie wird lieben"], correct: 2 },
          { type: "mc", q: "„Vocabat“ bedeutet …", options: ["er/sie ruft", "er/sie rief (immer wieder)", "er/sie hat gerufen", "er/sie wird rufen"], correct: 1 },
        ],
      },
      {
        id: "u12-l2",
        title: "Futur I",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "cras", accept: ["morgen"] },
          { type: "mc", q: "„Amabit“ bedeutet …", options: ["er/sie liebt", "er/sie liebte", "er/sie wird lieben", "er/sie hat geliebt"], correct: 2 },
          { type: "mc", q: "„Vocabit“ bedeutet …", options: ["er/sie ruft", "er/sie rief", "er/sie hat gerufen", "er/sie wird rufen"], correct: 3 },
          { type: "mc", q: "Wähle die richtige Form: „Cras dominus servum ___.“ (Morgen wird der Herr den Sklaven rufen.)", options: ["vocat", "vocavit", "vocabit", "vocabat"], correct: 2 },
        ],
      },
      {
        id: "u12-l3",
        title: "Lesetext: Ein Tag im Leben",
        exercises: [
          {
            type: "reading",
            title: "Ein Tag im Leben",
            latin: "Heri servus laborabat. Heri dominus servum vocavit. Hodie servus in foro est. Cras servus templum spectabit.",
          },
          { type: "mc", q: "Was tat der Sklave gestern die ganze Zeit?", options: ["Er arbeitete.", "Er schlief.", "Er las.", "Er ging."], correct: 0 },
          { type: "mc", q: "Was geschah gestern einmalig?", options: ["Der Herr rief den Sklaven.", "Der Sklave rief den Herrn.", "Der König kam.", "Der Sklave ging fort."], correct: 0 },
          { type: "mc", q: "Wo ist der Sklave heute?", options: ["Auf dem Forum.", "Im Tempel.", "Im Wald.", "Auf der Insel."], correct: 0 },
          { type: "mc", q: "Was wird der Sklave morgen tun?", options: ["Er wird den Tempel betrachten.", "Er wird den Herrn rufen.", "Er wird zum Forum gehen.", "Er wird arbeiten."], correct: 0 },
        ],
      },
    ],
  },
];

const FLAT_LESSONS = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unitId: u.id })));

const RANKS = [
  { min: 0, title: "Tiro", sub: "Rekrut" },
  { min: 50, title: "Discipulus", sub: "Schüler" },
  { min: 150, title: "Quaestor", sub: "Schatzmeister" },
  { min: 300, title: "Aedilis", sub: "Ädil" },
  { min: 500, title: "Praetor", sub: "Prätor" },
  { min: 800, title: "Consul", sub: "Konsul" },
  { min: 1200, title: "Caesar", sub: "Imperator" },
];

function getRank(xp) {
  let current = RANKS[0];
  let next = RANKS[1];
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].min) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    }
  }
  return { current, next };
}

const BADGES = [
  { id: "first", title: "Prima Lectio", desc: "Erste Lektion abgeschlossen", icon: Sparkles },
  { id: "perfect", title: "Sine Errore", desc: "Eine Lektion ohne Fehler gemeistert", icon: Star },
  { id: "unit", title: "Cursus Confectus", desc: "Eine ganze Einheit gemeistert", icon: Trophy },
  { id: "xp150", title: "Centurio", desc: "150 XP gesammelt", icon: Award },
  { id: "streak5", title: "Quinque Dies", desc: "Serie von 5 Tagen", icon: Flame },
];

const UNIT_GRADIENTS = [
  "linear-gradient(135deg, #7C3AED, #EC4899)",
  "linear-gradient(135deg, #F59E0B, #EF4444)",
  "linear-gradient(135deg, #059669, #14B8A6)",
  "linear-gradient(135deg, #2563EB, #7C3AED)",
  "linear-gradient(135deg, #EF4444, #F59E0B)",
];

const CONFETTI_COLORS = ["#E8483A", "#FFB627", "#2EC4B6", "#7C3AED", "#EC4899", "#3B82F6"];
const GOLD_COLORS = ["#FFB627", "#FFD166", "#F59E0B", "#FFE08C"];

const AVATARS = ["🦅", "🛡️", "⚔️", "🔥", "🌿", "🦁", "🐺", "🏛️", "⚡", "🐍", "🌊", "☀️"];
const ALIAS_NOUNS = ["Aquila", "Lupus", "Leo", "Draco", "Falco", "Ursus", "Corvus", "Vulpes", "Taurus", "Phoenix", "Cato", "Nova"];

/* ------------------------------------------------------------------ */
/* VOKABELTRAINER: Wortschatz-Pool (spiegelt die Lektionsinhalte) */
/* ------------------------------------------------------------------ */

const VOCAB_POOL = [
  { id: "v1", latin: "salve", german: "Hallo", lessonId: "u1-l1" },
  { id: "v2", latin: "vale", german: "Leb wohl", lessonId: "u1-l1" },
  { id: "v3", latin: "amicus", german: "Freund", lessonId: "u1-l1" },
  { id: "v4", latin: "amica", german: "Freundin", lessonId: "u1-l1" },
  { id: "v5", latin: "puer", german: "Junge", lessonId: "u1-l2" },
  { id: "v6", latin: "puella", german: "Mädchen", lessonId: "u1-l2" },
  { id: "v7", latin: "magister", german: "Lehrer", lessonId: "u1-l2" },
  { id: "v8", latin: "magistra", german: "Lehrerin", lessonId: "u1-l2" },
  { id: "v9", latin: "quis", german: "wer", lessonId: "u1-l2" },
  { id: "v10", latin: "rosa", german: "Rose", lessonId: "u2-l1" },
  { id: "v11", latin: "silva", german: "Wald", lessonId: "u2-l1" },
  { id: "v12", latin: "aqua", german: "Wasser", lessonId: "u2-l1" },
  { id: "v13", latin: "insula", german: "Insel", lessonId: "u2-l1" },
  { id: "v14", latin: "via", german: "Weg", lessonId: "u2-l3" },
  { id: "v15", latin: "filia", german: "Tochter", lessonId: "u2-l3" },
  { id: "v16", latin: "familia", german: "Familie", lessonId: "u2-l3" },
  { id: "v17", latin: "servus", german: "Sklave", lessonId: "u3-l1" },
  { id: "v18", latin: "dominus", german: "Herr", lessonId: "u3-l1" },
  { id: "v19", latin: "templum", german: "Tempel", lessonId: "u3-l1" },
  { id: "v20", latin: "forum", german: "Markt", lessonId: "u3-l1" },
  { id: "v21", latin: "amare", german: "lieben", lessonId: "u3-l2" },
  { id: "v22", latin: "vocare", german: "rufen", lessonId: "u3-l2" },
  { id: "v23", latin: "laborare", german: "arbeiten", lessonId: "u3-l2" },
  { id: "v24", latin: "populus", german: "Volk", lessonId: "u3-l3" },
  { id: "v25", latin: "deus", german: "Gott", lessonId: "u3-l3" },
  { id: "v26", latin: "spectare", german: "betrachten", lessonId: "u3-l3" },
  { id: "v27", latin: "liber", german: "Buch", lessonId: "u4-l1" },
  { id: "v28", latin: "pater", german: "Vater", lessonId: "u4-l2" },
  { id: "v29", latin: "dare", german: "geben", lessonId: "u4-l2" },
  { id: "v30", latin: "narrare", german: "erzählen", lessonId: "u4-l3" },
  { id: "v31", latin: "frater", german: "Bruder", lessonId: "u4-l3" },
  { id: "v32", latin: "soror", german: "Schwester", lessonId: "u4-l3" },
  { id: "v33", latin: "ancilla", german: "Sklavin", lessonId: "u4-l3" },
  { id: "v34", latin: "fabula", german: "Geschichte", lessonId: "u4-l3" },
  { id: "v35", latin: "Iuppiter", german: "oberster Gott", lessonId: "u5-l1" },
  { id: "v36", latin: "Venus", german: "Göttin der Liebe", lessonId: "u5-l1" },
  { id: "v37", latin: "Neptunus", german: "Gott des Meeres", lessonId: "u5-l1" },
  { id: "v38", latin: "Mars", german: "Gott des Krieges", lessonId: "u5-l1" },
  { id: "v39", latin: "Diana", german: "Göttin der Jagd", lessonId: "u5-l2" },
  { id: "v40", latin: "servare", german: "beschützen", lessonId: "u5-l2" },
  { id: "v41", latin: "bonus", german: "gut", lessonId: "u6-l1" },
  { id: "v42", latin: "magnus", german: "groß", lessonId: "u6-l1" },
  { id: "v43", latin: "multus", german: "viel", lessonId: "u6-l1" },
  { id: "v44", latin: "parvus", german: "klein", lessonId: "u6-l1" },
  { id: "v45", latin: "amavit", german: "hat geliebt", lessonId: "u7-l1" },
  { id: "v46", latin: "vocavit", german: "hat gerufen", lessonId: "u7-l1" },
  { id: "v47", latin: "laboravit", german: "hat gearbeitet", lessonId: "u7-l1" },
  { id: "v48", latin: "narravit", german: "hat erzählt", lessonId: "u7-l1" },
  { id: "v49", latin: "ego", german: "ich", lessonId: "u8-l1" },
  { id: "v50", latin: "tu", german: "du", lessonId: "u8-l1" },
  { id: "v51", latin: "nos", german: "wir", lessonId: "u8-l1" },
  { id: "v52", latin: "vos", german: "ihr", lessonId: "u8-l1" },
  { id: "v53", latin: "unus", german: "eins", lessonId: "u8-l2" },
  { id: "v54", latin: "duo", german: "zwei", lessonId: "u8-l2" },
  { id: "v55", latin: "tres", german: "drei", lessonId: "u8-l2" },
  { id: "v56", latin: "quattuor", german: "vier", lessonId: "u8-l2" },
  { id: "v57", latin: "quinque", german: "fünf", lessonId: "u8-l2" },
  { id: "v58", latin: "in", german: "in/auf", lessonId: "u9-l1" },
  { id: "v59", latin: "cum", german: "mit", lessonId: "u9-l1" },
  { id: "v60", latin: "sine", german: "ohne", lessonId: "u9-l1" },
  { id: "v61", latin: "ex", german: "aus", lessonId: "u9-l1" },
  { id: "v62", latin: "rex", german: "König", lessonId: "u10-l1" },
  { id: "v63", latin: "homo", german: "Mensch", lessonId: "u10-l1" },
  { id: "v64", latin: "urbs", german: "Stadt", lessonId: "u10-l1" },
  { id: "v65", latin: "tempus", german: "Zeit", lessonId: "u10-l1" },
  { id: "v66", latin: "ad", german: "zu/nach", lessonId: "u11-l1" },
  { id: "v67", latin: "sunt", german: "sie sind", lessonId: "u11-l1" },
  { id: "v68", latin: "sumus", german: "wir sind", lessonId: "u11-l1" },
  { id: "v69", latin: "it", german: "er/sie geht", lessonId: "u11-l2" },
  { id: "v70", latin: "eunt", german: "sie gehen", lessonId: "u11-l2" },
  { id: "v71", latin: "caelum", german: "Himmel", lessonId: "u11-l3" },
  { id: "v72", latin: "heri", german: "gestern", lessonId: "u12-l1" },
  { id: "v73", latin: "hodie", german: "heute", lessonId: "u12-l1" },
  { id: "v74", latin: "amabat", german: "er/sie liebte", lessonId: "u12-l1" },
  { id: "v75", latin: "cras", german: "morgen", lessonId: "u12-l2" },
  { id: "v76", latin: "amabit", german: "er/sie wird lieben", lessonId: "u12-l2" },
];

const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];

/* ------------------------------------------------------------------ */
/* GRAMMATIK-TRAINER: Deklinations- & Konjugationstabellen */
/* ------------------------------------------------------------------ */

const CASES = ["Nominativ", "Genitiv", "Dativ", "Akkusativ", "Ablativ"];
const CASE_UNLOCK_LESSON = {
  Nominativ: "u1-l3",
  Akkusativ: "u2-l2",
  Genitiv: "u4-l1",
  Dativ: "u4-l2",
  Ablativ: "u9-l2",
};

const NOUN_PARADIGMS = [
  {
    id: "puella",
    latin: "puella",
    german: "Mädchen",
    declension: "a-Deklination (fem.)",
    unlockLessonId: "u2-l1",
    forms: { Nominativ: "puella", Genitiv: "puellae", Dativ: "puellae", Akkusativ: "puellam", Ablativ: "puella" },
  },
  {
    id: "servus",
    latin: "servus",
    german: "Sklave",
    declension: "o-Deklination (mask.)",
    unlockLessonId: "u3-l1",
    forms: { Nominativ: "servus", Genitiv: "servi", Dativ: "servo", Akkusativ: "servum", Ablativ: "servo" },
  },
  {
    id: "templum",
    latin: "templum",
    german: "Tempel",
    declension: "o-Deklination (neutr.)",
    unlockLessonId: "u3-l1",
    forms: { Nominativ: "templum", Genitiv: "templi", Dativ: "templo", Akkusativ: "templum", Ablativ: "templo" },
  },
  {
    id: "rex",
    latin: "rex",
    german: "König",
    declension: "3. Deklination (mask.)",
    unlockLessonId: "u10-l1",
    forms: { Nominativ: "rex", Genitiv: "regis", Dativ: "regi", Akkusativ: "regem", Ablativ: "rege" },
  },
];

const PERSONS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie"];
const TENSE_UNLOCK_LESSON = {
  Präsens: "u3-l2",
  Perfekt: "u7-l1",
  Imperfekt: "u12-l1",
  Futur: "u12-l2",
};

const VERB_PARADIGMS = [
  {
    id: "amare",
    latin: "amare",
    german: "lieben",
    conjugation: "a-Konjugation",
    unlockLessonId: "u3-l2",
    tenses: {
      Präsens: { ich: "amo", du: "amas", "er/sie/es": "amat", wir: "amamus", ihr: "amatis", sie: "amant" },
      Perfekt: { ich: "amavi", du: "amavisti", "er/sie/es": "amavit", wir: "amavimus", ihr: "amavistis", sie: "amaverunt" },
      Imperfekt: { ich: "amabam", du: "amabas", "er/sie/es": "amabat", wir: "amabamus", ihr: "amabatis", sie: "amabant" },
      Futur: { ich: "amabo", du: "amabis", "er/sie/es": "amabit", wir: "amabimus", ihr: "amabitis", sie: "amabunt" },
    },
  },
  {
    id: "vocare",
    latin: "vocare",
    german: "rufen",
    conjugation: "a-Konjugation",
    unlockLessonId: "u3-l2",
    tenses: {
      Präsens: { ich: "voco", du: "vocas", "er/sie/es": "vocat", wir: "vocamus", ihr: "vocatis", sie: "vocant" },
      Perfekt: { ich: "vocavi", du: "vocavisti", "er/sie/es": "vocavit", wir: "vocavimus", ihr: "vocavistis", sie: "vocaverunt" },
      Imperfekt: { ich: "vocabam", du: "vocabas", "er/sie/es": "vocabat", wir: "vocabamus", ihr: "vocabatis", sie: "vocabant" },
      Futur: { ich: "vocabo", du: "vocabis", "er/sie/es": "vocabit", wir: "vocabimus", ihr: "vocabitis", sie: "vocabunt" },
    },
  },
  {
    id: "laborare",
    latin: "laborare",
    german: "arbeiten",
    conjugation: "a-Konjugation",
    unlockLessonId: "u3-l2",
    tenses: {
      Präsens: { ich: "laboro", du: "laboras", "er/sie/es": "laborat", wir: "laboramus", ihr: "laboratis", sie: "laborant" },
      Perfekt: { ich: "laboravi", du: "laboravisti", "er/sie/es": "laboravit", wir: "laboravimus", ihr: "laboravistis", sie: "laboraverunt" },
      Imperfekt: { ich: "laborabam", du: "laborabas", "er/sie/es": "laborabat", wir: "laborabamus", ihr: "laborabatis", sie: "laborabant" },
      Futur: { ich: "laborabo", du: "laborabis", "er/sie/es": "laborabit", wir: "laborabimus", ihr: "laborabitis", sie: "laborabunt" },
    },
  },
  {
    id: "esse",
    latin: "esse",
    german: "sein",
    conjugation: "unregelmäßig",
    unlockLessonId: "u11-l1",
    tenses: {
      Präsens: { ich: "sum", du: "es", "er/sie/es": "est", wir: "sumus", ihr: "estis", sie: "sunt" },
    },
  },
  {
    id: "ire",
    latin: "ire",
    german: "gehen",
    conjugation: "unregelmäßig",
    unlockLessonId: "u11-l2",
    tenses: {
      Präsens: { ich: "eo", du: "is", "er/sie/es": "it", wir: "imus", ihr: "itis", sie: "eunt" },
    },
  },
];

/* ------------------------------------------------------------------ */
/* SATZ DES TAGES */
/* ------------------------------------------------------------------ */

const DAILY_SENTENCES = [
  { latin: "Puer amicus est.", german: "Der Junge ist ein Freund." },
  { latin: "Puella laeta est.", german: "Das Mädchen ist fröhlich." },
  { latin: "Puella rosam amat.", german: "Das Mädchen liebt die Rose." },
  { latin: "Filia aquam portat.", german: "Die Tochter trägt das Wasser." },
  { latin: "Familia viam videt.", german: "Die Familie sieht den Weg." },
  { latin: "Servus dominum vocat.", german: "Der Sklave ruft den Herrn." },
  { latin: "Populus deum spectat.", german: "Das Volk betrachtet den Gott." },
  { latin: "Dominus templum amat.", german: "Der Herr liebt den Tempel." },
  { latin: "Pater filiae librum dat.", german: "Der Vater gibt der Tochter das Buch." },
  { latin: "Ancilla domino aquam dat.", german: "Die Sklavin gibt dem Herrn Wasser." },
  { latin: "Frater sorori rosam dat.", german: "Der Bruder gibt der Schwester eine Rose." },
  { latin: "Iuppiter deos vocat.", german: "Iuppiter ruft die Götter." },
  { latin: "Venus rosam amat.", german: "Venus liebt die Rose." },
  { latin: "Puella bona rosam amat.", german: "Das gute Mädchen liebt die Rose." },
  { latin: "Dominus magnum templum videt.", german: "Der Herr sieht den großen Tempel." },
  { latin: "Populus bonum deum amat.", german: "Das Volk liebt den guten Gott." },
  { latin: "Puella rosam amavit.", german: "Das Mädchen hat die Rose geliebt." },
  { latin: "Servus dominum vocavit.", german: "Der Sklave hat den Herrn gerufen." },
  { latin: "Ego rosam amo.", german: "Ich liebe die Rose." },
  { latin: "Nos templum videmus.", german: "Wir sehen den Tempel." },
  { latin: "Dominus ex templo spectat.", german: "Der Herr schaut aus dem Tempel." },
  { latin: "Puella sine amica est.", german: "Das Mädchen ist ohne Freundin." },
  { latin: "Servus sine domino laborat.", german: "Der Sklave arbeitet ohne den Herrn." },
  { latin: "Puer in templo est.", german: "Der Junge ist im Tempel." },
  { latin: "Servus hominem videt.", german: "Der Sklave sieht den Menschen." },
  { latin: "Puer ad forum it.", german: "Der Junge geht zum Markt." },
  { latin: "Servi ad templum eunt.", german: "Die Sklaven gehen zum Tempel." },
  { latin: "Dei in caelo sunt.", german: "Die Götter sind im Himmel." },
  { latin: "Servus ad dominum it.", german: "Der Sklave geht zum Herrn." },
  { latin: "Heri servus laborabat.", german: "Gestern arbeitete der Sklave." },
  { latin: "Cras servus templum spectabit.", german: "Morgen wird der Sklave den Tempel betrachten." },
  { latin: "Rex magnus est.", german: "Der König ist groß." },
  { latin: "Rex urbem amat.", german: "Der König liebt die Stadt." },
  { latin: "Populus regem amat.", german: "Das Volk liebt den König." },
];

function getDailySentence() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return DAILY_SENTENCES[dayOfYear % DAILY_SENTENCES.length];
}

/* ------------------------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------------------------ */

function normalize(s) {
  return s.trim().toLowerCase().replace(/[.,!?;:]/g, "");
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    function step(ts) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function generateAlias() {
  const noun = ALIAS_NOUNS[Math.floor(Math.random() * ALIAS_NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${noun}${num}`;
}

function generateSyncCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const LS_PROFILES = "ll_profiles_v1";
const LS_ACTIVE = "ll_active_id_v1";

function loadProfiles() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_PROFILES));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}
function saveProfilesLS(list) {
  try {
    localStorage.setItem(LS_PROFILES, JSON.stringify(list));
  } catch {}
}
function loadActiveIdLS() {
  try {
    return localStorage.getItem(LS_ACTIVE);
  } catch {
    return null;
  }
}
function saveActiveIdLS(id) {
  try {
    localStorage.setItem(LS_ACTIVE, id);
  } catch {}
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getAvailableVocab(completed) {
  return VOCAB_POOL.filter((w) => completed.has(w.lessonId));
}

function getDueVocab(available, vocabProgress) {
  const today = todayStr();
  return available.filter((w) => {
    const st = vocabProgress[w.id];
    return !st || st.nextReview <= today;
  });
}

function updateWordBox(state, isCorrect) {
  const prev = state || { box: -1, seen: 0, correct: 0 };
  if (isCorrect) {
    const newBox = Math.min(prev.box + 1, 5);
    return {
      box: newBox,
      nextReview: addDays(todayStr(), BOX_INTERVAL_DAYS[newBox]),
      seen: prev.seen + 1,
      correct: prev.correct + 1,
    };
  }
  return { box: 0, nextReview: todayStr(), seen: prev.seen + 1, correct: prev.correct };
}

function buildVocabQuestion(word, pool) {
  const direction = Math.random() < 0.5 ? "latin-de" : "de-latin";
  const correctText = direction === "latin-de" ? word.german : word.latin;
  const promptText = direction === "latin-de" ? word.latin : word.german;
  const others = pool.filter((w) => w.id !== word.id);
  const distractors = shuffle(others)
    .slice(0, 3)
    .map((w) => (direction === "latin-de" ? w.german : w.latin));
  const options = shuffle([correctText, ...distractors]);
  const correctIndex = options.indexOf(correctText);
  return { wordId: word.id, direction, prompt: promptText, options, correctIndex, latin: word.latin, german: word.german };
}

/* ---- Grammatik-Trainer: Deklination & Konjugation ---- */

function getAvailableNouns(completed) {
  return NOUN_PARADIGMS.filter((n) => completed.has(n.unlockLessonId));
}
function getAvailableCases(completed) {
  return CASES.filter((c) => completed.has(CASE_UNLOCK_LESSON[c]));
}
function getAvailableVerbs(completed) {
  return VERB_PARADIGMS.filter((v) => completed.has(v.unlockLessonId));
}
function getAvailableTenses(verb, completed) {
  return Object.keys(verb.tenses).filter((t) => completed.has(TENSE_UNLOCK_LESSON[t]));
}

function buildDeclensionQuestion(noun, availableCases) {
  const casesForNoun = availableCases.filter((c) => noun.forms[c] !== undefined);
  const targetCase = casesForNoun[Math.floor(Math.random() * casesForNoun.length)];
  const correctForm = noun.forms[targetCase];
  const allForms = NOUN_PARADIGMS.flatMap((n) => Object.values(n.forms));
  const distractorPool = [...new Set(allForms)].filter((f) => f !== correctForm);
  const distractors = shuffle(distractorPool).slice(0, 3);
  const options = shuffle([correctForm, ...distractors]);
  return {
    kind: "declension",
    nounId: noun.id,
    latin: noun.latin,
    german: noun.german,
    targetCase,
    correctIndex: options.indexOf(correctForm),
    options,
  };
}

function buildConjugationQuestion(verb, availableTenses) {
  const tensesForVerb = availableTenses.filter((t) => verb.tenses[t]);
  const targetTense = tensesForVerb[Math.floor(Math.random() * tensesForVerb.length)];
  const personKeys = Object.keys(verb.tenses[targetTense]);
  const targetPerson = personKeys[Math.floor(Math.random() * personKeys.length)];
  const correctForm = verb.tenses[targetTense][targetPerson];
  const allForms = VERB_PARADIGMS.flatMap((v) => Object.values(v.tenses).flatMap((t) => Object.values(t)));
  const distractorPool = [...new Set(allForms)].filter((f) => f !== correctForm);
  const distractors = shuffle(distractorPool).slice(0, 3);
  const options = shuffle([correctForm, ...distractors]);
  return {
    kind: "conjugation",
    verbId: verb.id,
    latin: verb.latin,
    german: verb.german,
    targetTense,
    targetPerson,
    correctIndex: options.indexOf(correctForm),
    options,
  };
}

function computeNewStreak(profile) {
  const today = todayStr();
  if (profile.lastActiveDate === today) return profile.streak;
  if (profile.lastActiveDate === yesterdayStr()) return profile.streak + 1;
  return 1;
}

async function syncToCloud(profile) {
  if (!supabase) return;
  try {
    await supabase.from("players").upsert({
      id: profile.id,
      device_secret: profile.deviceSecret,
      class_code: profile.classCode,
      alias: profile.alias,
      avatar: profile.avatar,
      xp: profile.xp,
      streak: profile.streak,
      completed_count: profile.completedLessons.length,
      completed_lessons: profile.completedLessons,
      vocab_progress: profile.vocabProgress,
      unlocked_badges: profile.unlockedBadges,
      sync_code: profile.syncCode,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Cloud-Sync fehlgeschlagen", e);
  }
}

async function fetchLeaderboard(classCode) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("class_code", classCode)
      .order("xp", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn("Rangliste laden fehlgeschlagen", e);
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* SMALL VISUAL COMPONENTS */
/* ------------------------------------------------------------------ */

function Laurel({ size = 56, color = "#A8730B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0 pointer-events-none">
      <g stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round">
        <path d="M20 85 C10 65, 12 35, 30 15" />
        <path d="M20 78 C24 78, 28 74, 26 68" />
        <path d="M18 66 C22 66, 26 62, 24 56" />
        <path d="M18 54 C22 54, 26 50, 24 44" />
        <path d="M20 42 C24 42, 28 38, 26 32" />
        <path d="M24 30 C28 30, 31 27, 29 22" />
        <path d="M80 85 C90 65, 88 35, 70 15" />
        <path d="M80 78 C76 78, 72 74, 74 68" />
        <path d="M82 66 C78 66, 74 62, 76 56" />
        <path d="M82 54 C78 54, 74 50, 76 44" />
        <path d="M80 42 C76 42, 72 38, 74 32" />
        <path d="M76 30 C72 30, 69 27, 71 22" />
      </g>
    </svg>
  );
}

function StoneRoad() {
  return (
    <div
      className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-2 rounded-full"
      style={{
        background: "repeating-linear-gradient(180deg, #FFB627 0px, #FFB627 10px, transparent 10px, transparent 20px)",
        opacity: 0.5,
      }}
    />
  );
}

function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute -top-24 -left-16 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: "#7C3AED" }} />
      <div className="absolute top-40 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "#FFB627" }} />
      <div className="absolute bottom-10 -left-10 w-56 h-56 rounded-full opacity-20 blur-3xl" style={{ background: "#2EC4B6" }} />
    </div>
  );
}

function Confetti({ pieceCount = 60, gold = false }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: pieceCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.4,
        rotate: Math.random() * 360,
        color: (gold ? GOLD_COLORS : CONFETTI_COLORS)[i % (gold ? GOLD_COLORS.length : CONFETTI_COLORS.length)],
        width: 5 + Math.random() * 6,
        height: 8 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 120,
      })),
    [pieceCount, gold]
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--drift": `${p.drift}px`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingXp({ item }) {
  if (!item) return null;
  return (
    <div key={item.id} className="float-xp-pop fixed top-16 right-6 z-40 pointer-events-none">
      <span className="font-display text-lg text-[#FFB627] drop-shadow" style={{ WebkitTextStroke: "1px #7A2E24" }}>
        +{item.amount} XP
      </span>
    </div>
  );
}

function ComboToast({ text }) {
  if (!text) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none combo-pop">
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-4 py-2 rounded-full shadow-lg font-display text-sm tracking-wide">
        <Zap size={16} fill="white" /> {text}
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    { id: "path", label: "Pfad", icon: Map },
    { id: "grammar-home", label: "Grammatik", icon: LayoutGrid },
    { id: "vocab-home", label: "Vokabeln", icon: BookOpen },
    { id: "leaderboard", label: "Rangliste", icon: Trophy },
    { id: "profile", label: "Profil", icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-30">
      <div className="w-full max-w-md glass-strong border-t-0 px-2 py-2.5 flex items-center justify-around">
        {items.map((it) => {
          const Icon = it.icon;
          const active = screen === it.id;
          return (
            <button key={it.id} onClick={() => setScreen(it.id)} className="flex flex-col items-center gap-1 px-1.5 py-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  active ? "shadow-md" : ""
                }`}
                style={active ? { background: "linear-gradient(135deg, #FF4FA3, #8B5CF6)" } : {}}
              >
                <Icon size={19} color={active ? "#FFFBF2" : "#A79A7E"} />
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${active ? "text-[#C2185B]" : "text-[#A79A7E]"}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN APP */
/* ------------------------------------------------------------------ */

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [profiles, setProfiles] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [addingProfile, setAddingProfile] = useState(false);

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [completed, setCompleted] = useState(new Set());
  const [unlockedBadges, setUnlockedBadges] = useState(new Set());
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [lastCompletedId, setLastCompletedId] = useState(null);

  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [combo, setCombo] = useState(0);

  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const [bank, setBank] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const [floatXp, setFloatXp] = useState(null);
  const [comboToast, setComboToast] = useState(null);
  const [heartShake, setHeartShake] = useState(false);

  const [newBadges, setNewBadges] = useState([]);
  const [newStreakValue, setNewStreakValue] = useState(0);

  const [leaderboardRows, setLeaderboardRows] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const animatedXp = useCountUp(sessionXp, 900);

  const [vocabProgress, setVocabProgress] = useState({});
  const [vocabRound, setVocabRound] = useState([]);
  const [vocabIdx, setVocabIdx] = useState(0);
  const [vocabSelected, setVocabSelected] = useState(null);
  const [vocabChecked, setVocabChecked] = useState(false);
  const [vocabIsCorrect, setVocabIsCorrect] = useState(null);
  const [vocabCorrectCount, setVocabCorrectCount] = useState(0);
  const [vocabXpEarned, setVocabXpEarned] = useState(0);
  const [vocabMasteredCount, setVocabMasteredCount] = useState(0);

  const [exploreIdx, setExploreIdx] = useState(0);
  const [exploreFlipped, setExploreFlipped] = useState(false);

  const [memoryCards, setMemoryCards] = useState([]);
  const [memoryFlipped, setMemoryFlipped] = useState([]);
  const [memoryMatched, setMemoryMatched] = useState(new Set());
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryLocked, setMemoryLocked] = useState(false);
  const [memoryDone, setMemoryDone] = useState(false);
  const [memoryXpEarned, setMemoryXpEarned] = useState(0);

  const [blitzActive, setBlitzActive] = useState(false);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(30);
  const [blitzQuestion, setBlitzQuestion] = useState(null);
  const [blitzSelected, setBlitzSelected] = useState(null);
  const [blitzChecked, setBlitzChecked] = useState(false);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzDone, setBlitzDone] = useState(false);
  const [blitzXpEarned, setBlitzXpEarned] = useState(0);

  const [syncCodeInput, setSyncCodeInput] = useState("");
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncCopyLabel, setSyncCopyLabel] = useState("KOPIEREN");

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("Idee");

  const [grammarMode, setGrammarMode] = useState("declension");
  const [grammarRound, setGrammarRound] = useState([]);
  const [grammarIdx, setGrammarIdx] = useState(0);
  const [grammarSelected, setGrammarSelected] = useState(null);
  const [grammarChecked, setGrammarChecked] = useState(false);
  const [grammarIsCorrect, setGrammarIsCorrect] = useState(null);
  const [grammarCorrectCount, setGrammarCorrectCount] = useState(0);
  const [grammarXpEarned, setGrammarXpEarned] = useState(0);
  const [expandedParadigm, setExpandedParadigm] = useState(null);
  const [dailyRevealed, setDailyRevealed] = useState(false);

  const active = profiles.find((p) => p.id === activeId) || null;
  const rank = getRank(xp);

  const currentLesson = useMemo(() => FLAT_LESSONS.find((l) => l.id === currentLessonId) || null, [currentLessonId]);
  const exercises = currentLesson ? currentLesson.exercises : [];
  const ex = exercises[idx];

  // Initial load
  useEffect(() => {
    const list = loadProfiles();
    const aid = loadActiveIdLS();
    setProfiles(list);
    const found = list.find((p) => p.id === aid) || list[0] || null;
    if (found) {
      setActiveId(found.id);
      setXp(found.xp);
      setStreak(found.streak);
      setCompleted(new Set(found.completedLessons));
      setUnlockedBadges(new Set(found.unlockedBadges));
      setVocabProgress(found.vocabProgress || {});
      setScreen("path");
    } else {
      setScreen("onboarding");
    }
  }, []);

  useEffect(() => {
    if (!ex) return;
    setSelected(null);
    setText("");
    setChecked(false);
    setIsCorrect(null);
    if (ex.type === "order") {
      setBank(shuffle(ex.words));
      setAnswer([]);
    }
  }, [idx, currentLessonId]);

  useEffect(() => {
    if (!floatXp) return;
    const t = setTimeout(() => setFloatXp(null), 850);
    return () => clearTimeout(t);
  }, [floatXp]);

  useEffect(() => {
    if (!comboToast) return;
    const t = setTimeout(() => setComboToast(null), 1300);
    return () => clearTimeout(t);
  }, [comboToast]);

  useEffect(() => {
    if (screen === "leaderboard" && active) {
      loadLeaderboard();
    }
  }, [screen, active?.classCode]);

  useEffect(() => {
    if (active && !active.syncCode) {
      persistProfile({ syncCode: generateSyncCode() });
    }
  }, [active?.id]);

  async function loadLeaderboard() {
    if (!active) return;
    setLeaderboardLoading(true);
    const rows = await fetchLeaderboard(active.classCode);
    setLeaderboardRows(rows);
    setLeaderboardLoading(false);
  }

  function persistProfile(updatedFields) {
    if (!active) return;
    const updated = { ...active, ...updatedFields };
    const nextList = profiles.map((p) => (p.id === active.id ? updated : p));
    setProfiles(nextList);
    saveProfilesLS(nextList);
    syncToCloud(updated);
  }

  function isUnlocked(lessonId) {
    const i = FLAT_LESSONS.findIndex((l) => l.id === lessonId);
    if (i === 0) return true;
    return completed.has(FLAT_LESSONS[i - 1].id);
  }

  function startLesson(lessonId) {
    setCurrentLessonId(lessonId);
    setIdx(0);
    setMistakes(0);
    setSessionXp(0);
    setCombo(0);
    setHearts(5);
    setScreen("lesson");
  }

  function retryLesson() {
    setIdx(0);
    setMistakes(0);
    setSessionXp(0);
    setCombo(0);
    setHearts(5);
    setScreen("lesson");
  }

  function toggleOrderWord(word, from) {
    if (checked) return;
    if (from === "bank") {
      setBank((b) => {
        const i = b.indexOf(word);
        const nb = [...b];
        nb.splice(i, 1);
        return nb;
      });
      setAnswer((a) => [...a, word]);
    } else {
      setAnswer((a) => {
        const i = a.indexOf(word);
        const na = [...a];
        na.splice(i, 1);
        return na;
      });
      setBank((b) => [...b, word]);
    }
  }

  function canCheck() {
    if (!ex) return false;
    if (ex.type === "mc") return selected !== null;
    if (ex.type === "translate") return text.trim().length > 0;
    if (ex.type === "order") return answer.length === ex.words.length;
    return false;
  }

  function handleCheck() {
    let correct = false;
    if (ex.type === "mc") correct = selected === ex.correct;
    if (ex.type === "translate") correct = ex.accept.includes(normalize(text));
    if (ex.type === "order") correct = answer.join("|") === ex.correct.join("|");

    setIsCorrect(correct);
    setChecked(true);

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = newCombo >= 3 ? 5 : 0;
      const gain = 10 + bonus;
      setSessionXp((v) => v + gain);
      setFloatXp({ id: Date.now(), amount: gain });
      if (newCombo >= 3) setComboToast(`COMBO x${newCombo}! 🔥`);
    } else {
      setCombo(0);
      setMistakes((m) => m + 1);
      setHearts((h) => Math.max(0, h - 1));
      setHeartShake(true);
      setTimeout(() => setHeartShake(false), 500);
    }
  }

  function handleContinue() {
    if (hearts === 0 && !isCorrect) {
      setScreen("failed");
      return;
    }
    if (idx + 1 < exercises.length) {
      setIdx((i) => i + 1);
    } else {
      finishLesson();
    }
  }

  function continueReading() {
    if (idx + 1 < exercises.length) {
      setIdx((i) => i + 1);
    } else {
      finishLesson();
    }
  }

  function finishLesson() {
    const wasFirst = completed.size === 0;
    const perfect = mistakes === 0;
    const nextCompleted = new Set(completed);
    nextCompleted.add(currentLessonId);
    setCompleted(nextCompleted);
    setLastCompletedId(currentLessonId);

    const totalXp = xp + sessionXp;
    setXp(totalXp);
    const newStreak = computeNewStreak(active);
    setStreak(newStreak);
    setNewStreakValue(newStreak);

    const unit = UNITS.find((u) => u.id === currentLesson.unitId);
    const unitJustCompleted = unit.lessons.every((l) => nextCompleted.has(l.id));

    const earned = [];
    if (wasFirst) earned.push("first");
    if (perfect) earned.push("perfect");
    if (unitJustCompleted) earned.push("unit");
    if (totalXp >= 150) earned.push("xp150");
    if (newStreak >= 5) earned.push("streak5");

    const freshlyNew = earned.filter((id) => !unlockedBadges.has(id));
    const nextBadges = new Set(unlockedBadges);
    freshlyNew.forEach((id) => nextBadges.add(id));
    setUnlockedBadges(nextBadges);
    setNewBadges(freshlyNew);

    persistProfile({
      xp: totalXp,
      streak: newStreak,
      lastActiveDate: todayStr(),
      completedLessons: [...nextCompleted],
      unlockedBadges: [...nextBadges],
    });

    setScreen("summary");
  }

  function createProfile({ classCodeInput, alias, avatar }) {
    const classCode = classCodeInput.trim().toLowerCase();
    const newProfile = {
      id: uuid(),
      deviceSecret: uuid(),
      classCode,
      classCodeDisplay: classCodeInput.trim(),
      alias: alias.trim(),
      avatar,
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      completedLessons: [],
      unlockedBadges: [],
      vocabProgress: {},
      syncCode: generateSyncCode(),
    };
    const nextList = [...profiles, newProfile];
    setProfiles(nextList);
    saveProfilesLS(nextList);
    setActiveId(newProfile.id);
    saveActiveIdLS(newProfile.id);
    setXp(0);
    setStreak(0);
    setCompleted(new Set());
    setUnlockedBadges(new Set());
    setVocabProgress({});
    syncToCloud(newProfile);
    setAddingProfile(false);
    setScreen("path");
  }

  function switchProfile(id) {
    const p = profiles.find((x) => x.id === id);
    if (!p) return;
    setActiveId(id);
    saveActiveIdLS(id);
    setXp(p.xp);
    setStreak(p.streak);
    setCompleted(new Set(p.completedLessons));
    setUnlockedBadges(new Set(p.unlockedBadges));
    setVocabProgress(p.vocabProgress || {});
    setScreen("path");
  }

  function updateActiveAliasAvatar(alias, avatar) {
    persistProfile({ alias, avatar });
  }

  /* ---- Mini-Spiel: Memory ---- */

  function startMemoryGame() {
    const pairCount = Math.min(6, availableVocab.length);
    const words = shuffle(availableVocab).slice(0, pairCount);
    const cards = shuffle(
      words.flatMap((w) => [
        { key: `${w.id}-la`, wordId: w.id, text: w.latin, kind: "latin" },
        { key: `${w.id}-de`, wordId: w.id, text: w.german, kind: "german" },
      ])
    );
    setMemoryCards(cards);
    setMemoryFlipped([]);
    setMemoryMatched(new Set());
    setMemoryMoves(0);
    setMemoryLocked(false);
    setMemoryDone(false);
    setMemoryXpEarned(0);
    setScreen("game-memory");
  }

  function handleMemoryCardTap(index) {
    if (memoryLocked) return;
    if (memoryFlipped.includes(index)) return;
    if (memoryMatched.has(memoryCards[index].wordId)) return;

    const nextFlipped = [...memoryFlipped, index];
    setMemoryFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [a, b] = nextFlipped;
      const cardA = memoryCards[a];
      const cardB = memoryCards[b];
      if (cardA.wordId === cardB.wordId && cardA.kind !== cardB.kind) {
        const nextMatched = new Set(memoryMatched);
        nextMatched.add(cardA.wordId);
        setTimeout(() => {
          setMemoryMatched(nextMatched);
          setMemoryFlipped([]);
          if (nextMatched.size === memoryCards.length / 2) {
            const earned = Math.max(10, 30 - Math.max(0, memoryMoves + 1 - memoryCards.length / 2) * 3);
            setMemoryXpEarned(earned);
            setMemoryDone(true);
            const totalXp = xp + earned;
            setXp(totalXp);
            persistProfile({ xp: totalXp });
          }
        }, 500);
      } else {
        setMemoryLocked(true);
        setTimeout(() => {
          setMemoryFlipped([]);
          setMemoryLocked(false);
        }, 900);
      }
    }
  }

  /* ---- Mini-Spiel: Wortblitz ---- */

  function nextBlitzQuestion() {
    const pool = availableVocab.length >= 4 ? availableVocab : VOCAB_POOL;
    const word = pool[Math.floor(Math.random() * pool.length)];
    setBlitzQuestion(buildVocabQuestion(word, pool));
    setBlitzSelected(null);
    setBlitzChecked(false);
  }

  function startBlitzGame() {
    setBlitzScore(0);
    setBlitzTimeLeft(30);
    setBlitzDone(false);
    setBlitzXpEarned(0);
    nextBlitzQuestion();
    setBlitzActive(true);
    setScreen("game-blitz");
  }

  function handleBlitzAnswer(i) {
    if (blitzChecked || !blitzActive) return;
    setBlitzSelected(i);
    setBlitzChecked(true);
    if (i === blitzQuestion.correctIndex) {
      setBlitzScore((s) => s + 1);
    }
    setTimeout(() => {
      if (blitzActive) nextBlitzQuestion();
    }, 500);
  }

  useEffect(() => {
    if (!blitzActive) return;
    if (blitzTimeLeft <= 0) {
      setBlitzActive(false);
      setBlitzDone(true);
      const earned = Math.min(60, blitzScore * 3);
      setBlitzXpEarned(earned);
      const totalXp = xp + earned;
      setXp(totalXp);
      persistProfile({ xp: totalXp });
      return;
    }
    const t = setTimeout(() => setBlitzTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [blitzActive, blitzTimeLeft]);

  /* ---- Geräte-Sync ---- */

  async function copySyncCode() {
    if (!active?.syncCode) return;
    try {
      await navigator.clipboard.writeText(active.syncCode);
      setSyncCopyLabel("KOPIERT! ✓");
      setTimeout(() => setSyncCopyLabel("KOPIEREN"), 1800);
    } catch {
      setSyncCopyLabel("Fehler");
    }
  }

  async function loadProfileFromSyncCode() {
    const code = syncCodeInput.trim().toUpperCase();
    if (!code) return;
    if (!supabase) {
      setSyncStatus({ ok: false, msg: "Cloud-Sync ist nicht eingerichtet." });
      return;
    }
    setSyncStatus({ ok: null, msg: "Suche Profil …" });
    try {
      const { data, error } = await supabase.from("players").select("*").eq("sync_code", code).maybeSingle();
      if (error) throw error;
      if (!data) {
        setSyncStatus({ ok: false, msg: "Kein Profil mit diesem Code gefunden." });
        return;
      }
      const restored = {
        id: data.id,
        deviceSecret: uuid(),
        classCode: data.class_code,
        classCodeDisplay: data.class_code,
        alias: data.alias,
        avatar: data.avatar,
        xp: data.xp || 0,
        streak: data.streak || 0,
        lastActiveDate: todayStr(),
        completedLessons: data.completed_lessons || [],
        unlockedBadges: data.unlocked_badges || [],
        vocabProgress: data.vocab_progress || {},
        syncCode: data.sync_code,
      };
      const withoutDup = profiles.filter((p) => p.id !== restored.id);
      const nextList = [...withoutDup, restored];
      setProfiles(nextList);
      saveProfilesLS(nextList);
      setActiveId(restored.id);
      saveActiveIdLS(restored.id);
      setXp(restored.xp);
      setStreak(restored.streak);
      setCompleted(new Set(restored.completedLessons));
      setUnlockedBadges(new Set(restored.unlockedBadges));
      setVocabProgress(restored.vocabProgress);
      setSyncStatus({ ok: true, msg: `Profil „${restored.alias}“ geladen!` });
      setSyncCodeInput("");
      setTimeout(() => setScreen("path"), 1200);
    } catch (e) {
      setSyncStatus({ ok: false, msg: "Fehler beim Laden." });
    }
  }

  /* ---- Feedback ---- */

  function sendFeedback() {
    const subject = encodeURIComponent(`Lingua Latina Feedback (${feedbackCategory})`);
    const body = encodeURIComponent(
      `${feedbackText}\n\n---\nVon: ${active?.alias || "unbekannt"} (Klasse ${active?.classCodeDisplay || "-"})\nKategorie: ${feedbackCategory}`
    );
    window.location.href = `mailto:Dominik@hoferer.me?subject=${subject}&body=${body}`;
  }

  /* ---- Grammatik-Trainer ---- */

  const availableNouns = getAvailableNouns(completed);
  const availableCases = getAvailableCases(completed);
  const availableVerbs = getAvailableVerbs(completed);

  function startDeclensionTraining() {
    const round = [];
    for (let i = 0; i < 8; i++) {
      const noun = availableNouns[Math.floor(Math.random() * availableNouns.length)];
      round.push(buildDeclensionQuestion(noun, availableCases));
    }
    setGrammarMode("declension");
    setGrammarRound(round);
    setGrammarIdx(0);
    setGrammarSelected(null);
    setGrammarChecked(false);
    setGrammarIsCorrect(null);
    setGrammarCorrectCount(0);
    setGrammarXpEarned(0);
    setScreen("grammar-quiz");
  }

  function startConjugationTraining() {
    const round = [];
    for (let i = 0; i < 8; i++) {
      const verb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
      const tensesForVerb = getAvailableTenses(verb, completed);
      if (tensesForVerb.length === 0) continue;
      round.push(buildConjugationQuestion(verb, tensesForVerb));
    }
    setGrammarMode("conjugation");
    setGrammarRound(round);
    setGrammarIdx(0);
    setGrammarSelected(null);
    setGrammarChecked(false);
    setGrammarIsCorrect(null);
    setGrammarCorrectCount(0);
    setGrammarXpEarned(0);
    setScreen("grammar-quiz");
  }

  function handleGrammarCheck() {
    const q = grammarRound[grammarIdx];
    const correct = grammarSelected === q.correctIndex;
    setGrammarIsCorrect(correct);
    setGrammarChecked(true);
    if (correct) {
      setGrammarCorrectCount((c) => c + 1);
      setGrammarXpEarned((x) => x + 5);
      setFloatXp({ id: Date.now(), amount: 5 });
    }
  }

  function handleGrammarContinue() {
    if (grammarIdx + 1 < grammarRound.length) {
      setGrammarIdx((i) => i + 1);
      setGrammarSelected(null);
      setGrammarChecked(false);
      setGrammarIsCorrect(null);
    } else {
      const totalXp = xp + grammarXpEarned;
      setXp(totalXp);
      persistProfile({ xp: totalXp });
      setScreen("grammar-summary");
    }
  }

  const availableVocab = getAvailableVocab(completed);
  const dueVocab = getDueVocab(availableVocab, vocabProgress);
  const masteredVocabCount = availableVocab.filter((w) => (vocabProgress[w.id]?.box ?? -1) >= 5).length;

  function startVocabTraining() {
    const pool = availableVocab.length >= 4 ? availableVocab : VOCAB_POOL;
    const sorted = [...dueVocab].sort((a, b) => {
      const boxA = vocabProgress[a.id]?.box ?? -1;
      const boxB = vocabProgress[b.id]?.box ?? -1;
      return boxA - boxB;
    });
    const round = sorted.slice(0, 10).map((w) => buildVocabQuestion(w, pool));
    setVocabRound(round);
    setVocabIdx(0);
    setVocabSelected(null);
    setVocabChecked(false);
    setVocabIsCorrect(null);
    setVocabCorrectCount(0);
    setVocabXpEarned(0);
    setVocabMasteredCount(0);
    setScreen("vocab-quiz");
  }

  function handleVocabCheck() {
    const q = vocabRound[vocabIdx];
    const correct = vocabSelected === q.correctIndex;
    setVocabIsCorrect(correct);
    setVocabChecked(true);

    const prevState = vocabProgress[q.wordId];
    const prevBox = prevState?.box ?? -1;
    const newState = updateWordBox(prevState, correct);
    const nextProgress = { ...vocabProgress, [q.wordId]: newState };
    setVocabProgress(nextProgress);

    if (correct) {
      setVocabCorrectCount((c) => c + 1);
      setVocabXpEarned((x) => x + 5);
      setFloatXp({ id: Date.now(), amount: 5 });
      if (newState.box >= 5 && prevBox < 5) {
        setVocabMasteredCount((m) => m + 1);
      }
    }
  }

  function handleVocabContinue() {
    if (vocabIdx + 1 < vocabRound.length) {
      setVocabIdx((i) => i + 1);
      setVocabSelected(null);
      setVocabChecked(false);
      setVocabIsCorrect(null);
    } else {
      const totalXp = xp + vocabXpEarned;
      setXp(totalXp);
      persistProfile({ xp: totalXp, vocabProgress });
      setScreen("vocab-summary");
    }
  }

  if (screen === "loading") return null;

  /* -------------------------------- ONBOARDING -------------------------------- */

  if (screen === "onboarding") {
    return (
      <OnboardingScreen
        onCreate={createProfile}
        onCancel={addingProfile ? () => { setAddingProfile(false); setScreen("profile"); } : null}
      />
    );
  }

  /* -------------------------------- PATH SCREEN -------------------------------- */

  if (screen === "path") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md bg-transparent min-h-screen pb-28">
          <div className="sticky top-0 z-20 glass-strong border-b-0 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="glossy w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: "linear-gradient(135deg, #FF4FA3, #8B5CF6)" }}
                >
                  <Landmark size={19} color="#FFFBF2" />
                </div>
                <div>
                  <div
                    className="font-display text-[16px] tracking-wide leading-none bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(90deg, #FF4FA3, #8B5CF6)" }}
                  >
                    LINGUA LATINA
                  </div>
                  <div className="text-[10px] text-[#8B5CF6] mt-0.5 italic font-semibold">Roma te vocat! 🏛️</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatPill icon={<Flame size={15} color="#FF7A1A" fill="#FF7A1A" />} value={streak} />
                <StatPill icon={<Heart size={15} color="#E8483A" fill="#E8483A" />} value={hearts} />
                <button
                  onClick={() => setScreen("profile")}
                  className="glossy w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-sm border-2 border-white"
                  style={{ background: "linear-gradient(135deg, #FFD166, #FFB627)" }}
                >
                  {active?.avatar || "🙂"}
                </button>
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold text-[#C2185B] tracking-wide">
                  {rank.current.title.toUpperCase()} · {rank.current.sub}
                </span>
                <span className="text-[11px] text-[#8A7F68] font-mono">
                  {xp} XP{rank.next ? ` / ${rank.next.min}` : " · MAX"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#F0DFC0] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    background: "linear-gradient(90deg, #FFB627, #FF4FA3)",
                    width: rank.next
                      ? `${Math.min(100, ((xp - rank.current.min) / (rank.next.min - rank.current.min)) * 100)}%`
                      : "100%",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
            {BADGES.map((b) => {
              const on = unlockedBadges.has(b.id);
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  title={b.desc}
                  className={`shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center ${
                    on ? "bg-gradient-to-br from-[#FFE08C] to-[#FFB627] border-[#F59E0B]" : "bg-[#EFE6D4] border-[#E4D7BA] grayscale opacity-60"
                  }`}
                >
                  <Icon size={20} color={on ? "#7A2E00" : "#8A7F68"} />
                </div>
              );
            })}
          </div>

          <div className="px-4">
            <DailySentenceCard revealed={dailyRevealed} onToggle={() => setDailyRevealed((r) => !r)} />
          </div>

          <div className="relative px-4 pt-2">
            {UNITS.map((unit, uIdx) => (
              <div key={unit.id} className="relative">
                <UnitBanner unit={unit} completed={completed} gradient={UNIT_GRADIENTS[uIdx % UNIT_GRADIENTS.length]} />
                <div className="relative py-4">
                  <StoneRoad />
                  <div className="flex flex-col gap-7 relative">
                    {unit.lessons.map((lesson) => {
                      const gIdx = FLAT_LESSONS.findIndex((l) => l.id === lesson.id);
                      const offset = Math.round(Math.sin(gIdx * 0.9) * 70);
                      const isDone = completed.has(lesson.id);
                      const unlocked = isUnlocked(lesson.id);
                      const isNext = unlocked && !isDone && FLAT_LESSONS.findIndex((l) => !completed.has(l.id)) === gIdx;
                      const justPopped = lesson.id === lastCompletedId;
                      return (
                        <div key={lesson.id} className="relative flex justify-center" style={{ transform: `translateX(${offset}px)` }}>
                          <button
                            onClick={() => unlocked && startLesson(lesson.id)}
                            disabled={!unlocked}
                            className={`glossy relative w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                              !unlocked ? "bg-[#DCCFA9] cursor-not-allowed" : isDone ? "bg-gradient-to-br from-[#FFD166] to-[#FFB627]" : "bg-gradient-to-br from-[#FF4FA3] to-[#8B5CF6]"
                            } ${isNext ? "ring-4 ring-[#FF4FA3]/30 animate-bounce-slow" : ""} ${justPopped ? "animate-pop-in" : ""}`}
                          >
                            {isDone && <Laurel size={80} />}
                            {!unlocked ? (
                              <Lock size={22} color="#8A7F5E" />
                            ) : isDone ? (
                              <Check size={24} color="#FFFBF2" strokeWidth={3} />
                            ) : (
                              <Star size={22} color="#FFFBF2" fill="#FFFBF2" />
                            )}
                          </button>
                          <div className="absolute text-[10px] text-[#6B5F4E] font-semibold w-28 text-center" style={{ top: "68px" }}>
                            {lesson.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  /* -------------------------------- VOCAB HOME -------------------------------- */

  if (screen === "vocab-home") {
    const gamesUnlocked = xp >= 20;
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md min-h-screen pb-28 px-5 pt-6">
          <h1 className="font-display text-lg text-[#2B241D] mb-1">VOKABELN</h1>
          <p className="text-[13px] text-[#8A7F68] mb-5">Trainieren, frei entdecken oder in kleinen Spielen üben.</p>

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <SummaryStat label="Fällig" value={dueVocab.length} color="#EC4899" />
            <SummaryStat label="Gelernt" value={availableVocab.length} color="#8B5CF6" />
            <SummaryStat label="Gemeistert" value={masteredVocabCount} color="#F59E0B" />
          </div>

          {/* Karteikasten-Training */}
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={17} color="#8B5CF6" />
              <div className="font-display text-[13px] text-[#2B241D]">KARTEIKASTEN-TRAINING</div>
            </div>
            <p className="text-[12px] text-[#8A7F68] mb-3">Spaced Repetition — was du oft richtig hast, kommt seltener dran.</p>
            {availableVocab.length === 0 ? (
              <div className="text-[12px] text-[#8A7F68] py-1">Schließe erst deine erste Lektion ab! 📚</div>
            ) : dueVocab.length === 0 ? (
              <div className="text-[12px] text-[#8A7F68] py-1">Alles gelernt — komm morgen wieder 🌙✨</div>
            ) : (
              <button
                onClick={startVocabTraining}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white font-display text-xs tracking-wide shadow-md"
              >
                TRAINING STARTEN ({Math.min(dueVocab.length, 10)})
              </button>
            )}
          </div>

          {/* Frei entdecken */}
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={17} color="#3B82F6" />
              <div className="font-display text-[13px] text-[#2B241D]">FREI ENTDECKEN</div>
            </div>
            <p className="text-[12px] text-[#8A7F68] mb-3">Alle {VOCAB_POOL.length} Wörter als Karteikarten durchblättern — auch schon vor dem Lernpfad.</p>
            <button
              onClick={() => {
                setExploreIdx(0);
                setExploreFlipped(false);
                setScreen("vocab-explore");
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2EC4B6] text-white font-display text-xs tracking-wide shadow-md"
            >
              ENTDECKEN STARTEN
            </button>
          </div>

          {/* Spiele */}
          <div className="glass rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={17} color="#F59E0B" />
              <div className="font-display text-[13px] text-[#2B241D]">MINI-SPIELE</div>
            </div>
            {gamesUnlocked ? (
              <>
                <p className="text-[12px] text-[#8A7F68] mb-3">Memory & Wortblitz — mit deinen gelernten Wörtern.</p>
                <button
                  onClick={() => setScreen("games-home")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EC4899] text-white font-display text-xs tracking-wide shadow-md"
                >
                  ZU DEN SPIELEN
                </button>
              </>
            ) : (
              <div className="text-[12px] text-[#8A7F68] py-1">🔒 Ab 20 XP freigeschaltet (aktuell: {xp} XP)</div>
            )}
          </div>

          {availableVocab.length > 0 && (
            <>
              <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">MEINE WÖRTER</div>
              <div className="grid grid-cols-2 gap-2.5">
                {availableVocab.map((w) => {
                  const box = vocabProgress[w.id]?.box ?? -1;
                  const mastered = box >= 5;
                  const dotColor = box < 0 ? "#DCCFA9" : box <= 1 ? "#F59E0B" : box <= 3 ? "#3B82F6" : "#FFB627";
                  return (
                    <div key={w.id} className="glass rounded-xl px-3.5 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-serif-latin text-[14px] text-[#2B241D] italic truncate">{w.latin}</div>
                        {mastered && <Sparkles size={13} color="#F59E0B" />}
                      </div>
                      <div className="text-[11px] text-[#8A7F68] truncate mb-1.5">{w.german}</div>
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full"
                            style={{ background: i <= box ? dotColor : "#F0DFC0" }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  /* -------------------------------- VOCAB EXPLORE (frei entdecken) -------------------------------- */

  if (screen === "vocab-explore") {
    const word = VOCAB_POOL[exploreIdx];
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md min-h-screen flex flex-col px-5 pt-4 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setScreen("vocab-home")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <div className="flex-1 text-center text-[12px] font-bold text-[#8A7F68]">
              {exploreIdx + 1} / {VOCAB_POOL.length}
            </div>
            <div className="w-[22px]" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <button
              onClick={() => setExploreFlipped((f) => !f)}
              className="glass-strong w-full aspect-[4/3] rounded-3xl flex flex-col items-center justify-center px-6 animate-pop-in"
              key={word.id}
            >
              {!exploreFlipped ? (
                <>
                  <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-3">LATEIN</div>
                  <div className="font-serif-latin italic text-4xl text-[#2B241D] text-center">{word.latin}</div>
                </>
              ) : (
                <>
                  <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-3">DEUTSCH</div>
                  <div className="font-display text-3xl text-[#2B241D] text-center">{word.german}</div>
                </>
              )}
              <div className="text-[11px] text-[#A79A7E] mt-5">🔄 Zum Umdrehen tippen</div>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => {
                setExploreIdx((i) => (i === 0 ? VOCAB_POOL.length - 1 : i - 1));
                setExploreFlipped(false);
              }}
              className="flex-1 py-3.5 rounded-xl glass text-[#2B241D] font-display text-xs tracking-wide"
            >
              ◀ ZURÜCK
            </button>
            <button
              onClick={() => {
                setExploreIdx((i) => (i === VOCAB_POOL.length - 1 ? 0 : i + 1));
                setExploreFlipped(false);
              }}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2EC4B6] text-white font-display text-xs tracking-wide shadow-md"
            >
              WEITER ▶
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- VOCAB QUIZ -------------------------------- */

  if (screen === "vocab-quiz" && vocabRound[vocabIdx]) {
    const q = vocabRound[vocabIdx];
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <FloatingXp item={floatXp} />
        <div className="w-full max-w-md bg-[#FFF6E9] min-h-screen flex flex-col">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <button onClick={() => setScreen("vocab-home")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <div className="flex-1 h-2.5 rounded-full bg-[#F0DFC0] overflow-hidden flex gap-0.5 p-0.5">
              {vocabRound.map((_, i) => (
                <div key={i} className={`flex-1 rounded-full transition-colors ${i < vocabIdx ? "bg-[#2EC4B6]" : i === vocabIdx ? "bg-[#EC4899]" : "bg-transparent"}`} />
              ))}
            </div>
          </div>

          <div className="flex-1 px-5 pt-8 pb-40">
            <div className="text-[11px] tracking-widest text-[#C2185B] font-bold mb-2">
              {q.direction === "latin-de" ? "LATEIN → DEUTSCH" : "DEUTSCH → LATEIN"}
            </div>
            <div className={`text-3xl text-[#2B241D] mb-8 ${q.direction === "latin-de" ? "font-serif-latin italic" : "font-display"}`}>
              {q.prompt}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, i) => {
                const isSel = vocabSelected === i;
                let style = "glass text-[#2B241D]";
                if (vocabChecked && i === q.correctIndex) style = "border-[#2EC4B6] bg-[#2EC4B6]/15 text-[#2B241D] animate-pop-in";
                else if (vocabChecked && isSel && i !== q.correctIndex) style = "border-[#E8483A] bg-[#E8483A]/10 text-[#2B241D]";
                else if (isSel) style = "border-[#EC4899] bg-[#EC4899]/10 text-[#2B241D]";
                return (
                  <button
                    key={i}
                    disabled={vocabChecked}
                    onClick={() => setVocabSelected(i)}
                    className={`text-left px-4 py-3.5 rounded-xl border-2 font-serif-latin text-[15px] transition-colors ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`fixed bottom-0 left-0 right-0 flex justify-center border-t-2 transition-colors ${
              vocabChecked ? (vocabIsCorrect ? "bg-[#DFF5E9] border-[#2EC4B6]" : "bg-[#FBE2DC] border-[#E8483A]") : "bg-[#FFFBF2] border-[#F0DFC0]"
            }`}
          >
            <div className="w-full max-w-md px-5 py-4">
              {vocabChecked && (
                <div className="flex items-center gap-2 mb-3">
                  <div className={vocabIsCorrect ? "animate-pop-in" : ""}>
                    {vocabIsCorrect ? <Check size={22} color="#0E7A5F" strokeWidth={3} /> : <X size={20} color="#B4291D" />}
                  </div>
                  <div className={`font-display text-sm ${vocabIsCorrect ? "text-[#0E7A5F]" : "text-[#B4291D]"}`}>
                    {vocabIsCorrect ? "Richtig!" : `Richtig wäre: ${q.options[q.correctIndex]}`}
                  </div>
                </div>
              )}
              {!vocabChecked ? (
                <button
                  onClick={handleVocabCheck}
                  disabled={vocabSelected === null}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide transition-all ${
                    vocabSelected !== null ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white shadow-md" : "bg-[#E4D7BA] text-[#A79A7E] cursor-not-allowed"
                  }`}
                >
                  PRÜFEN
                </button>
              ) : (
                <button
                  onClick={handleVocabContinue}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-md ${
                    vocabIsCorrect ? "bg-gradient-to-r from-[#2EC4B6] to-[#0E9E85] text-white" : "bg-gradient-to-r from-[#E8483A] to-[#B4291D] text-white"
                  }`}
                >
                  WEITER <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- VOCAB SUMMARY -------------------------------- */

  if (screen === "vocab-summary") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9] relative overflow-hidden">
        <FontImport />
        <BackgroundBlobs />
        {vocabMasteredCount > 0 && <Confetti pieceCount={50} gold />}
        <div className="w-full max-w-md min-h-screen flex flex-col items-center px-8 pt-16 pb-10 relative z-10">
          <div className="glossy w-24 h-24 mb-4 rounded-full flex items-center justify-center animate-pop-in" style={{ background: "linear-gradient(135deg, #FF4FA3, #8B5CF6)" }}>
            <BookOpen size={34} color="white" />
          </div>
          <h1 className="font-display text-2xl text-[#2B241D] mb-1">GUT TRAINIERT!</h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">
            {vocabCorrectCount} von {vocabRound.length} Wörtern richtig.
          </p>

          <div className="w-full grid grid-cols-3 gap-3 mb-8">
            <SummaryStat label="XP" value={`+${vocabXpEarned}`} color="#F59E0B" />
            <SummaryStat label="Richtig" value={vocabCorrectCount} color="#0E9E85" />
            <SummaryStat label="Neu gemeistert" value={vocabMasteredCount} color="#EC4899" />
          </div>

          <button
            onClick={() => setScreen("vocab-home")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white font-display text-sm tracking-wide mt-auto shadow-md"
          >
            WEITER
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- GRAMMAR HOME -------------------------------- */

  if (screen === "grammar-home") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md min-h-screen pb-28 px-5 pt-6">
          <h1 className="font-display text-lg text-[#2B241D] mb-1">GRAMMATIK</h1>
          <p className="text-[13px] text-[#8A7F68] mb-5">Das Herzstück von Latein — Formen erkennen und bilden.</p>

          <button
            onClick={startDeclensionTraining}
            disabled={availableNouns.length === 0 || availableCases.length === 0}
            className="w-full glass rounded-2xl p-5 mb-4 text-left flex items-center gap-4 disabled:opacity-50"
          >
            <div className="glossy w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
              <LayoutGrid size={24} color="white" />
            </div>
            <div>
              <div className="font-display text-[14px] text-[#2B241D] mb-0.5">Deklinieren</div>
              <div className="text-[12px] text-[#8A7F68]">
                {availableNouns.length === 0 ? "Schließe erst eine Lektion mit Nomen ab" : "Nomen durch die Fälle üben"}
              </div>
            </div>
          </button>

          <button
            onClick={startConjugationTraining}
            disabled={availableVerbs.length === 0}
            className="w-full glass rounded-2xl p-5 mb-6 text-left flex items-center gap-4 disabled:opacity-50"
          >
            <div className="glossy w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}>
              <Zap size={24} color="white" />
            </div>
            <div>
              <div className="font-display text-[14px] text-[#2B241D] mb-0.5">Konjugieren</div>
              <div className="text-[12px] text-[#8A7F68]">
                {availableVerbs.length === 0 ? "Schließe erst eine Lektion mit Verben ab" : "Verben durch die Formen üben"}
              </div>
            </div>
          </button>

          {availableNouns.length > 0 && (
            <>
              <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">NOMEN NACHSCHLAGEN</div>
              <div className="flex flex-col gap-2 mb-6">
                {availableNouns.map((n) => {
                  const open = expandedParadigm === `n-${n.id}`;
                  return (
                    <div key={n.id} className="glass rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedParadigm(open ? null : `n-${n.id}`)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left"
                      >
                        <div>
                          <span className="font-serif-latin italic text-[15px] text-[#2B241D]">{n.latin}</span>
                          <span className="text-[11px] text-[#8A7F68]"> — {n.german} · {n.declension}</span>
                        </div>
                        <ChevronDown size={16} color="#8A7F68" className={`transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <div className="px-4 pb-3 grid grid-cols-2 gap-1.5">
                          {availableCases.map((c) => (
                            <div key={c} className="flex justify-between text-[12px] bg-white/40 rounded-lg px-2.5 py-1.5">
                              <span className="text-[#8A7F68]">{c}</span>
                              <span className="font-serif-latin italic text-[#2B241D]">{n.forms[c]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {availableVerbs.length > 0 && (
            <>
              <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">VERBEN NACHSCHLAGEN</div>
              <div className="flex flex-col gap-2">
                {availableVerbs.map((v) => {
                  const open = expandedParadigm === `v-${v.id}`;
                  const tensesForVerb = getAvailableTenses(v, completed);
                  return (
                    <div key={v.id} className="glass rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedParadigm(open ? null : `v-${v.id}`)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left"
                      >
                        <div>
                          <span className="font-serif-latin italic text-[15px] text-[#2B241D]">{v.latin}</span>
                          <span className="text-[11px] text-[#8A7F68]"> — {v.german} · {v.conjugation}</span>
                        </div>
                        <ChevronDown size={16} color="#8A7F68" className={`transition-transform ${open ? "rotate-180" : ""}`} />
                      </button>
                      {open && (
                        <div className="px-4 pb-3">
                          {tensesForVerb.map((t) => (
                            <div key={t} className="mb-2 last:mb-0">
                              <div className="text-[10px] tracking-widest text-[#C2185B] font-bold mb-1">{t.toUpperCase()}</div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {PERSONS.filter((p) => v.tenses[t][p]).map((p) => (
                                  <div key={p} className="flex justify-between text-[12px] bg-white/40 rounded-lg px-2.5 py-1.5">
                                    <span className="text-[#8A7F68]">{p}</span>
                                    <span className="font-serif-latin italic text-[#2B241D]">{v.tenses[t][p]}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  /* -------------------------------- GRAMMAR QUIZ -------------------------------- */

  if (screen === "grammar-quiz" && grammarRound[grammarIdx]) {
    const q = grammarRound[grammarIdx];
    const promptTitle =
      grammarMode === "declension" ? `Dekliniere: ${q.targetCase}` : `Konjugiere: ${q.targetTense} — ${q.targetPerson}`;
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <FloatingXp item={floatXp} />
        <div className="w-full max-w-md bg-[#FFF6E9] min-h-screen flex flex-col">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <button onClick={() => setScreen("grammar-home")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <div className="flex-1 h-2.5 rounded-full bg-[#F0DFC0] overflow-hidden flex gap-0.5 p-0.5">
              {grammarRound.map((_, i) => (
                <div key={i} className={`flex-1 rounded-full transition-colors ${i < grammarIdx ? "bg-[#2EC4B6]" : i === grammarIdx ? "bg-[#3B82F6]" : "bg-transparent"}`} />
              ))}
            </div>
          </div>

          <div className="flex-1 px-5 pt-8 pb-40">
            <div className="text-[11px] tracking-widest text-[#C2185B] font-bold mb-2">{promptTitle.toUpperCase()}</div>
            <div className="font-serif-latin italic text-3xl text-[#2B241D] mb-1">{q.latin}</div>
            <div className="text-[13px] text-[#8A7F68] mb-8">{q.german}</div>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, i) => {
                const isSel = grammarSelected === i;
                let style = "glass text-[#2B241D]";
                if (grammarChecked && i === q.correctIndex) style = "border-2 border-[#2EC4B6] bg-[#2EC4B6]/15 text-[#2B241D] animate-pop-in";
                else if (grammarChecked && isSel && i !== q.correctIndex) style = "border-2 border-[#E8483A] bg-[#E8483A]/10 text-[#2B241D]";
                else if (isSel) style = "border-2 border-[#EC4899] bg-[#EC4899]/10 text-[#2B241D]";
                return (
                  <button
                    key={i}
                    disabled={grammarChecked}
                    onClick={() => setGrammarSelected(i)}
                    className={`text-left px-4 py-3.5 rounded-xl font-serif-latin text-[15px] transition-colors ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`fixed bottom-0 left-0 right-0 flex justify-center border-t-2 transition-colors ${
              grammarChecked ? (grammarIsCorrect ? "bg-[#DFF5E9] border-[#2EC4B6]" : "bg-[#FBE2DC] border-[#E8483A]") : "bg-[#FFFBF2] border-[#F0DFC0]"
            }`}
          >
            <div className="w-full max-w-md px-5 py-4">
              {grammarChecked && (
                <div className="flex items-center gap-2 mb-3">
                  <div className={grammarIsCorrect ? "animate-pop-in" : ""}>
                    {grammarIsCorrect ? <Check size={22} color="#0E7A5F" strokeWidth={3} /> : <X size={20} color="#B4291D" />}
                  </div>
                  <div className={`font-display text-sm ${grammarIsCorrect ? "text-[#0E7A5F]" : "text-[#B4291D]"}`}>
                    {grammarIsCorrect ? "Richtig!" : `Richtig wäre: ${q.options[q.correctIndex]}`}
                  </div>
                </div>
              )}
              {!grammarChecked ? (
                <button
                  onClick={handleGrammarCheck}
                  disabled={grammarSelected === null}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide transition-all ${
                    grammarSelected !== null ? "bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white shadow-md" : "bg-[#E4D7BA] text-[#A79A7E] cursor-not-allowed"
                  }`}
                >
                  PRÜFEN
                </button>
              ) : (
                <button
                  onClick={handleGrammarContinue}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-md ${
                    grammarIsCorrect ? "bg-gradient-to-r from-[#2EC4B6] to-[#0E9E85] text-white" : "bg-gradient-to-r from-[#E8483A] to-[#B4291D] text-white"
                  }`}
                >
                  WEITER <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- GRAMMAR SUMMARY -------------------------------- */

  if (screen === "grammar-summary") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9] relative overflow-hidden">
        <FontImport />
        {grammarCorrectCount >= 6 && <Confetti pieceCount={60} gold />}
        <div className="w-full max-w-md min-h-screen flex flex-col items-center px-8 pt-16 pb-10 relative z-10">
          <div className="glossy w-24 h-24 mb-4 rounded-full flex items-center justify-center animate-pop-in" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
            <LayoutGrid size={34} color="white" />
          </div>
          <h1 className="font-display text-2xl text-[#2B241D] mb-1">
            {grammarMode === "declension" ? "GUT DEKLINIERT!" : "GUT KONJUGIERT!"}
          </h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">
            {grammarCorrectCount} von {grammarRound.length} Formen richtig.
          </p>

          <div className="w-full grid grid-cols-2 gap-3 mb-8">
            <SummaryStat label="XP" value={`+${grammarXpEarned}`} color="#F59E0B" />
            <SummaryStat label="Richtig" value={grammarCorrectCount} color="#0E9E85" />
          </div>

          <button
            onClick={() => setScreen("grammar-home")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-display text-sm tracking-wide mt-auto shadow-md"
          >
            WEITER
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- GAMES HOME -------------------------------- */

  if (screen === "games-home") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md min-h-screen pb-28 px-5 pt-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setScreen("vocab-home")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <h1 className="font-display text-lg text-[#2B241D]">MINI-SPIELE</h1>
          </div>

          <button
            onClick={startMemoryGame}
            disabled={availableVocab.length < 3}
            className="w-full glass rounded-2xl p-5 mb-4 text-left flex items-center gap-4 disabled:opacity-50"
          >
            <div className="glossy w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
              🧠
            </div>
            <div>
              <div className="font-display text-[14px] text-[#2B241D] mb-0.5">Memory</div>
              <div className="text-[12px] text-[#8A7F68]">
                {availableVocab.length < 3 ? "Lerne mehr Wörter, um zu spielen" : "Finde die passenden Latein-Deutsch-Paare"}
              </div>
            </div>
          </button>

          <button
            onClick={startBlitzGame}
            disabled={availableVocab.length < 4}
            className="w-full glass rounded-2xl p-5 text-left flex items-center gap-4 disabled:opacity-50"
          >
            <div className="glossy w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: "linear-gradient(135deg, #F59E0B, #EC4899)" }}>
              ⚡
            </div>
            <div>
              <div className="font-display text-[14px] text-[#2B241D] mb-0.5">Wortblitz</div>
              <div className="text-[12px] text-[#8A7F68]">
                {availableVocab.length < 4 ? "Lerne mehr Wörter, um zu spielen" : "30 Sekunden — so viele Wörter wie möglich!"}
              </div>
            </div>
          </button>
        </div>
        <BottomNav screen="vocab-home" setScreen={setScreen} />
      </div>
    );
  }

  /* -------------------------------- GAME: MEMORY -------------------------------- */

  if (screen === "game-memory") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9] relative overflow-hidden">
        <FontImport />
        <BackgroundBlobs />
        {memoryDone && <Confetti pieceCount={60} gold />}
        <div className="w-full max-w-md min-h-screen px-5 pt-4 pb-10 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setScreen("games-home")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <div className="flex-1 text-center font-display text-sm text-[#2B241D]">🧠 MEMORY</div>
            <div className="text-[12px] font-bold text-[#8A7F68] w-[40px] text-right">{memoryMoves}x</div>
          </div>

          {!memoryDone ? (
            <div className="grid grid-cols-3 gap-2.5">
              {memoryCards.map((card, i) => {
                const isFlipped = memoryFlipped.includes(i) || memoryMatched.has(card.wordId);
                const isMatched = memoryMatched.has(card.wordId);
                return (
                  <button
                    key={card.key}
                    onClick={() => handleMemoryCardTap(i)}
                    disabled={isMatched}
                    className={`aspect-square rounded-2xl flex items-center justify-center p-2 text-center transition-all ${
                      isMatched
                        ? "bg-gradient-to-br from-[#2EC4B6]/30 to-[#0E9E85]/20 border-2 border-[#2EC4B6]"
                        : isFlipped
                        ? "glass-strong"
                        : "bg-gradient-to-br from-[#8B5CF6] to-[#FF4FA3] glossy"
                    }`}
                  >
                    {isFlipped ? (
                      <span className={`text-[13px] leading-tight ${card.kind === "latin" ? "font-serif-latin italic" : "font-display"} text-[#2B241D]`}>
                        {card.text}
                      </span>
                    ) : (
                      <Sparkles size={20} color="white" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="glossy w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 animate-pop-in" style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
                🎉
              </div>
              <h1 className="font-display text-xl text-[#2B241D] mb-1">Geschafft!</h1>
              <p className="text-[13px] text-[#8A7F68] mb-6">{memoryMoves} Züge gebraucht</p>
              <div className="w-full grid grid-cols-1 gap-3 mb-8">
                <SummaryStat label="XP verdient" value={`+${memoryXpEarned}`} color="#F59E0B" />
              </div>
              <button
                onClick={startMemoryGame}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-display text-sm tracking-wide shadow-md mb-3"
              >
                NOCHMAL SPIELEN
              </button>
              <button onClick={() => setScreen("games-home")} className="text-[#8A7F68] text-[13px] underline">
                Zurück zu den Spielen
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------- GAME: WORTBLITZ -------------------------------- */

  if (screen === "game-blitz") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9] relative overflow-hidden">
        <FontImport />
        <BackgroundBlobs />
        {blitzDone && <Confetti pieceCount={60} gold />}
        <div className="w-full max-w-md min-h-screen px-5 pt-4 pb-10 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => { setBlitzActive(false); setScreen("games-home"); }} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <div className="flex-1 text-center font-display text-sm text-[#2B241D]">⚡ WORTBLITZ</div>
            <div className="text-[13px] font-bold text-[#EC4899] w-[40px] text-right">{blitzTimeLeft}s</div>
          </div>

          {!blitzDone ? (
            <>
              <div className="h-2 rounded-full bg-[#F0DFC0] overflow-hidden mb-6">
                <div className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EC4899] transition-all" style={{ width: `${(blitzTimeLeft / 30) * 100}%` }} />
              </div>
              <div className="text-center mb-6">
                <span className="font-display text-2xl text-[#2B241D]">{blitzScore}</span>
                <span className="text-[12px] text-[#8A7F68]"> Punkte</span>
              </div>
              {blitzQuestion && (
                <>
                  <div className="text-[11px] tracking-widest text-[#C2185B] font-bold mb-2 text-center">
                    {blitzQuestion.direction === "latin-de" ? "LATEIN → DEUTSCH" : "DEUTSCH → LATEIN"}
                  </div>
                  <div className={`text-2xl text-[#2B241D] mb-6 text-center ${blitzQuestion.direction === "latin-de" ? "font-serif-latin italic" : "font-display"}`}>
                    {blitzQuestion.prompt}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {blitzQuestion.options.map((opt, i) => {
                      let style = "glass text-[#2B241D]";
                      if (blitzChecked && i === blitzQuestion.correctIndex) style = "border-2 border-[#2EC4B6] bg-[#2EC4B6]/15 text-[#2B241D]";
                      else if (blitzChecked && i === blitzSelected) style = "border-2 border-[#E8483A] bg-[#E8483A]/10 text-[#2B241D]";
                      return (
                        <button
                          key={i}
                          onClick={() => handleBlitzAnswer(i)}
                          disabled={blitzChecked}
                          className={`text-left px-4 py-3.5 rounded-xl font-serif-latin text-[15px] transition-colors ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="glossy w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 animate-pop-in" style={{ background: "linear-gradient(135deg, #F59E0B, #EC4899)" }}>
                ⚡
              </div>
              <h1 className="font-display text-xl text-[#2B241D] mb-1">Zeit um!</h1>
              <p className="text-[13px] text-[#8A7F68] mb-6">{blitzScore} Wörter richtig</p>
              <div className="w-full grid grid-cols-1 gap-3 mb-8">
                <SummaryStat label="XP verdient" value={`+${blitzXpEarned}`} color="#F59E0B" />
              </div>
              <button
                onClick={startBlitzGame}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EC4899] text-white font-display text-sm tracking-wide shadow-md mb-3"
              >
                NOCHMAL SPIELEN
              </button>
              <button onClick={() => setScreen("games-home")} className="text-[#8A7F68] text-[13px] underline">
                Zurück zu den Spielen
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------- FEEDBACK -------------------------------- */

  if (screen === "feedback") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md min-h-screen px-5 pt-6 pb-10 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setScreen("profile")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <h1 className="font-display text-lg text-[#2B241D]">FEEDBACK</h1>
          </div>

          <p className="text-[13px] text-[#8A7F68] mb-5">Fehler gefunden? Idee für eine neue Lektion? Sag Bescheid!</p>

          <div className="flex gap-2 mb-4">
            {["Fehler", "Idee", "Sonstiges"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFeedbackCategory(cat)}
                className={`flex-1 py-2.5 rounded-xl text-[12px] font-display tracking-wide ${
                  feedbackCategory === cat ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white shadow-md" : "glass text-[#2B241D]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Was möchtest du uns mitteilen?"
            rows={6}
            className="w-full px-4 py-3.5 rounded-xl glass text-[#2B241D] text-[15px] mb-5 resize-none focus:outline-none"
          />

          <button
            onClick={sendFeedback}
            disabled={feedbackText.trim().length === 0}
            className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide shadow-md ${
              feedbackText.trim().length > 0 ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white" : "bg-[#E4D7BA] text-[#A79A7E] cursor-not-allowed"
            }`}
          >
            PER MAIL SENDEN
          </button>
          <p className="text-[11px] text-[#A79A7E] text-center mt-3">Öffnet deine Mail-App, Empfänger ist bereits eingetragen.</p>
        </div>
      </div>
    );
  }

  /* -------------------------------- LESSON SCREEN -------------------------------- */

  if (screen === "lesson" && ex) {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <FloatingXp item={floatXp} />
        <ComboToast text={comboToast} />
        <div className="w-full max-w-md bg-[#FFF6E9] min-h-screen flex flex-col">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <button onClick={() => setScreen("path")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <div className="flex-1 h-2.5 rounded-full bg-[#F0DFC0] overflow-hidden flex gap-0.5 p-0.5">
              {exercises.map((_, i) => (
                <div key={i} className={`flex-1 rounded-full transition-colors ${i < idx ? "bg-[#2EC4B6]" : i === idx ? "bg-[#FFB627]" : "bg-transparent"}`} />
              ))}
            </div>
            <div className={`flex items-center gap-1 text-[#E8483A] font-bold text-sm ${heartShake ? "animate-shake" : ""}`}>
              <Heart size={17} fill="#E8483A" color="#E8483A" />
              {hearts}
            </div>
          </div>

          <div className="flex-1 px-5 pt-6 pb-40">
            <div className="text-[11px] tracking-widest text-[#C2185B] font-bold mb-2">{currentLesson.title.toUpperCase()}</div>

            {ex.type === "mc" && (
              <div>
                <h2 className="font-display text-xl text-[#2B241D] mb-6 leading-snug">{ex.q}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {ex.options.map((opt, i) => {
                    const isSel = selected === i;
                    let style = "glass text-[#2B241D]";
                    if (checked && i === ex.correct) style = "border-[#2EC4B6] bg-[#2EC4B6]/15 text-[#2B241D] animate-pop-in";
                    else if (checked && isSel && i !== ex.correct) style = "border-[#E8483A] bg-[#E8483A]/10 text-[#2B241D]";
                    else if (isSel) style = "border-[#EC4899] bg-[#EC4899]/10 text-[#2B241D]";
                    return (
                      <button
                        key={i}
                        disabled={checked}
                        onClick={() => setSelected(i)}
                        className={`text-left px-4 py-3.5 rounded-xl border-2 font-serif-latin text-[15px] transition-colors ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {ex.type === "translate" && (
              <div>
                <h2 className="font-display text-base text-[#8A7F68] mb-2">{ex.prompt}</h2>
                <div className="font-serif-latin text-3xl text-[#2B241D] italic mb-8">{ex.latin}</div>
                <input
                  disabled={checked}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Deine Antwort auf Deutsch"
                  className="w-full px-4 py-3.5 rounded-xl glass text-[#2B241D] text-[15px] focus:outline-none focus:border-[#EC4899]"
                />
              </div>
            )}

            {ex.type === "order" && (
              <div>
                <h2 className="font-display text-base text-[#2B241D] mb-6 leading-snug">{ex.prompt}</h2>
                <div className="min-h-[64px] border-b-2 border-[#F0DFC0] flex flex-wrap gap-2 items-start pb-3 mb-6">
                  {answer.map((w, i) => (
                    <button
                      key={w + i}
                      onClick={() => toggleOrderWord(w, "answer")}
                      className="px-3.5 py-2 rounded-lg bg-gradient-to-br from-[#FF4FA3] to-[#8B5CF6] text-white font-serif-latin text-[15px] animate-pop-in shadow-sm"
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {bank.map((w, i) => (
                    <button
                      key={w + i}
                      onClick={() => toggleOrderWord(w, "bank")}
                      className="px-3.5 py-2 rounded-lg glass text-[#2B241D] font-serif-latin text-[15px]"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ex.type === "reading" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={18} color="#8B5CF6" />
                  <h2 className="font-display text-base text-[#2B241D]">{ex.title}</h2>
                </div>
                <div className="glass rounded-2xl p-5 shadow-sm">
                  <p className="font-serif-latin text-[17px] text-[#2B241D] leading-relaxed italic">{ex.latin}</p>
                </div>
                <p className="text-[12px] text-[#8A7F68] mt-4">📖 Lies den Text genau — die nächsten Fragen drehen sich darum!</p>
              </div>
            )}
          </div>

          <div
            className={`fixed bottom-0 left-0 right-0 flex justify-center border-t-2 transition-colors ${
              checked && ex.type !== "reading" ? (isCorrect ? "bg-[#DFF5E9] border-[#2EC4B6]" : "bg-[#FBE2DC] border-[#E8483A]") : "bg-[#FFFBF2] border-[#F0DFC0]"
            }`}
          >
            <div className="w-full max-w-md px-5 py-4">
              {checked && ex.type !== "reading" && (
                <div className="flex items-center gap-2 mb-3">
                  <div className={isCorrect ? "animate-pop-in" : ""}>
                    {isCorrect ? <Check size={22} color="#0E7A5F" strokeWidth={3} /> : <X size={20} color="#B4291D" />}
                  </div>
                  <div>
                    <div className={`font-display text-sm ${isCorrect ? "text-[#0E7A5F]" : "text-[#B4291D]"}`}>
                      {isCorrect ? "OPTIME! · Richtig!" : "NON RECTE · Nicht ganz."}
                    </div>
                    {!isCorrect && (
                      <div className="text-[13px] text-[#6B5F4E] mt-0.5">
                        Richtige Antwort:{" "}
                        <span className="font-semibold text-[#2B241D]">
                          {ex.type === "mc" && ex.options[ex.correct]}
                          {ex.type === "translate" && ex.accept[0]}
                          {ex.type === "order" && ex.correct.join(" ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {ex.type === "reading" ? (
                <button
                  onClick={continueReading}
                  className="w-full py-3.5 rounded-xl font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-md bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white"
                >
                  WEITER <ArrowRight size={16} />
                </button>
              ) : !checked ? (
                <button
                  onClick={handleCheck}
                  disabled={!canCheck()}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide transition-all ${
                    canCheck() ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white shadow-md" : "bg-[#E4D7BA] text-[#A79A7E] cursor-not-allowed"
                  }`}
                >
                  PRÜFEN
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-md ${
                    isCorrect ? "bg-gradient-to-r from-[#2EC4B6] to-[#0E9E85] text-white" : "bg-gradient-to-r from-[#E8483A] to-[#B4291D] text-white"
                  }`}
                >
                  WEITER <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- FAILED SCREEN -------------------------------- */

  if (screen === "failed") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md min-h-screen flex flex-col items-center justify-center px-8 text-center">
          <Heart size={56} color="#E8483A" className="mb-5 animate-shake" />
          <h1 className="font-display text-2xl text-[#2B241D] mb-2">KEINE LEBEN MEHR</h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">
            Deine Herzen sind aufgebraucht. Versuch die Lektion „{currentLesson.title}“ noch einmal.
          </p>
          <button
            onClick={retryLesson}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white font-display text-sm tracking-wide flex items-center justify-center gap-2 mb-3 shadow-md"
          >
            <RotateCcw size={16} /> NOCHMAL VERSUCHEN
          </button>
          <button onClick={() => setScreen("path")} className="text-[#8A7F68] text-[13px] underline">
            Zurück zum Pfad
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- SUMMARY SCREEN -------------------------------- */

  if (screen === "summary") {
    const accuracy = Math.round((exercises.length / (exercises.length + mistakes)) * 100);
    const perfect = mistakes === 0;
    const streakMilestone = newStreakValue > 0 && newStreakValue % 5 === 0;

    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9] relative overflow-hidden">
        <FontImport />
        <BackgroundBlobs />
        <Confetti pieceCount={perfect ? 90 : 55} gold={perfect} />
        <div className="w-full max-w-md min-h-screen flex flex-col items-center px-8 pt-16 pb-10 relative z-10">
          <div className="relative w-24 h-24 mb-4 flex items-center justify-center animate-pop-in">
            <Laurel size={112} color="#F59E0B" />
            <Trophy size={34} color="#FFB627" fill="#FFE08C" />
          </div>
          <h1
            className="font-display text-3xl mb-1 bg-clip-text text-transparent"
            style={{ backgroundImage: perfect ? "linear-gradient(90deg, #FF4FA3, #F59E0B, #2EC4B6, #8B5CF6)" : "linear-gradient(90deg, #FF4FA3, #F59E0B)" }}
          >
            {perfect ? "OPTIME!" : "BENE FACTUM!"}
          </h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">{perfect ? "Perfekt, ganz ohne Fehler! 🎉" : "Gut gemacht — Lektion abgeschlossen."}</p>

          <div className="w-full grid grid-cols-3 gap-3 mb-6">
            <SummaryStat label="XP" value={`+${animatedXp}`} color="#F59E0B" />
            <SummaryStat label="Genauigkeit" value={`${accuracy}%`} color="#0E9E85" />
            <SummaryStat label="Serie" value={streak} color="#FF7A1A" />
          </div>

          {streakMilestone && (
            <div className="w-full mb-6 rounded-xl px-4 py-3 flex items-center gap-3 shadow-md animate-pop-in" style={{ background: "linear-gradient(135deg, #FF7A1A, #E8483A)" }}>
              <PartyPopper size={22} color="white" />
              <div className="text-white">
                <div className="font-display text-sm">{newStreakValue} TAGE SERIE!</div>
                <div className="text-[12px] opacity-90">Du bist on fire — weiter so!</div>
              </div>
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="w-full mb-8">
              <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-3">NEUE AUSZEICHNUNG</div>
              {newBadges.map((id, i) => {
                const b = BADGES.find((x) => x.id === id);
                const Icon = b.icon;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-3 glass border-[#FFD166]/50 rounded-xl px-4 py-3 mb-2 shadow-sm animate-pop-in"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    <div className="glossy w-10 h-10 rounded-full bg-gradient-to-br from-[#FFE08C] to-[#FFB627] flex items-center justify-center shrink-0">
                      <Icon size={18} color="#7A2E00" />
                    </div>
                    <div>
                      <div className="font-display text-[13px] text-[#2B241D]">{b.title}</div>
                      <div className="text-[12px] text-[#6B5F4E]">{b.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setScreen("path")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white font-display text-sm tracking-wide mt-auto shadow-md"
          >
            WEITER
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- LEADERBOARD SCREEN -------------------------------- */

  if (screen === "leaderboard") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md min-h-screen pb-28">
          <div className="sticky top-0 z-20 glass-strong border-b-0 px-5 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-display text-lg text-[#2B241D]">RANGLISTE</h1>
              <div className="text-[11px] text-[#8A7F68]">Klasse „{active?.classCodeDisplay}“</div>
            </div>
            <button onClick={loadLeaderboard} className="w-9 h-9 rounded-full glass flex items-center justify-center">
              <RefreshCw size={16} color="#8A7F68" className={leaderboardLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="px-5 pt-5">
            {!cloudEnabled && (
              <div className="glass rounded-2xl p-5 text-center">
                <Trophy size={28} color="#DCCFA9" className="mx-auto mb-2" />
                <div className="font-display text-sm text-[#2B241D] mb-1">Rangliste noch nicht eingerichtet</div>
                <div className="text-[13px] text-[#8A7F68]">Frag deine Lehrkraft, ob die Cloud-Anbindung schon aktiv ist.</div>
              </div>
            )}

            {cloudEnabled && !leaderboardLoading && leaderboardRows.length === 0 && (
              <div className="glass rounded-2xl p-5 text-center text-[13px] text-[#8A7F68]">
                Noch keine Mitspieler in dieser Klasse gefunden.
              </div>
            )}

            {cloudEnabled && (
              <div className="flex flex-col gap-2.5">
                {leaderboardRows.map((row, i) => {
                  const isMe = row.id === active?.id;
                  const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                  return (
                    <div
                      key={row.id}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 shadow-sm ${
                        isMe ? "bg-gradient-to-r from-[#FFE08C]/40 to-[#FFB627]/20 border-[#FFB627]" : "glass"
                      }`}
                    >
                      <div className="w-7 text-center font-display text-sm text-[#8A7F68]">{medal || `#${i + 1}`}</div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#FFF6E9] border-2 border-[#F0DFC0] shrink-0">
                        {row.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-[13px] text-[#2B241D] truncate">
                          {row.alias} {isMe && <span className="text-[10px] text-[#C2185B]">(Du)</span>}
                        </div>
                        <div className="text-[11px] text-[#8A7F68] flex items-center gap-1">
                          <Flame size={11} color="#FF7A1A" fill="#FF7A1A" /> {row.streak}
                        </div>
                      </div>
                      <div className="font-display text-sm text-[#F59E0B]">{row.xp} XP</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    );
  }

  /* -------------------------------- PROFILE SCREEN -------------------------------- */

  if (screen === "profile" && active) {
    return (
      <ProfileScreen
        active={active}
        profiles={profiles}
        xp={xp}
        streak={streak}
        unlockedBadges={unlockedBadges}
        rank={rank}
        onSwitch={switchProfile}
        onAddProfile={() => {
          setAddingProfile(true);
          setScreen("onboarding");
        }}
        onSave={updateActiveAliasAvatar}
        setScreen={setScreen}
        screen={screen}
        syncCodeInput={syncCodeInput}
        setSyncCodeInput={setSyncCodeInput}
        syncStatus={syncStatus}
        syncCopyLabel={syncCopyLabel}
        onCopySyncCode={copySyncCode}
        onLoadSyncCode={loadProfileFromSyncCode}
      />
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* ONBOARDING */
/* ------------------------------------------------------------------ */

function OnboardingScreen({ onCreate, onCancel }) {
  const [classCodeInput, setClassCodeInput] = useState("");
  const [alias, setAlias] = useState(() => generateAlias());
  const [avatar, setAvatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);

  const canSubmit = classCodeInput.trim().length > 0 && alias.trim().length > 0;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
      <FontImport />
      <BackgroundBlobs />
      <div className="w-full max-w-md min-h-screen px-6 pt-14 pb-10 flex flex-col">
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <div className="glossy absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, #FF4FA3, #8B5CF6)" }} />
          <Landmark size={30} color="white" className="relative" />
        </div>
        <h1 className="font-display text-2xl text-center text-[#2B241D] mb-1">
          {onCancel ? "Neues Profil" : "Willkommen, Legionär!"}
        </h1>
        <p className="text-center text-[13px] text-[#8A7F68] mb-8">
          Tritt deiner Klasse bei und leg direkt los — ganz ohne echten Namen.
        </p>

        <label className="text-[12px] font-bold text-[#6B5F4E] mb-1.5">KLASSENCODE</label>
        <input
          value={classCodeInput}
          onChange={(e) => setClassCodeInput(e.target.value)}
          placeholder="z. B. 7A-Latein"
          className="w-full px-4 py-3.5 rounded-xl glass text-[#2B241D] text-[15px] mb-1 focus:outline-none focus:border-[#EC4899]"
        />
        <p className="text-[11px] text-[#A79A7E] mb-5">Von deiner Lehrkraft — alle mit demselben Code sehen sich in der Rangliste.</p>

        <label className="text-[12px] font-bold text-[#6B5F4E] mb-1.5">DEIN SPITZNAME</label>
        <div className="flex gap-2 mb-1">
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Spitzname"
            className="flex-1 px-4 py-3.5 rounded-xl glass text-[#2B241D] text-[15px] focus:outline-none focus:border-[#EC4899]"
          />
          <button
            onClick={() => setAlias(generateAlias())}
            className="w-14 rounded-xl glass flex items-center justify-center"
            title="Zufallsname"
          >
            <Dices size={20} color="#8A7F68" />
          </button>
        </div>
        <p className="text-[11px] text-[#A79A7E] mb-5">⚠️ Bitte keinen echten Namen verwenden — nur deine Klasse sieht diesen Spitznamen.</p>

        <label className="text-[12px] font-bold text-[#6B5F4E] mb-2">AVATAR</label>
        <div className="grid grid-cols-6 gap-2 mb-8">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`aspect-square rounded-xl border-2 flex items-center justify-center text-xl ${
                avatar === a ? "border-[#EC4899] bg-[#EC4899]/10 scale-105" : "border-white/60 glass"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <button
          onClick={() => canSubmit && onCreate({ classCodeInput, alias, avatar })}
          disabled={!canSubmit}
          className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide mt-auto shadow-md ${
            canSubmit ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white" : "bg-[#E4D7BA] text-[#A79A7E] cursor-not-allowed"
          }`}
        >
          LOS GEHT'S!
        </button>
        {onCancel && (
          <button onClick={onCancel} className="text-[#8A7F68] text-[13px] underline mt-4">
            Abbrechen
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PROFILE SCREEN */
/* ------------------------------------------------------------------ */

function ProfileScreen({
  active,
  profiles,
  xp,
  streak,
  unlockedBadges,
  rank,
  onSwitch,
  onAddProfile,
  onSave,
  setScreen,
  screen,
  syncCodeInput,
  setSyncCodeInput,
  syncStatus,
  syncCopyLabel,
  onCopySyncCode,
  onLoadSyncCode,
}) {
  const [editing, setEditing] = useState(false);
  const [alias, setAlias] = useState(active.alias);
  const [avatar, setAvatar] = useState(active.avatar);

  const others = profiles.filter((p) => p.id !== active.id);
  const changed = alias !== active.alias || avatar !== active.avatar;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
      <FontImport />
      <BackgroundBlobs />
      <div className="w-full max-w-md min-h-screen pb-28 px-5 pt-6">
        <h1 className="font-display text-lg text-[#2B241D] mb-5">PROFIL</h1>

        <div className="glass rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="glossy w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 border-2 border-[#FFB627]"
              style={{ background: "linear-gradient(135deg, #FFE08C, #FFB627)" }}
            >
              {avatar}
            </div>
            <div className="min-w-0">
              <div className="font-display text-lg text-[#2B241D] truncate">{alias}</div>
              <div className="text-[12px] text-[#8A7F68]">Klasse „{active.classCodeDisplay}“</div>
              <div className="text-[11px] font-bold text-[#C2185B] mt-0.5">
                {rank.current.title.toUpperCase()} · {rank.current.sub}
              </div>
            </div>
            <button onClick={() => setEditing((e) => !e)} className="ml-auto w-9 h-9 rounded-full bg-[#FFF6E9] border-2 border-[#F0DFC0] flex items-center justify-center shrink-0">
              <Pencil size={15} color="#8A7F68" />
            </button>
          </div>

          {editing && (
            <div className="border-t border-[#F0DFC0] pt-4 mt-1">
              <input
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border-2 border-[#F0DFC0] bg-[#FFF6E9] text-[14px] mb-3"
              />
              <div className="grid grid-cols-6 gap-1.5 mb-3">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-lg ${
                      avatar === a ? "border-[#EC4899] bg-[#EC4899]/10" : "border-white/60 glass"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (changed) onSave(alias, avatar);
                  setEditing(false);
                }}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white font-display text-xs tracking-wide"
              >
                SPEICHERN
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            <SummaryStat label="XP" value={xp} color="#F59E0B" />
            <SummaryStat label="Serie" value={streak} color="#FF7A1A" />
            <SummaryStat label="Abzeichen" value={unlockedBadges.size} color="#0E9E85" />
          </div>
        </div>

        <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">AUSZEICHNUNGEN</div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {BADGES.map((b) => {
            const on = unlockedBadges.has(b.id);
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                title={b.desc}
                className={`shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center ${
                  on ? "bg-gradient-to-br from-[#FFE08C] to-[#FFB627] border-[#F59E0B]" : "bg-[#EFE6D4] border-[#E4D7BA] grayscale opacity-60"
                }`}
              >
                <Icon size={20} color={on ? "#7A2E00" : "#8A7F68"} />
              </div>
            );
          })}
        </div>

        {others.length > 0 && (
          <>
            <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">ANDERE PROFILE AUF DIESEM GERÄT</div>
            <div className="flex flex-col gap-2 mb-4">
              {others.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSwitch(p.id)}
                  className="flex items-center gap-3 glass rounded-xl px-4 py-3 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FFF6E9] border-2 border-[#F0DFC0] flex items-center justify-center text-lg shrink-0">
                    {p.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-[13px] text-[#2B241D] truncate">{p.alias}</div>
                    <div className="text-[11px] text-[#8A7F68]">Klasse „{p.classCodeDisplay}“ · {p.xp} XP</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onAddProfile}
          className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#EC4899]/40 text-[#C2185B] font-display text-xs tracking-wide flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={16} /> NEUES PROFIL ANLEGEN
        </button>

        <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">GERÄTE-SYNC</div>
        <div className="glass rounded-2xl p-5 mb-4">
          <p className="text-[12px] text-[#8A7F68] mb-3">
            Dein Code — gib ihn auf einem anderen Gerät ein, um dieses Profil dort zu laden:
          </p>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 glass-strong rounded-xl py-3 text-center font-display text-lg tracking-[0.2em] text-[#2B241D]">
              {active.syncCode || "…"}
            </div>
            <button
              onClick={onCopySyncCode}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2EC4B6] text-white font-display text-[11px] tracking-wide shrink-0"
            >
              {syncCopyLabel}
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6">
          <p className="text-[12px] text-[#8A7F68] mb-3">Code von einem anderen Gerät eingeben:</p>
          <div className="flex items-center gap-2">
            <input
              value={syncCodeInput}
              onChange={(e) => setSyncCodeInput(e.target.value.toUpperCase())}
              placeholder="Z. B. K7XQ2P"
              maxLength={6}
              className="flex-1 px-3.5 py-3 rounded-xl glass text-[#2B241D] text-[15px] tracking-[0.15em] text-center focus:outline-none"
            />
            <button
              onClick={onLoadSyncCode}
              disabled={syncCodeInput.trim().length === 0}
              className={`px-4 py-3 rounded-xl font-display text-[11px] tracking-wide shrink-0 ${
                syncCodeInput.trim().length > 0 ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white" : "bg-[#E4D7BA] text-[#A79A7E]"
              }`}
            >
              LADEN
            </button>
          </div>
          {syncStatus && (
            <p className={`text-[12px] mt-2.5 ${syncStatus.ok === true ? "text-[#0E9E85]" : syncStatus.ok === false ? "text-[#B4291D]" : "text-[#8A7F68]"}`}>
              {syncStatus.msg}
            </p>
          )}
        </div>

        <button
          onClick={() => setScreen("feedback")}
          className="w-full py-3.5 rounded-xl glass text-[#2B241D] font-display text-xs tracking-wide flex items-center justify-center gap-2"
        >
          ✉️ FEEDBACK SENDEN
        </button>
      </div>
      <BottomNav screen={screen} setScreen={setScreen} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UI SUBCOMPONENTS */
/* ------------------------------------------------------------------ */

function StatPill({ icon, value }) {
  return (
    <div className="flex items-center gap-1 glass rounded-full px-2.5 py-1">
      {icon}
      <span className="text-[13px] font-bold text-[#2B241D] font-mono">{value}</span>
    </div>
  );
}

function SummaryStat({ label, value, color }) {
  return (
    <div className="glass rounded-xl py-3 text-center shadow-sm">
      <div className="font-display text-lg" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-[#8A7F68] tracking-wide mt-0.5">{label}</div>
    </div>
  );
}

function DailySentenceCard({ revealed, onToggle }) {
  const sentence = useMemo(() => getDailySentence(), []);
  return (
    <button onClick={onToggle} className="w-full glass rounded-2xl px-5 py-4 mb-4 text-left">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={15} color="#F59E0B" />
        <div className="text-[11px] tracking-widest text-[#C2185B] font-bold">SATZ DES TAGES</div>
      </div>
      <div className="font-serif-latin italic text-[18px] text-[#2B241D] mb-1">{sentence.latin}</div>
      {revealed ? (
        <div className="text-[13px] text-[#8A7F68]">{sentence.german}</div>
      ) : (
        <div className="text-[12px] text-[#A79A7E]">🔄 Zum Übersetzen tippen</div>
      )}
    </button>
  );
}

function UnitBanner({ unit, completed, gradient }) {
  const done = unit.lessons.filter((l) => completed.has(l.id)).length;
  return (
    <div className="rounded-2xl px-5 py-4 my-4 shadow-md" style={{ background: gradient }}>
      <div className="text-[10px] tracking-widest text-white/80 font-bold mb-1">
        {done}/{unit.lessons.length} LEKTIONEN
      </div>
      <div className="font-display text-lg text-white tracking-wide">{unit.latin}</div>
      <div className="text-[12px] text-white/85">{unit.german}</div>
    </div>
  );
}

function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,500&family=Inter:wght@400;500;600;700&display=swap');
      .font-display { font-family: 'Cinzel', serif; }
      .font-serif-latin { font-family: 'Source Serif 4', serif; }
      body, button, input { font-family: 'Inter', sans-serif; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      @keyframes popIn {
        0% { transform: scale(0.4); opacity: 0; }
        60% { transform: scale(1.12); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-pop-in { animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

      @keyframes bounceSlow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .animate-bounce-slow { animation: bounceSlow 1.6s ease-in-out infinite; }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-4px); }
        40% { transform: translateX(4px); }
        60% { transform: translateX(-3px); }
        80% { transform: translateX(3px); }
      }
      .animate-shake { animation: shake 0.4s ease-in-out; }

      @keyframes floatXpPop {
        0% { transform: translateY(0) scale(0.6); opacity: 0; }
        20% { transform: translateY(-6px) scale(1.15); opacity: 1; }
        100% { transform: translateY(-40px) scale(1); opacity: 0; }
      }
      .float-xp-pop { animation: floatXpPop 0.85s ease-out both; }

      @keyframes comboPop {
        0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
        25% { transform: translateX(-50%) scale(1.1); opacity: 1; }
        85% { transform: translateX(-50%) scale(1); opacity: 1; }
        100% { transform: translateX(-50%) scale(0.9); opacity: 0; }
      }
      .combo-pop { animation: comboPop 1.3s ease-out both; }

      @keyframes confettiFall {
        0% { transform: translateY(-40px) translateX(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(720px) translateX(var(--drift)) rotate(540deg); opacity: 0; }
      }
      .confetti-piece {
        position: absolute;
        top: 0;
        border-radius: 2px;
        animation-name: confettiFall;
        animation-timing-function: ease-in;
        animation-fill-mode: forwards;
      }

      /* ---- Liquid Glass (iOS-Stil) ---- */
      html, body {
        overscroll-behavior: none;
        touch-action: pan-y;
        -webkit-user-select: none;
        user-select: none;
      }
      input, textarea {
        -webkit-user-select: text;
        user-select: text;
      }

      .glass {
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.5) !important;
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.65);
        box-shadow: 0 8px 28px rgba(80, 40, 90, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.75) !important;
      }
      .glass::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 45%);
        pointer-events: none;
      }

      .glass-strong {
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.7) !important;
        backdrop-filter: blur(26px) saturate(180%);
        -webkit-backdrop-filter: blur(26px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.75);
        box-shadow: 0 8px 28px rgba(80, 40, 90, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.85) !important;
      }
      .glass-strong::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 45%);
        pointer-events: none;
      }

      .glossy {
        position: relative;
        overflow: hidden;
      }
      .glossy::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 55%);
        pointer-events: none;
      }
    `}</style>
  );
}
