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
  {
    id: "u13",
    latin: "PASSIVUM",
    german: "Passiv Präsens",
    lessons: [
      {
        id: "u13-l1",
        title: "Passiv erkennen",
        exercises: [
          { type: "mc", q: "„Amatur“ bedeutet …", options: ["wird geliebt", "liebt", "hat geliebt", "wird lieben"], correct: 0 },
          { type: "mc", q: "„Vocatur“ bedeutet …", options: ["ruft", "wird gerufen", "hat gerufen", "wird rufen"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "servatur", accept: ["wird beschützt"] },
          { type: "mc", q: "„A“ / „ab“ bedeutet im Passiv-Satz …", options: ["von", "mit", "ohne", "aus"], correct: 0 },
        ],
      },
      {
        id: "u13-l2",
        title: "Aktiv vs. Passiv",
        exercises: [
          { type: "mc", q: "„Servus dominum vocat.“ (Aktiv) — die passive Form ist:", options: ["Dominus a servo vocatur.", "Servus vocatur.", "Dominus servum vocat.", "Dominus vocat."], correct: 0 },
          { type: "mc", q: "„Rosa a puella amatur.“ bedeutet …", options: ["Die Rose wird von dem Mädchen geliebt.", "Das Mädchen wird von der Rose geliebt.", "Die Rose liebt das Mädchen.", "Das Mädchen liebt die Rose."], correct: 0 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Tempel wird vom Volk geliebt.“", words: ["Templum", "a", "populo", "amatur"], correct: ["Templum", "a", "populo", "amatur"] },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "portatur", accept: ["wird getragen"] },
        ],
      },
      {
        id: "u13-l3",
        title: "Sätze im Passiv",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Herr wird vom Sklaven gerufen.“", words: ["Dominus", "a", "servo", "vocatur"], correct: ["Dominus", "a", "servo", "vocatur"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Buch wird vom Jungen getragen.“", words: ["Liber", "a", "puero", "portatur"], correct: ["Liber", "a", "puero", "portatur"] },
          { type: "mc", q: "„Fabula a servo narratur.“ bedeutet …", options: ["Die Geschichte wird vom Sklaven erzählt.", "Der Sklave erzählt eine Geschichte.", "Die Geschichte erzählt vom Sklaven.", "Der Sklave wird von der Geschichte erzählt."], correct: 0 },
          { type: "mc", q: "„Aqua a filia portatur.“ bedeutet …", options: ["Das Wasser wird von der Tochter getragen.", "Die Tochter trägt Wasser.", "Das Wasser trägt die Tochter.", "Die Tochter wird getragen."], correct: 0 },
        ],
      },
    ],
  },
  {
    id: "u14",
    latin: "PARTICIPIA",
    german: "Partizip Perfekt Passiv",
    lessons: [
      {
        id: "u14-l1",
        title: "PPP erkennen",
        exercises: [
          { type: "mc", q: "„Amatus“ bedeutet …", options: ["geliebt", "liebend", "liebt", "wird lieben"], correct: 0 },
          { type: "mc", q: "„Vocata“ bedeutet …", options: ["rufend", "gerufen (fem.)", "ruft", "wird gerufen"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "servatum", accept: ["beschützt"] },
          { type: "mc", q: "Welches Partizip passt zu „puella“ (fem.)?", options: ["amatus", "amata", "amatum", "amati"], correct: 1 },
        ],
      },
      {
        id: "u14-l2",
        title: "PPP in Sätzen",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "laetus", accept: ["fröhlich"] },
          { type: "mc", q: "„Puella amata laeta est.“ bedeutet …", options: ["Das geliebte Mädchen ist fröhlich.", "Das Mädchen liebt fröhlich.", "Das fröhliche Mädchen wird geliebt.", "Die Liebe macht fröhlich."], correct: 0 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der gerufene Junge ist fröhlich.“", words: ["Puer", "vocatus", "laetus", "est"], correct: ["Puer", "vocatus", "laetus", "est"] },
          { type: "mc", q: "„Templum servatum magnum est.“ bedeutet …", options: ["Der bewahrte Tempel ist groß.", "Der Tempel bewahrt Größe.", "Der große Tempel wird bewahrt.", "Der Tempel ist bewahrt worden."], correct: 0 },
        ],
      },
      {
        id: "u14-l3",
        title: "Abschluss PPP",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "pulchra", accept: ["schön"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Die geliebte Rose ist schön.“", words: ["Rosa", "amata", "pulchra", "est"], correct: ["Rosa", "amata", "pulchra", "est"] },
          { type: "mc", q: "„Liber portatus magnus est.“ bedeutet …", options: ["Das getragene Buch ist groß.", "Das Buch trägt Größe.", "Das große Buch wird getragen.", "Der Junge trägt ein großes Buch."], correct: 0 },
          { type: "mc", q: "Was ist der Unterschied zwischen „amavit“ und „amatus“?", options: ["amavit = hat geliebt (Verb), amatus = geliebt (Partizip/Adjektiv)", "kein Unterschied", "amatus ist Zukunft", "amavit ist ein Nomen"], correct: 0 },
        ],
      },
    ],
  },
  {
    id: "u15",
    latin: "ACI",
    german: "Accusativus cum Infinitivo",
    lessons: [
      {
        id: "u15-l1",
        title: "AcI verstehen",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "videre", accept: ["sehen"] },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "dicere", accept: ["sagen"] },
          { type: "mc", q: "Im Satz „Video puellam cantare“ steht „puellam“ im …", options: ["Nominativ", "Akkusativ", "Genitiv", "Dativ"], correct: 1 },
          { type: "mc", q: "Ein AcI besteht aus …", options: ["Nominativ + Verb", "Akkusativ + Infinitiv", "Genitiv + Adjektiv", "Dativ + Partizip"], correct: 1 },
        ],
      },
      {
        id: "u15-l2",
        title: "AcI bilden",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "video", accept: ["ich sehe"] },
          { type: "mc", q: "Wähle die richtige Form: „Video puellam rosam ___.“ (Ich sehe, dass das Mädchen die Rose liebt.)", options: ["amat", "amare", "amavit", "amabit"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Ich sehe, dass der Sklave den Herrn ruft.“", words: ["Video", "servum", "dominum", "vocare"], correct: ["Video", "servum", "dominum", "vocare"] },
          { type: "mc", q: "„Dico puellam laetam esse.“ bedeutet …", options: ["Ich sage, dass das Mädchen fröhlich ist.", "Ich sage der fröhlichen Tochter.", "Das Mädchen sagt, es sei fröhlich.", "Ich sehe das fröhliche Mädchen."], correct: 0 },
        ],
      },
      {
        id: "u15-l3",
        title: "AcI Sätze",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "dico", accept: ["ich sage"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Ich sage, dass der Sklave arbeitet.“", words: ["Dico", "servum", "laborare"], correct: ["Dico", "servum", "laborare"] },
          { type: "mc", q: "„Video puellam rosam amare.“ bedeutet …", options: ["Ich sehe, dass das Mädchen die Rose liebt.", "Ich sehe das Mädchen und die Rose.", "Das Mädchen sieht die Rose.", "Ich liebe das Mädchen und die Rose."], correct: 0 },
          { type: "mc", q: "„Video servos templum spectare.“ bedeutet …", options: ["Ich sehe, dass die Sklaven den Tempel betrachten.", "Ich sehe den Tempel und die Sklaven.", "Die Sklaven sehen den Tempel.", "Ich betrachte die Sklaven im Tempel."], correct: 0 },
        ],
      },
    ],
  },
  {
    id: "u16",
    latin: "QUI QUAE QUOD",
    german: "Relativsätze",
    lessons: [
      {
        id: "u16-l1",
        title: "Relativpronomen",
        exercises: [
          { type: "mc", q: "„Qui“ bedeutet …", options: ["der/welcher (mask.)", "die/welche (fem.)", "das/welches (neutr.)", "wer?"], correct: 0 },
          { type: "mc", q: "„Quae“ bedeutet …", options: ["der/welcher (mask.)", "die/welche (fem.)", "das/welches (neutr.)", "was?"], correct: 1 },
          { type: "mc", q: "„Quod“ bedeutet …", options: ["der/welcher (mask.)", "die/welche (fem.)", "das/welches (neutr.)", "wie?"], correct: 2 },
          { type: "mc", q: "Das Relativpronomen richtet sich nach …", options: ["Genus und Numerus des Bezugsworts", "der Zeitform des Satzes", "dem Ort der Handlung", "der Person des Sprechers"], correct: 0 },
        ],
      },
      {
        id: "u16-l2",
        title: "Relativsätze bilden",
        exercises: [
          { type: "mc", q: "Wähle das passende Pronomen: „Puella, ___ rosam amat, laeta est.“ (Das Mädchen, das die Rose liebt, ist fröhlich.)", options: ["qui", "quae", "quod", "quas"], correct: 1 },
          { type: "mc", q: "Wähle das passende Pronomen: „Templum, ___ magnum est, …“ (Der Tempel, der groß ist, …)", options: ["qui", "quae", "quod", "quos"], correct: 2 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Sklave, der arbeitet, ist gut.“", words: ["Servus", "qui", "laborat", "bonus", "est"], correct: ["Servus", "qui", "laborat", "bonus", "est"] },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "quod", accept: ["das", "welches", "das/welches"] },
        ],
      },
      {
        id: "u16-l3",
        title: "Abschluss",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Herr, der den Sklaven ruft, ist groß.“", words: ["Dominus", "qui", "servum", "vocat", "magnus", "est"], correct: ["Dominus", "qui", "servum", "vocat", "magnus", "est"] },
          { type: "mc", q: "„Rex, qui urbem amat, bonus est.“ bedeutet …", options: ["Der König, der die Stadt liebt, ist gut.", "Der König liebt die gute Stadt.", "Die Stadt, die der König liebt, ist gut.", "Der gute König liebt die Stadt."], correct: 0 },
          { type: "mc", q: "Welches Pronomen passt zu „dominus“ (mask.)?", options: ["qui", "quae", "quod", "quam"], correct: 0 },
          { type: "mc", q: "Welches Pronomen passt zu „familia“ (fem.)?", options: ["qui", "quae", "quod", "quo"], correct: 1 },
        ],
      },
    ],
  },
  {
    id: "u17",
    latin: "DEPONENTIA",
    german: "Deponentien",
    lessons: [
      {
        id: "u17-l1",
        title: "Deponentien erkennen",
        exercises: [
          { type: "mc", q: "„Hortatur“ bedeutet …", options: ["er/sie ermahnt", "er/sie wird ermahnt", "er/sie ist ermahnt worden", "er/sie ermahnte"], correct: 0 },
          { type: "mc", q: "„Sequitur“ bedeutet …", options: ["er/sie folgt", "er/sie wird gefolgt", "er/sie ist gefolgt", "er/sie folgte"], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "loquitur", accept: ["er spricht", "sie spricht", "spricht"] },
          { type: "mc", q: "Was ist ein Deponens?", options: ["Ein Verb mit passiver Form, aber aktiver Bedeutung.", "Ein Verb nur in der Vergangenheit.", "Ein Verb ohne Endung.", "Ein unregelmäßiges Nomen."], correct: 0 },
        ],
      },
      {
        id: "u17-l2",
        title: "Deponentien in Sätzen",
        exercises: [
          { type: "mc", q: "Wähle die richtige Form: „Servus dominum ___.“ (Der Sklave folgt dem Herrn.)", options: ["sequit", "sequitur", "sequuntur", "secutus"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Sklave folgt dem Herrn.“", words: ["Servus", "dominum", "sequitur"], correct: ["Servus", "dominum", "sequitur"] },
          { type: "mc", q: "„Puella cum amica loquitur.“ bedeutet …", options: ["Das Mädchen spricht mit der Freundin.", "Das Mädchen folgt der Freundin.", "Die Freundin spricht mit dem Mädchen.", "Das Mädchen ermahnt die Freundin."], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "conatur", accept: ["er versucht", "sie versucht", "versucht"] },
        ],
      },
      {
        id: "u17-l3",
        title: "Abschluss",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der König ermahnt das Volk.“", words: ["Rex", "populum", "hortatur"], correct: ["Rex", "populum", "hortatur"] },
          { type: "mc", q: "„Servi dominum sequuntur.“ bedeutet …", options: ["Die Sklaven folgen dem Herrn.", "Der Sklave folgt den Herren.", "Die Sklaven ermahnen den Herrn.", "Der Herr folgt den Sklaven."], correct: 0 },
          { type: "mc", q: "„Puer conatur.“ bedeutet …", options: ["Der Junge versucht es.", "Der Junge folgt.", "Der Junge spricht.", "Der Junge wird versucht."], correct: 0 },
          { type: "mc", q: "Deponentien haben eine ___ Form, aber eine ___ Bedeutung.", options: ["passive; aktive", "aktive; passive", "passive; passive", "aktive; aktive"], correct: 0 },
        ],
      },
    ],
  },
  {
    id: "u18",
    latin: "PLUSQUAMPERFECTUM",
    german: "Plusquamperfekt & Futur II",
    lessons: [
      {
        id: "u18-l1",
        title: "Plusquamperfekt erkennen",
        exercises: [
          { type: "mc", q: "„Amaverat“ bedeutet …", options: ["er/sie liebt", "er/sie hat geliebt", "er/sie hatte geliebt", "er/sie wird geliebt haben"], correct: 2 },
          { type: "mc", q: "„Vocaverat“ bedeutet …", options: ["er/sie ruft", "er/sie hat gerufen", "er/sie hatte gerufen", "er/sie wird rufen"], correct: 2 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "laboraverat", accept: ["er hatte gearbeitet", "sie hatte gearbeitet", "hatte gearbeitet"] },
          { type: "mc", q: "Was ist der Unterschied zwischen „amavit“ und „amaverat“?", options: ["amavit = hat geliebt (Perfekt), amaverat = hatte geliebt (vorzeitig, Plusquamperfekt)", "kein Unterschied", "amaverat ist Zukunft", "amavit ist ein Nomen"], correct: 0 },
        ],
      },
      {
        id: "u18-l2",
        title: "Futur II",
        exercises: [
          { type: "mc", q: "„Amaverit“ bedeutet …", options: ["er/sie liebt", "er/sie hat geliebt", "er/sie wird geliebt haben", "er/sie hatte geliebt"], correct: 2 },
          { type: "mc", q: "„Vocaverit“ bedeutet …", options: ["er/sie ruft", "er/sie hat gerufen", "er/sie wird gerufen haben", "er/sie hatte gerufen"], correct: 2 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "laboraverit", accept: ["er wird gearbeitet haben", "sie wird gearbeitet haben", "wird gearbeitet haben"] },
          { type: "mc", q: "Wähle die richtige Form: „Cras dominus servum ___.“ (Morgen wird der Herr den Sklaven gerufen haben.)", options: ["vocat", "vocavit", "vocabit", "vocaverit"], correct: 3 },
        ],
      },
      {
        id: "u18-l3",
        title: "Sätze im Plusquamperfekt",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Mädchen hatte die Rose geliebt.“", words: ["Puella", "rosam", "amaverat"], correct: ["Puella", "rosam", "amaverat"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Sklave hatte den Herrn gerufen.“", words: ["Servus", "dominum", "vocaverat"], correct: ["Servus", "dominum", "vocaverat"] },
          { type: "mc", q: "„Familia viam viderat.“ bedeutet …", options: ["Die Familie sieht den Weg.", "Die Familie hatte den Weg gesehen.", "Die Familie wird den Weg sehen.", "Die Familie hat den Weg gesehen."], correct: 1 },
          { type: "mc", q: "„Rex urbem amaverat.“ bedeutet …", options: ["Der König liebt die Stadt.", "Der König hat die Stadt geliebt.", "Der König hatte die Stadt geliebt.", "Der König wird die Stadt lieben."], correct: 2 },
        ],
      },
    ],
  },
  {
    id: "u19",
    latin: "COMPARATIO",
    german: "Steigerung",
    lessons: [
      {
        id: "u19-l1",
        title: "Steigerung erkennen",
        exercises: [
          { type: "mc", q: "„Melior“ bedeutet …", options: ["besser", "der/die/das Beste", "gut", "schlechter"], correct: 0 },
          { type: "mc", q: "„Optimus“ bedeutet …", options: ["besser", "der/die/das Beste", "gut", "schlechter"], correct: 1 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "maior", accept: ["größer"] },
          { type: "mc", q: "„Maximus“ bedeutet …", options: ["groß", "größer", "der/die/das Größte", "klein"], correct: 2 },
        ],
      },
      {
        id: "u19-l2",
        title: "Regelmäßige Steigerung",
        exercises: [
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "longus", accept: ["lang"] },
          { type: "mc", q: "„Longior“ bedeutet …", options: ["lang", "länger", "der/die/das Längste", "kurz"], correct: 1 },
          { type: "mc", q: "„Longissimus“ bedeutet …", options: ["lang", "länger", "der/die/das Längste", "kurz"], correct: 2 },
          { type: "mc", q: "Wie bildet man den Komparativ meist?", options: ["Grundform + -ior", "Grundform + -issimus", "Grundform + -us", "Verdopplung des Wortes"], correct: 0 },
        ],
      },
      {
        id: "u19-l3",
        title: "Sätze mit Steigerungsformen",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Das Mädchen ist besser.“", words: ["Puella", "melior", "est"], correct: ["Puella", "melior", "est"] },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Der Tempel ist am größten.“", words: ["Templum", "maximum", "est"], correct: ["Templum", "maximum", "est"] },
          { type: "mc", q: "„Via longior est.“ bedeutet …", options: ["Der Weg ist lang.", "Der Weg ist länger.", "Der Weg ist der längste.", "Der Weg ist kurz."], correct: 1 },
          { type: "mc", q: "„Rex optimus est.“ bedeutet …", options: ["Der König ist gut.", "Der König ist besser.", "Der König ist der beste.", "Der König ist schlecht."], correct: 2 },
        ],
      },
    ],
  },
  {
    id: "u20",
    latin: "ABLATIVUS ABSOLUTUS",
    german: "Ablativus absolutus",
    lessons: [
      {
        id: "u20-l1",
        title: "Ablativus absolutus verstehen",
        exercises: [
          { type: "mc", q: "Ein Ablativus absolutus besteht meist aus …", options: ["Ablativ-Nomen + Partizip", "Nominativ + Verb", "Akkusativ + Infinitiv", "Genitiv + Adjektiv"], correct: 0 },
          { type: "mc", q: "„Servo vocato“ bedeutet ungefähr …", options: ["Nachdem der Sklave gerufen worden war", "Der Sklave ruft", "Weil der Sklave ruft", "Der Sklave wird gerufen"], correct: 0 },
          { type: "translate", prompt: "Übersetze ins Deutsche:", latin: "domino vocato", accept: ["nachdem der herr gerufen worden war", "nachdem der herr gerufen war"] },
          { type: "mc", q: "Ein Ablativus absolutus ist im Satz meist …", options: ["ein eigener, unabhängiger Nebensatz-Ersatz", "das Subjekt des Hauptsatzes", "ein einzelnes Adjektiv", "ein Vokativ"], correct: 0 },
        ],
      },
      {
        id: "u20-l2",
        title: "Bilden",
        exercises: [
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Nachdem der Sklave gerufen worden war, ist der Herr froh.“", words: ["Servo", "vocato", "dominus", "laetus", "est"], correct: ["Servo", "vocato", "dominus", "laetus", "est"] },
          { type: "mc", q: "Wähle die passende Ablativ-Partizip-Form: „___ , populus laetus est.“ (Nachdem der Tempel bewahrt worden war, ist das Volk froh.)", options: ["Templum servatum", "Templo servato", "Templi servati", "Templo servatur"], correct: 1 },
          { type: "order", prompt: "Bilde den lateinischen Satz für: „Nachdem der Tempel bewahrt worden war, ist das Volk froh.“", words: ["Templo", "servato", "populus", "laetus", "est"], correct: ["Templo", "servato", "populus", "laetus", "est"] },
          { type: "mc", q: "„Templo servato, populus laetus est.“ bedeutet …", options: ["Nachdem der Tempel bewahrt worden war, ist das Volk froh.", "Das Volk bewahrt den Tempel und ist froh.", "Der Tempel ist froh, weil das Volk ihn bewahrt.", "Das Volk wird den Tempel bewahren."], correct: 0 },
        ],
      },
      {
        id: "u20-l3",
        title: "Lesetext: Rex et Populus",
        exercises: [
          {
            type: "reading",
            title: "Rex et Populus",
            latin: "Rex, qui urbem amat, magnus est. Populus regem amat. Templum a populo servatur. Servo vocato, rex laetus est. Dei in caelo sunt.",
          },
          { type: "mc", q: "Was liebt der König?", options: ["Die Stadt", "Den Sklaven", "Den Tempel", "Das Meer"], correct: 0 },
          { type: "mc", q: "Wer bewahrt den Tempel?", options: ["Der König", "Das Volk", "Der Sklave", "Die Götter"], correct: 1 },
          { type: "mc", q: "Was geschieht, bevor der König froh ist?", options: ["Der Sklave wird gerufen.", "Das Volk ruft den König.", "Der Tempel wird gebaut.", "Der König ruft die Götter."], correct: 0 },
          { type: "mc", q: "Wo sind die Götter?", options: ["Im Tempel", "In der Stadt", "Im Himmel", "Auf dem Forum"], correct: 2 },
        ],
      },
    ],
  },
];

const FLAT_LESSONS = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unitId: u.id })));

const RANKS = [
  { min: 0, title: "Tiro", sub: "Rekrut", subKey: "rankTiro" },
  { min: 50, title: "Discipulus", sub: "Schüler", subKey: "rankDiscipulus" },
  { min: 150, title: "Quaestor", sub: "Schatzmeister", subKey: "rankQuaestor" },
  { min: 300, title: "Aedilis", sub: "Ädil", subKey: "rankAedilis" },
  { min: 500, title: "Praetor", sub: "Prätor", subKey: "rankPraetor" },
  { min: 800, title: "Consul", sub: "Konsul", subKey: "rankConsul" },
  { min: 1200, title: "Caesar", sub: "Imperator", subKey: "rankCaesar" },
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
  { id: "first", title: "Prima Lectio", desc: "Erste Lektion abgeschlossen", descKey: "badgeFirstDesc", icon: Sparkles },
  { id: "perfect", title: "Sine Errore", desc: "Eine Lektion ohne Fehler gemeistert", descKey: "badgePerfectDesc", icon: Star },
  { id: "unit", title: "Cursus Confectus", desc: "Eine ganze Einheit gemeistert", descKey: "badgeUnitDesc", icon: Trophy },
  { id: "xp150", title: "Centurio", desc: "150 XP gesammelt", descKey: "badgeXpDesc", icon: Award },
  { id: "streak5", title: "Quinque Dies", desc: "Serie von 5 Tagen", descKey: "badgeStreakDesc", icon: Flame },
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
/* ------------------------------------------------------------------ */
/* I18N: Mehrsprachige Oberflaeche (Lerninhalte bleiben auf Deutsch) */
/* ------------------------------------------------------------------ */

const SUPPORTED_LANGS = ["de", "en", "fr", "it", "es"];
const LANG_NAMES = { de: "Deutsch", en: "English", fr: "Français", it: "Italiano", es: "Español" };

function detectDeviceLanguage() {
  try {
    const raw = (navigator.language || (navigator.languages && navigator.languages[0]) || "de").slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(raw) ? raw : "de";
  } catch {
    return "de";
  }
}

const T = {
  de: {
    navPath: "Pfad", navGrammar: "Grammatik", navVocab: "Vokabeln", navLeaderboard: "Rangliste", navProfile: "Profil",
    appTagline: "Roma te vocat! 🏛️",
    xp: "XP", streakLabel: "Serie", heartsLabel: "Herzen",
    rankTiro: "Rekrut", rankDiscipulus: "Schüler", rankQuaestor: "Schatzmeister", rankAedilis: "Ädil", rankPraetor: "Prätor", rankConsul: "Konsul", rankCaesar: "Imperator",
    badgesTitle: "AUSZEICHNUNGEN",
    badgeFirstDesc: "Erste Lektion abgeschlossen",
    badgePerfectDesc: "Eine Lektion ohne Fehler gemeistert",
    badgeUnitDesc: "Eine ganze Einheit gemeistert",
    badgeXpDesc: "150 XP gesammelt",
    badgeStreakDesc: "Serie von 5 Tagen",
    dailySentenceTitle: "SATZ DES TAGES",
    tapToTranslate: "🔄 Zum Übersetzen tippen",
    lessonsOf: "LEKTIONEN",
    check: "PRÜFEN", continueBtn: "WEITER",
    correctFeedback: "OPTIME! · Richtig!", incorrectFeedback: "NON RECTE · Nicht ganz.",
    correctAnswerIs: "Richtige Antwort:",
    noHeartsTitle: "KEINE LEBEN MEHR",
    noHeartsBody: (t) => `Deine Herzen sind aufgebraucht. Versuch die Lektion „${t}" noch einmal.`,
    retry: "NOCHMAL VERSUCHEN", backToPath: "Zurück zum Pfad",
    perfectTitle: "OPTIME!", goodTitle: "BENE FACTUM!",
    perfectSub: "Perfekt, ganz ohne Fehler! 🎉", goodSub: "Gut gemacht — Lektion abgeschlossen.",
    accuracy: "Genauigkeit",
    streakMilestone: (n) => `${n} TAGE SERIE!`, streakMilestoneSub: "Du bist on fire — weiter so!",
    newBadgeTitle: "NEUE AUSZEICHNUNG",
    vocabTitle: "VOKABELN", vocabSub: "Trainieren, frei entdecken oder in kleinen Spielen üben.",
    dueToday: "Fällig", learned: "Gelernt", mastered: "Gemeistert",
    srsTitle: "KARTEIKASTEN-TRAINING", srsSub: "Spaced Repetition — was du oft richtig hast, kommt seltener dran.",
    finishFirstLesson: "Schließe erst deine erste Lektion ab! 📚",
    allLearnedToday: "Alles gelernt — komm morgen wieder 🌙✨",
    startTraining: (n) => `TRAINING STARTEN (${n})`,
    exploreTitle: "FREI ENTDECKEN", exploreSub: (n) => `Alle ${n} Wörter als Karteikarten durchblättern — auch schon vor dem Lernpfad.`,
    exploreStart: "ENTDECKEN STARTEN",
    gamesTitle: "MINI-SPIELE", gamesSub: "Memory & Wortblitz — mit deinen gelernten Wörtern.",
    gamesGo: "ZU DEN SPIELEN",
    gamesLocked: (xp) => `🔒 Ab 20 XP freigeschaltet (aktuell: ${xp} XP)`,
    myWords: "MEINE WÖRTER",
    latin: "LATEIN", german: "DEUTSCH", tapToFlip: "🔄 Zum Umdrehen tippen",
    back: "◀ ZURÜCK", forward: "WEITER ▶",
    grammarTitle: "GRAMMATIK", grammarSub: "Das Herzstück von Latein — Formen erkennen und bilden.",
    declineTitle: "Deklinieren", declineSub: "Nomen durch die Fälle üben", declineLocked: "Schließe erst eine Lektion mit Nomen ab",
    conjugateTitle: "Konjugieren", conjugateSub: "Verben durch die Formen üben", conjugateLocked: "Schließe erst eine Lektion mit Verben ab",
    nounsLookup: "NOMEN NACHSCHLAGEN", verbsLookup: "VERBEN NACHSCHLAGEN",
    declineHeader: (c) => `Dekliniere: ${c}`, conjugateHeader: (t, p) => `Konjugiere: ${t} — ${p}`,
    rightAnswerWas: (a) => `Richtig wäre: ${a}`, right: "Richtig!",
    declinedWell: "GUT DEKLINIERT!", conjugatedWell: "GUT KONJUGIERT!",
    formsCorrect: (n, m) => `${n} von ${m} Formen richtig.`, correctLabel: "Richtig",
    gamesHeader: "MINI-SPIELE", memoryTitle: "Memory", memoryDesc: "Finde die passenden Latein-Deutsch-Paare",
    blitzTitle: "Wortblitz", blitzDesc: "30 Sekunden — so viele Wörter wie möglich!",
    learnMoreWords: "Lerne mehr Wörter, um zu spielen",
    memoryDone: "Geschafft!", movesNeeded: (n) => `${n} Züge gebraucht`, xpEarned: "XP verdient",
    playAgain: "NOCHMAL SPIELEN", backToGames: "Zurück zu den Spielen",
    points: "Punkte", timeUp: "Zeit um!", wordsCorrect: (n) => `${n} Wörter richtig`,
    welcomeTitle: "Willkommen, Legionär!", newProfileTitle: "Neues Profil",
    onboardingSub: "Wähle einen Spitznamen und leg direkt los — komplett kostenlos, ganz ohne echten Namen.",
    nickname: "DEIN SPITZNAME", noRealNames: "⚠️ Bitte keinen echten Namen verwenden.",
    avatarLabel: "AVATAR",
    classCodeOptionalLabel: "Klassencode", classCodeOptionalHint: "(optional, geht auch später)",
    classCodePlaceholder: "z. B. 7A-Latein", classCodeHelp: "Von deiner Lehrkraft — alle mit demselben Code sehen sich in der Rangliste.",
    startFree: "KOSTENLOS LOSLEGEN", creating: "WIRD ANGELEGT …", cancel: "Abbrechen",
    introTitle1: "Willkommen bei Lingua Latina!", introText1: "Lerne Latein spielerisch — mit einem Lernpfad, kleinen Häppchen und jeder Menge Belohnungen.",
    introTitle2: "Pfad, Grammatik & Vokabeln", introText2: "Der Lernpfad führt dich Schritt für Schritt. Extra-Trainer für Deklinieren, Konjugieren und Vokabeln vertiefen, was du gelernt hast.",
    introTitle3: "XP, Serien & Abzeichen", introText3: "Sammle XP, halte deine Serie am Leben und tritt mit einem Spitznamen gegen deine Klasse in der Rangliste an — ganz ohne echten Namen.",
    introTitle4: "Spiele & tägliche Sätze", introText4: "Ab ein paar gesammelten Punkten warten Memory & Wortblitz. Und jeden Tag gibt's einen neuen lateinischen Satz zum Knacken.",
    introNext: "WEITER", introGo: "LOS GEHT'S!", introSkip: "Überspringen",
    profileTitle: "PROFIL", noClassYet: "Noch keiner Klasse beigetreten",
    otherProfiles: "ANDERE PROFILE AUF DIESEM GERÄT", addProfile: "NEUES PROFIL ANLEGEN",
    classSectionTitle: "KLASSE",
    memberOfClass: (c) => `Du bist Mitglied der Klasse „${c}".`,
    leaveClass: "KLASSE VERLASSEN",
    notInClassYet: "Noch in keiner Klasse — tritt bei, um in der Rangliste gegen deine Mitschüler:innen anzutreten.",
    classCodeInputPlaceholder: "Klassencode eingeben", join: "BEITRETEN",
    deviceSyncTitle: "GERÄTE-SYNC",
    syncUnavailable: "Geräteübergreifender Sync ist für dieses Profil nicht verfügbar (Cloud-Sync war beim Anlegen nicht erreichbar).",
    syncCodeExplain: "Dein Code — gib ihn auf einem anderen Gerät ein, um dieses Profil dort zu laden. Nach der Nutzung wird automatisch ein neuer Code vergeben.",
    copy: "KOPIEREN", copied: "KOPIERT! ✓",
    enterCodeFromOther: "Code von einem anderen Gerät eingeben:", codePlaceholder: "Code eingeben", load: "LADEN",
    sendFeedback: "FEEDBACK SENDEN", impressum: "Impressum", save: "SPEICHERN",
    leaderboardTitle: "RANGLISTE",
    classLabel: (c) => `Klasse „${c}"`,
    leaderboardNotSetUp: "Rangliste noch nicht eingerichtet", askTeacher: "Frag deine Lehrkraft, ob die Cloud-Anbindung schon aktiv ist.",
    noClassYetLb: "Noch in keiner Klasse",
    noClassYetLbBody: "Du kannst schon jetzt alles lernen! Wenn du gegen deine Klasse antreten willst, tritt einfach im Profil mit einem Code bei.",
    noClassmatesYet: "Noch keine Mitspieler in dieser Klasse gefunden.",
    youLabel: "(Du)", noClassConnected: "Keine Klasse verbunden",
    feedbackTitle: "FEEDBACK", feedbackSub: "Fehler gefunden? Idee für eine neue Lektion? Sag Bescheid!",
    catError: "Fehler", catIdea: "Idee", catOther: "Sonstiges",
    feedbackPlaceholder: "Was möchtest du uns mitteilen?", sendByMail: "PER MAIL SENDEN",
    feedbackHint: "Öffnet deine Mail-App, Empfänger ist bereits eingetragen.",
    impressumTitle: "IMPRESSUM", languageLabel: "SPRACHE",
    caseNominativ: "Nominativ", caseGenitiv: "Genitiv", caseDativ: "Dativ", caseAkkusativ: "Akkusativ", caseAblativ: "Ablativ",
    tensePraesens: "Präsens", tensePerfekt: "Perfekt", tenseImperfekt: "Imperfekt", tenseFutur: "Futur",
    personIch: "ich", personDu: "du", personErSieEs: "er/sie/es", personWir: "wir", personIhr: "ihr", personSie: "sie",
    declineHeader2: (c) => `Dekliniere: ${c}`, conjugateHeader2: (t, p) => `Konjugiere: ${t} — ${p}`,
  },
  en: {
    navPath: "Path", navGrammar: "Grammar", navVocab: "Vocabulary", navLeaderboard: "Leaderboard", navProfile: "Profile",
    appTagline: "Roma te vocat! 🏛️",
    xp: "XP", streakLabel: "Streak", heartsLabel: "Hearts",
    rankTiro: "Recruit", rankDiscipulus: "Student", rankQuaestor: "Treasurer", rankAedilis: "Aedile", rankPraetor: "Praetor", rankConsul: "Consul", rankCaesar: "Emperor",
    badgesTitle: "ACHIEVEMENTS",
    badgeFirstDesc: "Completed your first lesson",
    badgePerfectDesc: "Aced a lesson with no mistakes",
    badgeUnitDesc: "Mastered a whole unit",
    badgeXpDesc: "Collected 150 XP",
    badgeStreakDesc: "5-day streak",
    dailySentenceTitle: "SENTENCE OF THE DAY",
    tapToTranslate: "🔄 Tap to translate",
    lessonsOf: "LESSONS",
    check: "CHECK", continueBtn: "CONTINUE",
    correctFeedback: "OPTIME! · Correct!", incorrectFeedback: "NON RECTE · Not quite.",
    correctAnswerIs: "Correct answer:",
    noHeartsTitle: "OUT OF HEARTS",
    noHeartsBody: (t) => `You're out of hearts. Try the lesson "${t}" again.`,
    retry: "TRY AGAIN", backToPath: "Back to path",
    perfectTitle: "OPTIME!", goodTitle: "BENE FACTUM!",
    perfectSub: "Perfect, no mistakes! 🎉", goodSub: "Well done — lesson complete.",
    accuracy: "Accuracy",
    streakMilestone: (n) => `${n}-DAY STREAK!`, streakMilestoneSub: "You're on fire — keep it up!",
    newBadgeTitle: "NEW ACHIEVEMENT",
    vocabTitle: "VOCABULARY", vocabSub: "Train, browse freely, or practice with mini-games.",
    dueToday: "Due", learned: "Learned", mastered: "Mastered",
    srsTitle: "FLASHCARD TRAINING", srsSub: "Spaced repetition — words you know well come up less often.",
    finishFirstLesson: "Finish your first lesson to collect words! 📚",
    allLearnedToday: "All done — come back tomorrow 🌙✨",
    startTraining: (n) => `START TRAINING (${n})`,
    exploreTitle: "FREE EXPLORE", exploreSub: (n) => `Browse all ${n} words as flashcards — even before starting the path.`,
    exploreStart: "START EXPLORING",
    gamesTitle: "MINI-GAMES", gamesSub: "Memory & Word Blitz — using the words you've learned.",
    gamesGo: "GO TO GAMES",
    gamesLocked: (xp) => `🔒 Unlocks at 20 XP (currently: ${xp} XP)`,
    myWords: "MY WORDS",
    latin: "LATIN", german: "ENGLISH", tapToFlip: "🔄 Tap to flip",
    back: "◀ BACK", forward: "NEXT ▶",
    grammarTitle: "GRAMMAR", grammarSub: "The heart of Latin — recognizing and forming words.",
    declineTitle: "Decline", declineSub: "Practice nouns through the cases", declineLocked: "Finish a lesson with nouns first",
    conjugateTitle: "Conjugate", conjugateSub: "Practice verbs through their forms", conjugateLocked: "Finish a lesson with verbs first",
    nounsLookup: "NOUN REFERENCE", verbsLookup: "VERB REFERENCE",
    declineHeader: (c) => `Decline: ${c}`, conjugateHeader: (t, p) => `Conjugate: ${t} — ${p}`,
    rightAnswerWas: (a) => `Correct answer: ${a}`, right: "Correct!",
    declinedWell: "GREAT DECLINING!", conjugatedWell: "GREAT CONJUGATING!",
    formsCorrect: (n, m) => `${n} of ${m} forms correct.`, correctLabel: "Correct",
    gamesHeader: "MINI-GAMES", memoryTitle: "Memory", memoryDesc: "Find the matching Latin-English pairs",
    blitzTitle: "Word Blitz", blitzDesc: "30 seconds — as many words as you can!",
    learnMoreWords: "Learn more words to unlock this",
    memoryDone: "Done!", movesNeeded: (n) => `${n} moves used`, xpEarned: "XP earned",
    playAgain: "PLAY AGAIN", backToGames: "Back to games",
    points: "points", timeUp: "Time's up!", wordsCorrect: (n) => `${n} words correct`,
    welcomeTitle: "Welcome, legionary!", newProfileTitle: "New profile",
    onboardingSub: "Pick a nickname and dive right in — completely free, no real name needed.",
    nickname: "YOUR NICKNAME", noRealNames: "⚠️ Please don't use your real name.",
    avatarLabel: "AVATAR",
    classCodeOptionalLabel: "Class code", classCodeOptionalHint: "(optional, you can add this later)",
    classCodePlaceholder: "e.g. 7A-Latin", classCodeHelp: "From your teacher — everyone with the same code sees each other on the leaderboard.",
    startFree: "START FOR FREE", creating: "CREATING …", cancel: "Cancel",
    introTitle1: "Welcome to Lingua Latina!", introText1: "Learn Latin the fun way — with a learning path, bite-sized lessons, and plenty of rewards.",
    introTitle2: "Path, Grammar & Vocabulary", introText2: "The path guides you step by step. Extra trainers for declining, conjugating, and vocabulary deepen what you've learned.",
    introTitle3: "XP, Streaks & Badges", introText3: "Earn XP, keep your streak alive, and compete against your class on the leaderboard with a nickname — no real name needed.",
    introTitle4: "Games & Daily Sentences", introText4: "Once you've earned a few points, Memory & Word Blitz await. Plus a new Latin sentence to crack every day.",
    introNext: "NEXT", introGo: "LET'S GO!", introSkip: "Skip",
    profileTitle: "PROFILE", noClassYet: "Not in a class yet",
    otherProfiles: "OTHER PROFILES ON THIS DEVICE", addProfile: "CREATE NEW PROFILE",
    classSectionTitle: "CLASS",
    memberOfClass: (c) => `You're a member of class "${c}".`,
    leaveClass: "LEAVE CLASS",
    notInClassYet: "Not in a class yet — join one to compete against your classmates on the leaderboard.",
    classCodeInputPlaceholder: "Enter class code", join: "JOIN",
    deviceSyncTitle: "DEVICE SYNC",
    syncUnavailable: "Cross-device sync isn't available for this profile (cloud sync wasn't reachable when it was created).",
    syncCodeExplain: "Your code — enter it on another device to load this profile there. A new code is issued automatically after use.",
    copy: "COPY", copied: "COPIED! ✓",
    enterCodeFromOther: "Enter a code from another device:", codePlaceholder: "Enter code", load: "LOAD",
    sendFeedback: "SEND FEEDBACK", impressum: "Legal notice", save: "SAVE",
    leaderboardTitle: "LEADERBOARD",
    classLabel: (c) => `Class "${c}"`,
    leaderboardNotSetUp: "Leaderboard not set up yet", askTeacher: "Ask your teacher whether cloud sync is active yet.",
    noClassYetLb: "Not in a class yet",
    noClassYetLbBody: "You can already learn everything! If you want to compete against your class, just join with a code in your profile.",
    noClassmatesYet: "No classmates found yet.",
    youLabel: "(You)", noClassConnected: "No class connected",
    feedbackTitle: "FEEDBACK", feedbackSub: "Found a bug? Have an idea for a new lesson? Let us know!",
    catError: "Bug", catIdea: "Idea", catOther: "Other",
    feedbackPlaceholder: "What would you like to tell us?", sendByMail: "SEND BY EMAIL",
    feedbackHint: "Opens your mail app with the recipient already filled in.",
    impressumTitle: "LEGAL NOTICE", languageLabel: "LANGUAGE",
    caseNominativ: "Nominative", caseGenitiv: "Genitive", caseDativ: "Dative", caseAkkusativ: "Accusative", caseAblativ: "Ablative",
    tensePraesens: "Present", tensePerfekt: "Perfect", tenseImperfekt: "Imperfect", tenseFutur: "Future",
    personIch: "I", personDu: "you", personErSieEs: "he/she/it", personWir: "we", personIhr: "you (pl.)", personSie: "they",
  },
  fr: {
    navPath: "Parcours", navGrammar: "Grammaire", navVocab: "Vocabulaire", navLeaderboard: "Classement", navProfile: "Profil",
    appTagline: "Roma te vocat! 🏛️",
    xp: "XP", streakLabel: "Série", heartsLabel: "Vies",
    rankTiro: "Recrue", rankDiscipulus: "Élève", rankQuaestor: "Questeur", rankAedilis: "Édile", rankPraetor: "Préteur", rankConsul: "Consul", rankCaesar: "Empereur",
    badgesTitle: "RÉCOMPENSES",
    badgeFirstDesc: "Première leçon terminée",
    badgePerfectDesc: "Une leçon réussie sans erreur",
    badgeUnitDesc: "Une unité entière maîtrisée",
    badgeXpDesc: "150 XP collectés",
    badgeStreakDesc: "Série de 5 jours",
    dailySentenceTitle: "PHRASE DU JOUR",
    tapToTranslate: "🔄 Toucher pour traduire",
    lessonsOf: "LEÇONS",
    check: "VÉRIFIER", continueBtn: "CONTINUER",
    correctFeedback: "OPTIME ! · Correct !", incorrectFeedback: "NON RECTE · Pas tout à fait.",
    correctAnswerIs: "Bonne réponse :",
    noHeartsTitle: "PLUS DE VIES",
    noHeartsBody: (t) => `Tu n'as plus de vies. Réessaie la leçon « ${t} ».`,
    retry: "RÉESSAYER", backToPath: "Retour au parcours",
    perfectTitle: "OPTIME !", goodTitle: "BENE FACTUM !",
    perfectSub: "Parfait, sans aucune erreur ! 🎉", goodSub: "Bien joué — leçon terminée.",
    accuracy: "Précision",
    streakMilestone: (n) => `SÉRIE DE ${n} JOURS !`, streakMilestoneSub: "Tu es en feu — continue comme ça !",
    newBadgeTitle: "NOUVELLE RÉCOMPENSE",
    vocabTitle: "VOCABULAIRE", vocabSub: "S'entraîner, explorer librement ou jouer à des mini-jeux.",
    dueToday: "À réviser", learned: "Appris", mastered: "Maîtrisé",
    srsTitle: "ENTRAÎNEMENT PAR CARTES", srsSub: "Répétition espacée — les mots que tu maîtrises reviennent moins souvent.",
    finishFirstLesson: "Termine ta première leçon pour collecter des mots ! 📚",
    allLearnedToday: "Tout est appris — reviens demain 🌙✨",
    startTraining: (n) => `COMMENCER (${n})`,
    exploreTitle: "EXPLORER LIBREMENT", exploreSub: (n) => `Parcours les ${n} mots sous forme de cartes — même avant de commencer le parcours.`,
    exploreStart: "COMMENCER À EXPLORER",
    gamesTitle: "MINI-JEUX", gamesSub: "Memory & Éclair de mots — avec les mots que tu as appris.",
    gamesGo: "VOIR LES JEUX",
    gamesLocked: (xp) => `🔒 Débloqué à 20 XP (actuellement : ${xp} XP)`,
    myWords: "MES MOTS",
    latin: "LATIN", german: "FRANÇAIS", tapToFlip: "🔄 Toucher pour retourner",
    back: "◀ RETOUR", forward: "SUIVANT ▶",
    grammarTitle: "GRAMMAIRE", grammarSub: "Le cœur du latin — reconnaître et former les mots.",
    declineTitle: "Décliner", declineSub: "S'entraîner sur les noms à travers les cas", declineLocked: "Termine d'abord une leçon avec des noms",
    conjugateTitle: "Conjuguer", conjugateSub: "S'entraîner sur les verbes à travers leurs formes", conjugateLocked: "Termine d'abord une leçon avec des verbes",
    nounsLookup: "NOMS À CONSULTER", verbsLookup: "VERBES À CONSULTER",
    declineHeader: (c) => `Décline : ${c}`, conjugateHeader: (t, p) => `Conjugue : ${t} — ${p}`,
    rightAnswerWas: (a) => `Bonne réponse : ${a}`, right: "Correct !",
    declinedWell: "BIEN DÉCLINÉ !", conjugatedWell: "BIEN CONJUGUÉ !",
    formsCorrect: (n, m) => `${n} formes correctes sur ${m}.`, correctLabel: "Correct",
    gamesHeader: "MINI-JEUX", memoryTitle: "Memory", memoryDesc: "Trouve les paires latin-français correspondantes",
    blitzTitle: "Éclair de mots", blitzDesc: "30 secondes — autant de mots que possible !",
    learnMoreWords: "Apprends plus de mots pour débloquer ce jeu",
    memoryDone: "Terminé !", movesNeeded: (n) => `${n} coups utilisés`, xpEarned: "XP gagnés",
    playAgain: "REJOUER", backToGames: "Retour aux jeux",
    points: "points", timeUp: "Temps écoulé !", wordsCorrect: (n) => `${n} mots corrects`,
    welcomeTitle: "Bienvenue, légionnaire !", newProfileTitle: "Nouveau profil",
    onboardingSub: "Choisis un pseudo et lance-toi — entièrement gratuit, sans nom réel.",
    nickname: "TON PSEUDO", noRealNames: "⚠️ Merci de ne pas utiliser ton vrai nom.",
    avatarLabel: "AVATAR",
    classCodeOptionalLabel: "Code de classe", classCodeOptionalHint: "(facultatif, possible plus tard)",
    classCodePlaceholder: "ex. 7A-Latin", classCodeHelp: "Donné par ton enseignant·e — tous ceux qui ont le même code se voient dans le classement.",
    startFree: "COMMENCER GRATUITEMENT", creating: "CRÉATION EN COURS …", cancel: "Annuler",
    introTitle1: "Bienvenue sur Lingua Latina !", introText1: "Apprends le latin en t'amusant — avec un parcours, de petites leçons et plein de récompenses.",
    introTitle2: "Parcours, grammaire & vocabulaire", introText2: "Le parcours te guide pas à pas. Des entraîneurs supplémentaires pour la déclinaison, la conjugaison et le vocabulaire approfondissent tes acquis.",
    introTitle3: "XP, séries & badges", introText3: "Gagne des XP, maintiens ta série et affronte ta classe au classement avec un pseudo — sans nom réel.",
    introTitle4: "Jeux & phrases du jour", introText4: "Dès que tu as quelques points, Memory & Éclair de mots t'attendent. Et chaque jour, une nouvelle phrase latine à déchiffrer.",
    introNext: "SUIVANT", introGo: "C'EST PARTI !", introSkip: "Passer",
    profileTitle: "PROFIL", noClassYet: "Pas encore dans une classe",
    otherProfiles: "AUTRES PROFILS SUR CET APPAREIL", addProfile: "CRÉER UN NOUVEAU PROFIL",
    classSectionTitle: "CLASSE",
    memberOfClass: (c) => `Tu es membre de la classe « ${c} ».`,
    leaveClass: "QUITTER LA CLASSE",
    notInClassYet: "Pas encore dans une classe — rejoins-en une pour affronter tes camarades au classement.",
    classCodeInputPlaceholder: "Entrer le code de classe", join: "REJOINDRE",
    deviceSyncTitle: "SYNCHRONISATION",
    syncUnavailable: "La synchronisation entre appareils n'est pas disponible pour ce profil (le cloud était injoignable à la création).",
    syncCodeExplain: "Ton code — entre-le sur un autre appareil pour y charger ce profil. Un nouveau code est généré automatiquement après usage.",
    copy: "COPIER", copied: "COPIÉ ! ✓",
    enterCodeFromOther: "Entrer un code d'un autre appareil :", codePlaceholder: "Entrer le code", load: "CHARGER",
    sendFeedback: "ENVOYER UN AVIS", impressum: "Mentions légales", save: "ENREGISTRER",
    leaderboardTitle: "CLASSEMENT",
    classLabel: (c) => `Classe « ${c} »`,
    leaderboardNotSetUp: "Classement pas encore configuré", askTeacher: "Demande à ton enseignant·e si la connexion cloud est déjà active.",
    noClassYetLb: "Pas encore dans une classe",
    noClassYetLbBody: "Tu peux déjà tout apprendre ! Pour affronter ta classe, rejoins-la simplement avec un code dans ton profil.",
    noClassmatesYet: "Aucun camarade trouvé pour l'instant.",
    youLabel: "(Toi)", noClassConnected: "Aucune classe connectée",
    feedbackTitle: "AVIS", feedbackSub: "Un bug trouvé ? Une idée de leçon ? Dis-le-nous !",
    catError: "Bug", catIdea: "Idée", catOther: "Autre",
    feedbackPlaceholder: "Que veux-tu nous dire ?", sendByMail: "ENVOYER PAR E-MAIL",
    feedbackHint: "Ouvre ton application mail avec le destinataire déjà rempli.",
    impressumTitle: "MENTIONS LÉGALES", languageLabel: "LANGUE",
    caseNominativ: "Nominatif", caseGenitiv: "Génitif", caseDativ: "Datif", caseAkkusativ: "Accusatif", caseAblativ: "Ablatif",
    tensePraesens: "Présent", tensePerfekt: "Parfait", tenseImperfekt: "Imparfait", tenseFutur: "Futur",
    personIch: "je", personDu: "tu", personErSieEs: "il/elle", personWir: "nous", personIhr: "vous", personSie: "ils/elles",
  },
  it: {
    navPath: "Percorso", navGrammar: "Grammatica", navVocab: "Vocabolario", navLeaderboard: "Classifica", navProfile: "Profilo",
    appTagline: "Roma te vocat! 🏛️",
    xp: "XP", streakLabel: "Serie", heartsLabel: "Vite",
    rankTiro: "Recluta", rankDiscipulus: "Studente", rankQuaestor: "Questore", rankAedilis: "Edile", rankPraetor: "Pretore", rankConsul: "Console", rankCaesar: "Imperatore",
    badgesTitle: "OBIETTIVI",
    badgeFirstDesc: "Prima lezione completata",
    badgePerfectDesc: "Lezione superata senza errori",
    badgeUnitDesc: "Un'intera unità completata",
    badgeXpDesc: "150 XP raccolti",
    badgeStreakDesc: "Serie di 5 giorni",
    dailySentenceTitle: "FRASE DEL GIORNO",
    tapToTranslate: "🔄 Tocca per tradurre",
    lessonsOf: "LEZIONI",
    check: "CONTROLLA", continueBtn: "AVANTI",
    correctFeedback: "OPTIME! · Corretto!", incorrectFeedback: "NON RECTE · Non proprio.",
    correctAnswerIs: "Risposta corretta:",
    noHeartsTitle: "VITE ESAURITE",
    noHeartsBody: (t) => `Le tue vite sono finite. Riprova la lezione «${t}».`,
    retry: "RIPROVA", backToPath: "Torna al percorso",
    perfectTitle: "OPTIME!", goodTitle: "BENE FACTUM!",
    perfectSub: "Perfetto, senza errori! 🎉", goodSub: "Ben fatto — lezione completata.",
    accuracy: "Precisione",
    streakMilestone: (n) => `SERIE DI ${n} GIORNI!`, streakMilestoneSub: "Sei in fiamme — continua così!",
    newBadgeTitle: "NUOVO OBIETTIVO",
    vocabTitle: "VOCABOLARIO", vocabSub: "Allenati, esplora liberamente o gioca ai mini-giochi.",
    dueToday: "Da ripassare", learned: "Imparate", mastered: "Padroneggiate",
    srsTitle: "ALLENAMENTO A CARTE", srsSub: "Ripetizione dilazionata — le parole che sai bene tornano meno spesso.",
    finishFirstLesson: "Completa la prima lezione per raccogliere parole! 📚",
    allLearnedToday: "Tutto imparato — torna domani 🌙✨",
    startTraining: (n) => `INIZIA ALLENAMENTO (${n})`,
    exploreTitle: "ESPLORA LIBERAMENTE", exploreSub: (n) => `Sfoglia tutte le ${n} parole come flashcard — anche prima di iniziare il percorso.`,
    exploreStart: "INIZIA A ESPLORARE",
    gamesTitle: "MINI-GIOCHI", gamesSub: "Memory e Fulmine di Parole — con le parole che hai imparato.",
    gamesGo: "VAI AI GIOCHI",
    gamesLocked: (xp) => `🔒 Si sblocca a 20 XP (attuali: ${xp} XP)`,
    myWords: "LE MIE PAROLE",
    latin: "LATINO", german: "ITALIANO", tapToFlip: "🔄 Tocca per girare",
    back: "◀ INDIETRO", forward: "AVANTI ▶",
    grammarTitle: "GRAMMATICA", grammarSub: "Il cuore del latino — riconoscere e formare le parole.",
    declineTitle: "Declinare", declineSub: "Esercitati sui nomi attraverso i casi", declineLocked: "Completa prima una lezione con i nomi",
    conjugateTitle: "Coniugare", conjugateSub: "Esercitati sui verbi attraverso le loro forme", conjugateLocked: "Completa prima una lezione con i verbi",
    nounsLookup: "CONSULTA I NOMI", verbsLookup: "CONSULTA I VERBI",
    declineHeader: (c) => `Declina: ${c}`, conjugateHeader: (t, p) => `Coniuga: ${t} — ${p}`,
    rightAnswerWas: (a) => `Risposta corretta: ${a}`, right: "Corretto!",
    declinedWell: "OTTIMA DECLINAZIONE!", conjugatedWell: "OTTIMA CONIUGAZIONE!",
    formsCorrect: (n, m) => `${n} forme corrette su ${m}.`, correctLabel: "Corrette",
    gamesHeader: "MINI-GIOCHI", memoryTitle: "Memory", memoryDesc: "Trova le coppie latino-italiano corrispondenti",
    blitzTitle: "Fulmine di Parole", blitzDesc: "30 secondi — quante più parole possibile!",
    learnMoreWords: "Impara altre parole per sbloccare questo gioco",
    memoryDone: "Fatto!", movesNeeded: (n) => `${n} mosse usate`, xpEarned: "XP guadagnati",
    playAgain: "GIOCA ANCORA", backToGames: "Torna ai giochi",
    points: "punti", timeUp: "Tempo scaduto!", wordsCorrect: (n) => `${n} parole corrette`,
    welcomeTitle: "Benvenuto, legionario!", newProfileTitle: "Nuovo profilo",
    onboardingSub: "Scegli un soprannome e inizia subito — completamente gratis, senza nome reale.",
    nickname: "IL TUO SOPRANNOME", noRealNames: "⚠️ Per favore non usare il tuo vero nome.",
    avatarLabel: "AVATAR",
    classCodeOptionalLabel: "Codice classe", classCodeOptionalHint: "(facoltativo, puoi aggiungerlo anche dopo)",
    classCodePlaceholder: "es. 7A-Latino", classCodeHelp: "Dal tuo insegnante — chi ha lo stesso codice si vede in classifica.",
    startFree: "INIZIA GRATIS", creating: "CREAZIONE IN CORSO …", cancel: "Annulla",
    introTitle1: "Benvenuto su Lingua Latina!", introText1: "Impara il latino in modo divertente — con un percorso, lezioni brevi e tante ricompense.",
    introTitle2: "Percorso, Grammatica e Vocabolario", introText2: "Il percorso ti guida passo dopo passo. Allenamenti extra per declinare, coniugare e il vocabolario approfondiscono ciò che hai imparato.",
    introTitle3: "XP, Serie e Obiettivi", introText3: "Guadagna XP, mantieni viva la tua serie e sfida la tua classe in classifica con un soprannome — senza nome reale.",
    introTitle4: "Giochi e frasi quotidiane", introText4: "Con qualche punto guadagnato ti aspettano Memory e Fulmine di Parole. E ogni giorno una nuova frase latina da decifrare.",
    introNext: "AVANTI", introGo: "INIZIAMO!", introSkip: "Salta",
    profileTitle: "PROFILO", noClassYet: "Non ancora in una classe",
    otherProfiles: "ALTRI PROFILI SU QUESTO DISPOSITIVO", addProfile: "CREA NUOVO PROFILO",
    classSectionTitle: "CLASSE",
    memberOfClass: (c) => `Sei membro della classe «${c}».`,
    leaveClass: "ESCI DALLA CLASSE",
    notInClassYet: "Non ancora in una classe — unisciti a una per sfidare i tuoi compagni in classifica.",
    classCodeInputPlaceholder: "Inserisci il codice classe", join: "UNISCITI",
    deviceSyncTitle: "SINCRONIZZAZIONE",
    syncUnavailable: "La sincronizzazione tra dispositivi non è disponibile per questo profilo (il cloud non era raggiungibile alla creazione).",
    syncCodeExplain: "Il tuo codice — inseriscilo su un altro dispositivo per caricare qui il profilo. Dopo l'uso viene generato automaticamente un nuovo codice.",
    copy: "COPIA", copied: "COPIATO! ✓",
    enterCodeFromOther: "Inserisci un codice da un altro dispositivo:", codePlaceholder: "Inserisci codice", load: "CARICA",
    sendFeedback: "INVIA FEEDBACK", impressum: "Note legali", save: "SALVA",
    leaderboardTitle: "CLASSIFICA",
    classLabel: (c) => `Classe «${c}»`,
    leaderboardNotSetUp: "Classifica non ancora configurata", askTeacher: "Chiedi al tuo insegnante se la connessione cloud è già attiva.",
    noClassYetLb: "Non ancora in una classe",
    noClassYetLbBody: "Puoi già imparare tutto! Se vuoi sfidare la tua classe, unisciti semplicemente con un codice nel profilo.",
    noClassmatesYet: "Nessun compagno trovato ancora.",
    youLabel: "(Tu)", noClassConnected: "Nessuna classe collegata",
    feedbackTitle: "FEEDBACK", feedbackSub: "Hai trovato un errore? Un'idea per una nuova lezione? Faccelo sapere!",
    catError: "Errore", catIdea: "Idea", catOther: "Altro",
    feedbackPlaceholder: "Cosa vuoi dirci?", sendByMail: "INVIA VIA EMAIL",
    feedbackHint: "Apre la tua app di posta con il destinatario già inserito.",
    impressumTitle: "NOTE LEGALI", languageLabel: "LINGUA",
    caseNominativ: "Nominativo", caseGenitiv: "Genitivo", caseDativ: "Dativo", caseAkkusativ: "Accusativo", caseAblativ: "Ablativo",
    tensePraesens: "Presente", tensePerfekt: "Perfetto", tenseImperfekt: "Imperfetto", tenseFutur: "Futuro",
    personIch: "io", personDu: "tu", personErSieEs: "lui/lei", personWir: "noi", personIhr: "voi", personSie: "loro",
  },
  es: {
    navPath: "Ruta", navGrammar: "Gramática", navVocab: "Vocabulario", navLeaderboard: "Clasificación", navProfile: "Perfil",
    appTagline: "Roma te vocat! 🏛️",
    xp: "XP", streakLabel: "Racha", heartsLabel: "Vidas",
    rankTiro: "Recluta", rankDiscipulus: "Estudiante", rankQuaestor: "Cuestor", rankAedilis: "Edil", rankPraetor: "Pretor", rankConsul: "Cónsul", rankCaesar: "Emperador",
    badgesTitle: "LOGROS",
    badgeFirstDesc: "Primera lección completada",
    badgePerfectDesc: "Lección superada sin errores",
    badgeUnitDesc: "Una unidad completa dominada",
    badgeXpDesc: "150 XP acumulados",
    badgeStreakDesc: "Racha de 5 días",
    dailySentenceTitle: "FRASE DEL DÍA",
    tapToTranslate: "🔄 Toca para traducir",
    lessonsOf: "LECCIONES",
    check: "COMPROBAR", continueBtn: "CONTINUAR",
    correctFeedback: "OPTIME! · ¡Correcto!", incorrectFeedback: "NON RECTE · No del todo.",
    correctAnswerIs: "Respuesta correcta:",
    noHeartsTitle: "SIN VIDAS",
    noHeartsBody: (t) => `Te has quedado sin vidas. Vuelve a intentar la lección «${t}».`,
    retry: "REINTENTAR", backToPath: "Volver a la ruta",
    perfectTitle: "¡OPTIME!", goodTitle: "¡BENE FACTUM!",
    perfectSub: "¡Perfecto, sin errores! 🎉", goodSub: "Bien hecho — lección completada.",
    accuracy: "Precisión",
    streakMilestone: (n) => `¡RACHA DE ${n} DÍAS!`, streakMilestoneSub: "Estás que ardes — ¡sigue así!",
    newBadgeTitle: "NUEVO LOGRO",
    vocabTitle: "VOCABULARIO", vocabSub: "Entrena, explora libremente o juega mini-juegos.",
    dueToday: "Pendiente", learned: "Aprendidas", mastered: "Dominadas",
    srsTitle: "ENTRENAMIENTO CON TARJETAS", srsSub: "Repetición espaciada — las palabras que dominas aparecen con menos frecuencia.",
    finishFirstLesson: "¡Termina tu primera lección para reunir palabras! 📚",
    allLearnedToday: "Todo aprendido — vuelve mañana 🌙✨",
    startTraining: (n) => `EMPEZAR ENTRENAMIENTO (${n})`,
    exploreTitle: "EXPLORAR LIBREMENTE", exploreSub: (n) => `Explora las ${n} palabras como tarjetas — incluso antes de empezar la ruta.`,
    exploreStart: "EMPEZAR A EXPLORAR",
    gamesTitle: "MINI-JUEGOS", gamesSub: "Memory y Ráfaga de Palabras — con las palabras que has aprendido.",
    gamesGo: "IR A LOS JUEGOS",
    gamesLocked: (xp) => `🔒 Se desbloquea con 20 XP (actual: ${xp} XP)`,
    myWords: "MIS PALABRAS",
    latin: "LATÍN", german: "ESPAÑOL", tapToFlip: "🔄 Toca para voltear",
    back: "◀ ATRÁS", forward: "SIGUIENTE ▶",
    grammarTitle: "GRAMÁTICA", grammarSub: "El corazón del latín — reconocer y formar palabras.",
    declineTitle: "Declinar", declineSub: "Practica los sustantivos a través de los casos", declineLocked: "Termina primero una lección con sustantivos",
    conjugateTitle: "Conjugar", conjugateSub: "Practica los verbos a través de sus formas", conjugateLocked: "Termina primero una lección con verbos",
    nounsLookup: "CONSULTAR SUSTANTIVOS", verbsLookup: "CONSULTAR VERBOS",
    declineHeader: (c) => `Declina: ${c}`, conjugateHeader: (t, p) => `Conjuga: ${t} — ${p}`,
    rightAnswerWas: (a) => `Respuesta correcta: ${a}`, right: "¡Correcto!",
    declinedWell: "¡BIEN DECLINADO!", conjugatedWell: "¡BIEN CONJUGADO!",
    formsCorrect: (n, m) => `${n} de ${m} formas correctas.`, correctLabel: "Correctas",
    gamesHeader: "MINI-JUEGOS", memoryTitle: "Memory", memoryDesc: "Encuentra las parejas latín-español correspondientes",
    blitzTitle: "Ráfaga de Palabras", blitzDesc: "30 segundos — ¡tantas palabras como puedas!",
    learnMoreWords: "Aprende más palabras para desbloquear esto",
    memoryDone: "¡Listo!", movesNeeded: (n) => `${n} movimientos usados`, xpEarned: "XP ganados",
    playAgain: "JUGAR DE NUEVO", backToGames: "Volver a los juegos",
    points: "puntos", timeUp: "¡Se acabó el tiempo!", wordsCorrect: (n) => `${n} palabras correctas`,
    welcomeTitle: "¡Bienvenido, legionario!", newProfileTitle: "Nuevo perfil",
    onboardingSub: "Elige un apodo y empieza ya — totalmente gratis, sin nombre real.",
    nickname: "TU APODO", noRealNames: "⚠️ Por favor no uses tu nombre real.",
    avatarLabel: "AVATAR",
    classCodeOptionalLabel: "Código de clase", classCodeOptionalHint: "(opcional, puedes añadirlo más tarde)",
    classCodePlaceholder: "p. ej. 7A-Latín", classCodeHelp: "De tu profesor/a — todos con el mismo código se ven en la clasificación.",
    startFree: "EMPEZAR GRATIS", creating: "CREANDO …", cancel: "Cancelar",
    introTitle1: "¡Bienvenido a Lingua Latina!", introText1: "Aprende latín de forma divertida — con una ruta de aprendizaje, lecciones cortas y muchas recompensas.",
    introTitle2: "Ruta, Gramática y Vocabulario", introText2: "La ruta te guía paso a paso. Entrenadores extra para declinar, conjugar y vocabulario profundizan lo aprendido.",
    introTitle3: "XP, rachas e insignias", introText3: "Gana XP, mantén tu racha viva y compite contra tu clase en la clasificación con un apodo — sin nombre real.",
    introTitle4: "Juegos y frases diarias", introText4: "En cuanto tengas algunos puntos, te esperan Memory y Ráfaga de Palabras. Y cada día una nueva frase en latín para descifrar.",
    introNext: "SIGUIENTE", introGo: "¡EMPEZAMOS!", introSkip: "Omitir",
    profileTitle: "PERFIL", noClassYet: "Aún no estás en una clase",
    otherProfiles: "OTROS PERFILES EN ESTE DISPOSITIVO", addProfile: "CREAR NUEVO PERFIL",
    classSectionTitle: "CLASE",
    memberOfClass: (c) => `Eres miembro de la clase «${c}».`,
    leaveClass: "ABANDONAR CLASE",
    notInClassYet: "Aún no estás en una clase — únete a una para competir contra tus compañeros en la clasificación.",
    classCodeInputPlaceholder: "Introduce el código de clase", join: "UNIRSE",
    deviceSyncTitle: "SINCRONIZACIÓN",
    syncUnavailable: "La sincronización entre dispositivos no está disponible para este perfil (la nube no estaba disponible al crearlo).",
    syncCodeExplain: "Tu código — introdúcelo en otro dispositivo para cargar allí este perfil. Se emite un nuevo código automáticamente tras su uso.",
    copy: "COPIAR", copied: "¡COPIADO! ✓",
    enterCodeFromOther: "Introduce un código de otro dispositivo:", codePlaceholder: "Introduce el código", load: "CARGAR",
    sendFeedback: "ENVIAR COMENTARIOS", impressum: "Aviso legal", save: "GUARDAR",
    leaderboardTitle: "CLASIFICACIÓN",
    classLabel: (c) => `Clase «${c}»`,
    leaderboardNotSetUp: "Clasificación aún no configurada", askTeacher: "Pregunta a tu profesor/a si la conexión a la nube ya está activa.",
    noClassYetLb: "Aún no estás en una clase",
    noClassYetLbBody: "¡Ya puedes aprenderlo todo! Si quieres competir contra tu clase, únete con un código en tu perfil.",
    noClassmatesYet: "Aún no se han encontrado compañeros.",
    youLabel: "(Tú)", noClassConnected: "Ninguna clase conectada",
    feedbackTitle: "COMENTARIOS", feedbackSub: "¿Encontraste un error? ¿Una idea para una lección? ¡Cuéntanoslo!",
    catError: "Error", catIdea: "Idea", catOther: "Otro",
    feedbackPlaceholder: "¿Qué quieres decirnos?", sendByMail: "ENVIAR POR CORREO",
    feedbackHint: "Abre tu app de correo con el destinatario ya rellenado.",
    impressumTitle: "AVISO LEGAL", languageLabel: "IDIOMA",
    caseNominativ: "Nominativo", caseGenitiv: "Genitivo", caseDativ: "Dativo", caseAkkusativ: "Acusativo", caseAblativ: "Ablativo",
    tensePraesens: "Presente", tensePerfekt: "Perfecto", tenseImperfekt: "Imperfecto", tenseFutur: "Futuro",
    personIch: "yo", personDu: "tú", personErSieEs: "él/ella", personWir: "nosotros", personIhr: "vosotros", personSie: "ellos",
  },
};

function useTranslator(lang) {
  const dict = T[lang] || T.de;
  return function t(key, ...args) {
    const entry = dict[key] ?? T.de[key] ?? key;
    return typeof entry === "function" ? entry(...args) : entry;
  };
}

const CASE_KEY_MAP = { Nominativ: "caseNominativ", Genitiv: "caseGenitiv", Dativ: "caseDativ", Akkusativ: "caseAkkusativ", Ablativ: "caseAblativ" };
const TENSE_KEY_MAP = { Präsens: "tensePraesens", Perfekt: "tensePerfekt", Imperfekt: "tenseImperfekt", Futur: "tenseFutur" };
const PERSON_KEY_MAP = { "ich": "personIch", "du": "personDu", "er/sie/es": "personErSieEs", "wir": "personWir", "ihr": "personIhr", "sie": "personSie" };

function tCase(t, c) {
  return t(CASE_KEY_MAP[c] || c);
}
function tTense(t, tense) {
  return t(TENSE_KEY_MAP[tense] || tense);
}
function tPerson(t, p) {
  return t(PERSON_KEY_MAP[p] || p);
}


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
  { id: "v77", latin: "a/ab", german: "von", lessonId: "u13-l1" },
  { id: "v78", latin: "amatur", german: "wird geliebt", lessonId: "u13-l1" },
  { id: "v79", latin: "portare", german: "tragen", lessonId: "u13-l2" },
  { id: "v80", latin: "amatus", german: "geliebt", lessonId: "u14-l1" },
  { id: "v81", latin: "laetus", german: "fröhlich", lessonId: "u14-l2" },
  { id: "v82", latin: "pulchra", german: "schön", lessonId: "u14-l3" },
  { id: "v83", latin: "videre", german: "sehen", lessonId: "u15-l1" },
  { id: "v84", latin: "dicere", german: "sagen", lessonId: "u15-l1" },
  { id: "v85", latin: "qui", german: "der/welcher", lessonId: "u16-l1" },
  { id: "v86", latin: "quae", german: "die/welche", lessonId: "u16-l1" },
  { id: "v87", latin: "quod", german: "das/welches", lessonId: "u16-l1" },
  { id: "v88", latin: "hortari", german: "ermahnen", lessonId: "u17-l1" },
  { id: "v89", latin: "sequi", german: "folgen", lessonId: "u17-l1" },
  { id: "v90", latin: "loqui", german: "sprechen", lessonId: "u17-l1" },
  { id: "v91", latin: "conari", german: "versuchen", lessonId: "u17-l2" },
  { id: "v92", latin: "amaverat", german: "er/sie hatte geliebt", lessonId: "u18-l1" },
  { id: "v93", latin: "amaverit", german: "er/sie wird geliebt haben", lessonId: "u18-l2" },
  { id: "v94", latin: "melior", german: "besser", lessonId: "u19-l1" },
  { id: "v95", latin: "optimus", german: "der/die/das Beste", lessonId: "u19-l1" },
  { id: "v96", latin: "maior", german: "größer", lessonId: "u19-l1" },
  { id: "v97", latin: "longus", german: "lang", lessonId: "u19-l2" },
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
  { latin: "Dominus a servo vocatur.", german: "Der Herr wird vom Sklaven gerufen." },
  { latin: "Rosa a puella amatur.", german: "Die Rose wird von dem Mädchen geliebt." },
  { latin: "Puella amata laeta est.", german: "Das geliebte Mädchen ist fröhlich." },
  { latin: "Rosa amata pulchra est.", german: "Die geliebte Rose ist schön." },
  { latin: "Video servum dominum vocare.", german: "Ich sehe, dass der Sklave den Herrn ruft." },
  { latin: "Dico servum laborare.", german: "Ich sage, dass der Sklave arbeitet." },
  { latin: "Servus, qui laborat, bonus est.", german: "Der Sklave, der arbeitet, ist gut." },
  { latin: "Rex, qui urbem amat, bonus est.", german: "Der König, der die Stadt liebt, ist gut." },
  { latin: "Servus dominum sequitur.", german: "Der Sklave folgt dem Herrn." },
  { latin: "Rex populum hortatur.", german: "Der König ermahnt das Volk." },
  { latin: "Puella rosam amaverat.", german: "Das Mädchen hatte die Rose geliebt." },
  { latin: "Rex optimus est.", german: "Der König ist der beste." },
  { latin: "Via longior est.", german: "Der Weg ist länger." },
  { latin: "Servo vocato, dominus laetus est.", german: "Nachdem der Sklave gerufen worden war, ist der Herr froh." },
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

// HINWEIS: Es gibt bewusst keine client-seitige Sync-Code-Erzeugung mehr.
// Sync-Codes werden ausschliesslich serverseitig (RPC, pgcrypto) erzeugt und
// bei jeder Wiederherstellung rotiert - siehe supabase/migrations/.

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

// Schreibt Fortschritt (XP/Serie/abgeschlossene Lektionen/Vokabeln/Abzeichen) sicher über
// die RPC "update_player_progress". Diese prueft serverseitig den device_secret-Besitznachweis
// und plausibilisiert XP-/Serien-Sprünge, bevor irgendetwas in der Datenbank veraendert wird.
// Kein direkter Tabellenzugriff (kein .from("players").upsert(...)) mehr moeglich/noetig.
async function syncProgressToCloud(profile) {
  if (!supabase || !profile?.deviceSecret) return;
  try {
    const { error } = await supabase.rpc("update_player_progress", {
      p_id: profile.id,
      p_device_secret: profile.deviceSecret,
      p_xp: profile.xp,
      p_streak: profile.streak,
      p_completed_lessons: profile.completedLessons,
      p_vocab_progress: profile.vocabProgress,
      p_unlocked_badges: profile.unlockedBadges,
    });
    if (error) throw error;
  } catch (e) {
    console.warn("Cloud-Sync (Fortschritt) fehlgeschlagen", e);
  }
}

// Liest die Rangliste ausschliesslich ueber "leaderboard_view" (nicht die players-Tabelle).
// Diese View enthaelt bewusst NUR unkritische Spalten (id, alias, avatar, xp, streak) -
// device_secret, sync_code und Lernfortschritt sind darueber nie abrufbar.
async function fetchLeaderboard(classCode) {
  if (!supabase || !classCode) return [];
  try {
    const { data, error } = await supabase
      .from("leaderboard_view")
      .select("id, alias, avatar, xp, streak")
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

function BottomNav({ screen, setScreen, t }) {
  const items = [
    { id: "path", label: t("navPath"), icon: Map },
    { id: "grammar-home", label: t("navGrammar"), icon: LayoutGrid },
    { id: "vocab-home", label: t("navVocab"), icon: BookOpen },
    { id: "leaderboard", label: t("navLeaderboard"), icon: Trophy },
    { id: "profile", label: t("navProfile"), icon: User },
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
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("ll_lang") || detectDeviceLanguage();
    } catch {
      return detectDeviceLanguage();
    }
  });
  const t = useTranslator(lang);
  function changeLang(code) {
    setLang(code);
    try {
      localStorage.setItem("ll_lang", code);
    } catch {}
  }
  const [profiles, setProfiles] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [addingProfile, setAddingProfile] = useState(false);
  const [onboardingBusy, setOnboardingBusy] = useState(false);

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
      let introSeen = false;
      try {
        introSeen = localStorage.getItem("ll_intro_seen") === "1";
      } catch {}
      setScreen(introSeen ? "onboarding" : "intro");
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
    return updated;
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

    const updatedProfile = persistProfile({
      xp: totalXp,
      streak: newStreak,
      lastActiveDate: todayStr(),
      completedLessons: [...nextCompleted],
      unlockedBadges: [...nextBadges],
    });
    syncProgressToCloud(updatedProfile);

    setScreen("summary");
  }

  // Legt ein Profil an. Wenn Cloud-Sync verfuegbar ist, laeuft ALLES ueber die RPC
  // "create_player_profile" (Server generiert device_secret + sync_code kryptografisch
  // sicher und validiert Spitzname/Avatar/Klassencode serverseitig). Ohne Cloud-Konfiguration
  // faellt die App auf ein rein lokales Profil zurueck (keine Rangliste/kein Sync moeglich).
  async function createProfile({ classCodeInput, alias, avatar }) {
    setOnboardingBusy(true);
    let remote = null;
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc("create_player_profile", {
          p_alias: alias.trim(),
          p_avatar: avatar,
          p_class_code: classCodeInput?.trim() || null,
        });
        if (error) throw error;
        remote = Array.isArray(data) ? data[0] : data;
      } catch (e) {
        console.warn("Profil konnte nicht in der Cloud angelegt werden, lokal fortfahren.", e);
      }
    }

    const newProfile = remote
      ? {
          id: remote.id,
          deviceSecret: remote.device_secret,
          classCode: remote.class_code || "",
          classCodeDisplay: classCodeInput?.trim() || "",
          alias: remote.alias,
          avatar: remote.avatar,
          xp: remote.xp || 0,
          streak: remote.streak || 0,
          lastActiveDate: null,
          completedLessons: remote.completed_lessons || [],
          unlockedBadges: remote.unlocked_badges || [],
          vocabProgress: remote.vocab_progress || {},
          syncCode: remote.sync_code,
        }
      : {
          id: uuid(),
          deviceSecret: uuid(),
          classCode: classCodeInput?.trim().toLowerCase() || "",
          classCodeDisplay: classCodeInput?.trim() || "",
          alias: alias.trim(),
          avatar,
          xp: 0,
          streak: 0,
          lastActiveDate: null,
          completedLessons: [],
          unlockedBadges: [],
          vocabProgress: {},
          syncCode: null,
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
    setOnboardingBusy(false);
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

  async function updateActiveAliasAvatar(alias, avatar) {
    const before = active;
    persistProfile({ alias, avatar });
    if (supabase && before?.deviceSecret) {
      try {
        const { error } = await supabase.rpc("update_player_identity", {
          p_id: before.id,
          p_device_secret: before.deviceSecret,
          p_alias: alias,
          p_avatar: avatar,
        });
        if (error) throw error;
      } catch (e) {
        console.warn("Profil-Update in der Cloud fehlgeschlagen", e);
      }
    }
  }

  // Registriert ein bisher rein lokales Profil nachtraeglich in der Cloud
  // (fuer den Fall, dass Supabase beim Anlegen noch nicht eingerichtet war).
  // Bestehender Fortschritt bleibt erhalten - er wird nach der Registrierung
  // direkt mit hochgeladen.
  async function retryCloudRegistration() {
    if (!supabase || !active || active.syncCode) return { ok: false, msg: "Nicht möglich." };
    try {
      const { data, error } = await supabase.rpc("create_player_profile", {
        p_alias: active.alias,
        p_avatar: active.avatar,
        p_class_code: active.classCodeDisplay || null,
      });
      if (error) throw error;
      const remote = Array.isArray(data) ? data[0] : data;
      const oldId = active.id;
      const updated = {
        ...active,
        id: remote.id,
        deviceSecret: remote.device_secret,
        syncCode: remote.sync_code,
      };
      const nextList = profiles.map((p) => (p.id === oldId ? updated : p));
      setProfiles(nextList);
      saveProfilesLS(nextList);
      setActiveId(remote.id);
      saveActiveIdLS(remote.id);
      await syncProgressToCloud(updated);
      return { ok: true, msg: "Cloud-Sync eingerichtet! Dein Fortschritt ist jetzt gesichert." };
    } catch (e) {
      return { ok: false, msg: "Hat noch nicht geklappt. Ist die Supabase-Migration schon ausgeführt?" };
    }
  }

  async function joinClass(codeInput) {
    if (!active) return { ok: false, msg: "Kein Profil aktiv." };
    const code = codeInput.trim();
    if (!code) return { ok: false, msg: "Bitte einen Klassencode eingeben." };
    if (!supabase) {
      persistProfile({ classCode: code.toLowerCase(), classCodeDisplay: code });
      return { ok: true, msg: "Klasse lokal gespeichert (ohne Cloud-Sync)." };
    }
    try {
      const { data, error } = await supabase.rpc("join_class", {
        p_id: active.id,
        p_device_secret: active.deviceSecret,
        p_class_code: code,
      });
      if (error) throw error;
      persistProfile({ classCode: data, classCodeDisplay: code });
      return { ok: true, msg: `Klasse „${code}“ beigetreten!` };
    } catch (e) {
      return { ok: false, msg: "Beitreten fehlgeschlagen. Prüfe den Code." };
    }
  }

  async function leaveClass() {
    if (!active) return;
    persistProfile({ classCode: "", classCodeDisplay: "" });
    if (supabase && active.deviceSecret) {
      try {
        const { error } = await supabase.rpc("leave_class", {
          p_id: active.id,
          p_device_secret: active.deviceSecret,
        });
        if (error) throw error;
      } catch (e) {
        console.warn("Klasse verlassen (Cloud) fehlgeschlagen", e);
      }
    }
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
            syncProgressToCloud(persistProfile({ xp: totalXp }));
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
      syncProgressToCloud(persistProfile({ xp: totalXp }));
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

  // Stellt ein Profil per Sync-Code wieder her. Laeuft ausschliesslich ueber die RPC
  // "restore_profile_by_sync_code": sie liefert device_secret + Lernstand NUR bei
  // exaktem Code-Treffer zurueck und rotiert den Code danach sofort (Einmal-Verwendung -
  // ein mitgehoerter/kopierter alter Code funktioniert danach nicht mehr).
  async function loadProfileFromSyncCode() {
    const code = syncCodeInput.trim().toUpperCase();
    if (!code) return;
    if (!supabase) {
      setSyncStatus({ ok: false, msg: "Cloud-Sync ist nicht eingerichtet." });
      return;
    }
    setSyncStatus({ ok: null, msg: "Suche Profil …" });
    try {
      const { data, error } = await supabase.rpc("restore_profile_by_sync_code", { p_sync_code: code });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) {
        setSyncStatus({ ok: false, msg: "Code ungültig oder bereits verwendet." });
        return;
      }
      const restored = {
        id: row.id,
        deviceSecret: row.device_secret,
        classCode: row.class_code || "",
        classCodeDisplay: row.class_code || "",
        alias: row.alias,
        avatar: row.avatar,
        xp: row.xp || 0,
        streak: row.streak || 0,
        lastActiveDate: todayStr(),
        completedLessons: row.completed_lessons || [],
        unlockedBadges: row.unlocked_badges || [],
        vocabProgress: row.vocab_progress || {},
        syncCode: row.sync_code,
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
      setSyncStatus({ ok: true, msg: `Profil „${restored.alias}“ geladen! Der alte Code ist jetzt ungültig.` });
      setSyncCodeInput("");
      setTimeout(() => setScreen("path"), 1400);
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
      syncProgressToCloud(persistProfile({ xp: totalXp }));
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
      syncProgressToCloud(persistProfile({ xp: totalXp, vocabProgress }));
      setScreen("vocab-summary");
    }
  }

  if (screen === "loading") return null;

  /* -------------------------------- INTRO / WILLKOMMENS-TOUR -------------------------------- */

  if (screen === "intro") {
    return (
      <IntroScreen
        onFinish={() => {
          try {
            localStorage.setItem("ll_intro_seen", "1");
          } catch {}
          setScreen("onboarding");
        }}
      />
    );
  }

  /* -------------------------------- ONBOARDING -------------------------------- */

  if (screen === "onboarding") {
    return (
      <OnboardingScreen
        onCreate={createProfile}
        onCancel={addingProfile ? () => { setAddingProfile(false); setScreen("profile"); } : null}
        busy={onboardingBusy}
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
                  <div className="text-[10px] text-[#8B5CF6] mt-0.5 italic font-semibold">{t("appTagline")}</div>
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
                  {rank.current.title.toUpperCase()} · {t(rank.current.subKey)}
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
                  title={t(b.descKey)}
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
            <DailySentenceCard revealed={dailyRevealed} onToggle={() => setDailyRevealed((r) => !r)} t={t} />
          </div>

          <div className="relative px-4 pt-2">
            {UNITS.map((unit, uIdx) => (
              <div key={unit.id} className="relative">
                <UnitBanner unit={unit} completed={completed} gradient={UNIT_GRADIENTS[uIdx % UNIT_GRADIENTS.length]} t={t} />
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
        <BottomNav screen={screen} setScreen={setScreen} t={t} />
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
          <h1 className="font-display text-lg text-[#2B241D] mb-1">{t("vocabTitle")}</h1>
          <p className="text-[13px] text-[#8A7F68] mb-5">{t("vocabSub")}</p>

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <SummaryStat label={t("dueToday")} value={dueVocab.length} color="#EC4899" />
            <SummaryStat label={t("learned")} value={availableVocab.length} color="#8B5CF6" />
            <SummaryStat label={t("mastered")} value={masteredVocabCount} color="#F59E0B" />
          </div>

          {/* Karteikasten-Training */}
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={17} color="#8B5CF6" />
              <div className="font-display text-[13px] text-[#2B241D]">{t("srsTitle")}</div>
            </div>
            <p className="text-[12px] text-[#8A7F68] mb-3">{t("srsSub")}</p>
            {availableVocab.length === 0 ? (
              <div className="text-[12px] text-[#8A7F68] py-1">{t("finishFirstLesson")}</div>
            ) : dueVocab.length === 0 ? (
              <div className="text-[12px] text-[#8A7F68] py-1">{t("allLearnedToday")}</div>
            ) : (
              <button
                onClick={startVocabTraining}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white font-display text-xs tracking-wide shadow-md"
              >
                {t("startTraining", Math.min(dueVocab.length, 10))}
              </button>
            )}
          </div>

          {/* Frei entdecken */}
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={17} color="#3B82F6" />
              <div className="font-display text-[13px] text-[#2B241D]">{t("exploreTitle")}</div>
            </div>
            <p className="text-[12px] text-[#8A7F68] mb-3">{t("exploreSub", VOCAB_POOL.length)}</p>
            <button
              onClick={() => {
                setExploreIdx(0);
                setExploreFlipped(false);
                setScreen("vocab-explore");
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2EC4B6] text-white font-display text-xs tracking-wide shadow-md"
            >
              {t("exploreStart")}
            </button>
          </div>

          {/* Spiele */}
          <div className="glass rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={17} color="#F59E0B" />
              <div className="font-display text-[13px] text-[#2B241D]">{t("gamesTitle")}</div>
            </div>
            {gamesUnlocked ? (
              <>
                <p className="text-[12px] text-[#8A7F68] mb-3">{t("gamesSub")}</p>
                <button
                  onClick={() => setScreen("games-home")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EC4899] text-white font-display text-xs tracking-wide shadow-md"
                >
                  {t("gamesGo")}
                </button>
              </>
            ) : (
              <div className="text-[12px] text-[#8A7F68] py-1">{t("gamesLocked", xp)}</div>
            )}
          </div>

          {availableVocab.length > 0 && (
            <>
              <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">{t("myWords")}</div>
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
        <BottomNav screen={screen} setScreen={setScreen} t={t} />
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
                  <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-3">{t("latin")}</div>
                  <div className="font-serif-latin italic text-4xl text-[#2B241D] text-center">{word.latin}</div>
                </>
              ) : (
                <>
                  <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-3">DEUTSCH</div>
                  <div className="font-display text-3xl text-[#2B241D] text-center">{word.german}</div>
                </>
              )}
              <div className="text-[11px] text-[#A79A7E] mt-5">{t("tapToFlip")}</div>
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
              {t("back")}
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
              {q.direction === "latin-de" ? `${t("latin")} → DEUTSCH` : `DEUTSCH → ${t("latin")}`}
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
                    {vocabIsCorrect ? t("right") : t("rightAnswerWas", q.options[q.correctIndex])}
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
                  {t("check")}
                </button>
              ) : (
                <button
                  onClick={handleVocabContinue}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-md ${
                    vocabIsCorrect ? "bg-gradient-to-r from-[#2EC4B6] to-[#0E9E85] text-white" : "bg-gradient-to-r from-[#E8483A] to-[#B4291D] text-white"
                  }`}
                >
                  {t("continueBtn")} <ArrowRight size={16} />
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
            {t("continueBtn")}
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
          <h1 className="font-display text-lg text-[#2B241D] mb-1">{t("grammarTitle")}</h1>
          <p className="text-[13px] text-[#8A7F68] mb-5">{t("grammarSub")}</p>

          <button
            onClick={startDeclensionTraining}
            disabled={availableNouns.length === 0 || availableCases.length === 0}
            className="w-full glass rounded-2xl p-5 mb-4 text-left flex items-center gap-4 disabled:opacity-50"
          >
            <div className="glossy w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
              <LayoutGrid size={24} color="white" />
            </div>
            <div>
              <div className="font-display text-[14px] text-[#2B241D] mb-0.5">{t("declineTitle")}</div>
              <div className="text-[12px] text-[#8A7F68]">
                {availableNouns.length === 0 ? t("declineLocked") : t("declineSub")}
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
              <div className="font-display text-[14px] text-[#2B241D] mb-0.5">{t("conjugateTitle")}</div>
              <div className="text-[12px] text-[#8A7F68]">
                {availableVerbs.length === 0 ? t("conjugateLocked") : t("conjugateSub")}
              </div>
            </div>
          </button>

          {availableNouns.length > 0 && (
            <>
              <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">{t("nounsLookup")}</div>
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
                              <span className="text-[#8A7F68]">{tCase(t, c)}</span>
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
              <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">{t("verbsLookup")}</div>
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
                          {tensesForVerb.map((tense) => (
                            <div key={tense} className="mb-2 last:mb-0">
                              <div className="text-[10px] tracking-widest text-[#C2185B] font-bold mb-1">{tTense(t, tense).toUpperCase()}</div>
                              <div className="grid grid-cols-2 gap-1.5">
                                {PERSONS.filter((p) => v.tenses[tense][p]).map((p) => (
                                  <div key={p} className="flex justify-between text-[12px] bg-white/40 rounded-lg px-2.5 py-1.5">
                                    <span className="text-[#8A7F68]">{tPerson(t, p)}</span>
                                    <span className="font-serif-latin italic text-[#2B241D]">{v.tenses[tense][p]}</span>
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
        <BottomNav screen={screen} setScreen={setScreen} t={t} />
      </div>
    );
  }

  /* -------------------------------- GRAMMAR QUIZ -------------------------------- */

  if (screen === "grammar-quiz" && grammarRound[grammarIdx]) {
    const q = grammarRound[grammarIdx];
    const promptTitle =
      grammarMode === "declension" ? t("declineHeader", tCase(t, q.targetCase)) : t("conjugateHeader", tTense(t, q.targetTense), tPerson(t, q.targetPerson));
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
                    {grammarIsCorrect ? t("right") : t("rightAnswerWas", q.options[q.correctIndex])}
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
                  {t("check")}
                </button>
              ) : (
                <button
                  onClick={handleGrammarContinue}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-md ${
                    grammarIsCorrect ? "bg-gradient-to-r from-[#2EC4B6] to-[#0E9E85] text-white" : "bg-gradient-to-r from-[#E8483A] to-[#B4291D] text-white"
                  }`}
                >
                  {t("continueBtn")} <ArrowRight size={16} />
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
            {grammarMode === "declension" ? t("declinedWell") : t("conjugatedWell")}
          </h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">
            {t("formsCorrect", grammarCorrectCount, grammarRound.length)}
          </p>

          <div className="w-full grid grid-cols-2 gap-3 mb-8">
            <SummaryStat label={t("xp")} value={`+${grammarXpEarned}`} color="#F59E0B" />
            <SummaryStat label={t("correctLabel")} value={grammarCorrectCount} color="#0E9E85" />
          </div>

          <button
            onClick={() => setScreen("grammar-home")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-display text-sm tracking-wide mt-auto shadow-md"
          >
            {t("continueBtn")}
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
            <h1 className="font-display text-lg text-[#2B241D]">{t("gamesHeader")}</h1>
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
              <div className="font-display text-[14px] text-[#2B241D] mb-0.5">{t("memoryTitle")}</div>
              <div className="text-[12px] text-[#8A7F68]">
                {availableVocab.length < 3 ? t("learnMoreWords") : t("memoryDesc")}
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
              <div className="font-display text-[14px] text-[#2B241D] mb-0.5">{t("blitzTitle")}</div>
              <div className="text-[12px] text-[#8A7F68]">
                {availableVocab.length < 4 ? t("learnMoreWords") : t("blitzDesc")}
              </div>
            </div>
          </button>
        </div>
        <BottomNav screen="vocab-home" setScreen={setScreen} t={t} />
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
            <div className="flex-1 text-center font-display text-sm text-[#2B241D]">🧠 {t("memoryTitle")}</div>
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
              <h1 className="font-display text-xl text-[#2B241D] mb-1">{t("memoryDone")}</h1>
              <p className="text-[13px] text-[#8A7F68] mb-6">{t("movesNeeded", memoryMoves)}</p>
              <div className="w-full grid grid-cols-1 gap-3 mb-8">
                <SummaryStat label={t("xpEarned")} value={`+${memoryXpEarned}`} color="#F59E0B" />
              </div>
              <button
                onClick={startMemoryGame}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-display text-sm tracking-wide shadow-md mb-3"
              >
                {t("playAgain")}
              </button>
              <button onClick={() => setScreen("games-home")} className="text-[#8A7F68] text-[13px] underline">
                {t("backToGames")}
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
            <div className="flex-1 text-center font-display text-sm text-[#2B241D]">⚡ {t("blitzTitle")}</div>
            <div className="text-[13px] font-bold text-[#EC4899] w-[40px] text-right">{blitzTimeLeft}s</div>
          </div>

          {!blitzDone ? (
            <>
              <div className="h-2 rounded-full bg-[#F0DFC0] overflow-hidden mb-6">
                <div className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EC4899] transition-all" style={{ width: `${(blitzTimeLeft / 30) * 100}%` }} />
              </div>
              <div className="text-center mb-6">
                <span className="font-display text-2xl text-[#2B241D]">{blitzScore}</span>
                <span className="text-[12px] text-[#8A7F68]"> {t("points")}</span>
              </div>
              {blitzQuestion && (
                <>
                  <div className="text-[11px] tracking-widest text-[#C2185B] font-bold mb-2 text-center">
                    {blitzQuestion.direction === "latin-de" ? `${t("latin")} → DEUTSCH` : `DEUTSCH → ${t("latin")}`}
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
              <h1 className="font-display text-xl text-[#2B241D] mb-1">{t("timeUp")}</h1>
              <p className="text-[13px] text-[#8A7F68] mb-6">{t("wordsCorrect", blitzScore)}</p>
              <div className="w-full grid grid-cols-1 gap-3 mb-8">
                <SummaryStat label={t("xpEarned")} value={`+${blitzXpEarned}`} color="#F59E0B" />
              </div>
              <button
                onClick={startBlitzGame}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#EC4899] text-white font-display text-sm tracking-wide shadow-md mb-3"
              >
                {t("playAgain")}
              </button>
              <button onClick={() => setScreen("games-home")} className="text-[#8A7F68] text-[13px] underline">
                {t("backToGames")}
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

  /* -------------------------------- IMPRESSUM -------------------------------- */

  if (screen === "impressum") {
    return (
      <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
        <FontImport />
        <BackgroundBlobs />
        <div className="w-full max-w-md min-h-screen px-5 pt-6 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setScreen("profile")} className="text-[#8A7F68]">
              <X size={22} />
            </button>
            <h1 className="font-display text-lg text-[#2B241D]">IMPRESSUM</h1>
          </div>

          <div className="glass rounded-2xl p-5 mb-4">
            <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-2">ANGABEN GEMÄSS § 5 TMG</div>
            <p className="text-[14px] text-[#2B241D] leading-relaxed">
              [Vor- und Nachname einfügen]
              <br />
              [Straße und Hausnummer einfügen]
              <br />
              [PLZ und Ort einfügen]
            </p>
          </div>

          <div className="glass rounded-2xl p-5 mb-4">
            <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-2">KONTAKT</div>
            <p className="text-[14px] text-[#2B241D]">E-Mail: Dominik@hoferer.me</p>
          </div>

          <div className="glass rounded-2xl p-5 mb-4">
            <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-2">VERANTWORTLICH FÜR DEN INHALT (§ 18 ABS. 2 MSTV)</div>
            <p className="text-[14px] text-[#2B241D]">[Name wie oben einfügen]</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-2">HINWEIS</div>
            <p className="text-[13px] text-[#6B5F4E] leading-relaxed">
              Dies ist ein privates, nicht-kommerzielles Lernprojekt für den Schulgebrauch. Die vorstehenden Angaben sind
              Platzhalter und müssen vom Betreiber vor Veröffentlichung mit den echten Daten ausgefüllt werden.
            </p>
          </div>
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
                      {isCorrect ? t("correctFeedback") : t("incorrectFeedback")}
                    </div>
                    {!isCorrect && (
                      <div className="text-[13px] text-[#6B5F4E] mt-0.5">
                        {t("correctAnswerIs")}{" "}
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
                  {t("continueBtn")} <ArrowRight size={16} />
                </button>
              ) : !checked ? (
                <button
                  onClick={handleCheck}
                  disabled={!canCheck()}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide transition-all ${
                    canCheck() ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white shadow-md" : "bg-[#E4D7BA] text-[#A79A7E] cursor-not-allowed"
                  }`}
                >
                  {t("check")}
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide flex items-center justify-center gap-2 shadow-md ${
                    isCorrect ? "bg-gradient-to-r from-[#2EC4B6] to-[#0E9E85] text-white" : "bg-gradient-to-r from-[#E8483A] to-[#B4291D] text-white"
                  }`}
                >
                  {t("continueBtn")} <ArrowRight size={16} />
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
          <h1 className="font-display text-2xl text-[#2B241D] mb-2">{t("noHeartsTitle")}</h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">
            {t("noHeartsBody", currentLesson.title)}
          </p>
          <button
            onClick={retryLesson}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white font-display text-sm tracking-wide flex items-center justify-center gap-2 mb-3 shadow-md"
          >
            <RotateCcw size={16} /> {t("retry")}
          </button>
          <button onClick={() => setScreen("path")} className="text-[#8A7F68] text-[13px] underline">
            {t("backToPath")}
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
            {perfect ? t("perfectTitle") : t("goodTitle")}
          </h1>
          <p className="text-[#6B5F4E] text-[14px] mb-8">{perfect ? t("perfectSub") : t("goodSub")}</p>

          <div className="w-full grid grid-cols-3 gap-3 mb-6">
            <SummaryStat label={t("xp")} value={`+${animatedXp}`} color="#F59E0B" />
            <SummaryStat label={t("accuracy")} value={`${accuracy}%`} color="#0E9E85" />
            <SummaryStat label={t("streakLabel")} value={streak} color="#FF7A1A" />
          </div>

          {streakMilestone && (
            <div className="w-full mb-6 rounded-xl px-4 py-3 flex items-center gap-3 shadow-md animate-pop-in" style={{ background: "linear-gradient(135deg, #FF7A1A, #E8483A)" }}>
              <PartyPopper size={22} color="white" />
              <div className="text-white">
                <div className="font-display text-sm">{t("streakMilestone", newStreakValue)}</div>
                <div className="text-[12px] opacity-90">{t("streakMilestoneSub")}</div>
              </div>
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="w-full mb-8">
              <div className="text-[11px] tracking-widest text-[#8A7F68] font-bold mb-3">{t("newBadgeTitle")}</div>
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
                      <div className="text-[12px] text-[#6B5F4E]">{t(b.descKey)}</div>
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
            {t("continueBtn")}
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
              <div className="text-[11px] text-[#8A7F68]">
                {active?.classCodeDisplay ? `Klasse „${active.classCodeDisplay}“` : "Keine Klasse verbunden"}
              </div>
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

            {cloudEnabled && !active?.classCodeDisplay && (
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">🏆</div>
                <div className="font-display text-sm text-[#2B241D] mb-1.5">Noch in keiner Klasse</div>
                <div className="text-[13px] text-[#8A7F68] leading-relaxed">
                  Du kannst schon jetzt alles lernen! Wenn du gegen deine Klasse antreten willst, tritt einfach im{" "}
                  <span className="font-semibold text-[#C2185B]">Profil</span> mit einem Code bei.
                </div>
              </div>
            )}

            {cloudEnabled && active?.classCodeDisplay && !leaderboardLoading && leaderboardRows.length === 0 && (
              <div className="glass rounded-2xl p-5 text-center text-[13px] text-[#8A7F68]">
                Noch keine Mitspieler in dieser Klasse gefunden.
              </div>
            )}

            {cloudEnabled && active?.classCodeDisplay && (
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
        <BottomNav screen={screen} setScreen={setScreen} t={t} />
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
        onJoinClass={joinClass}
        onRetryCloud={retryCloudRegistration}
        onLeaveClass={leaveClass}
        t={t}
        lang={lang}
        onChangeLang={changeLang}
      />
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* ONBOARDING */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* INTRO / WILLKOMMENS-TOUR */
/* ------------------------------------------------------------------ */

const INTRO_SLIDES = [
  {
    emoji: "🏛️",
    gradient: "linear-gradient(135deg, #FF4FA3, #8B5CF6)",
    title: "Willkommen bei Lingua Latina!",
    text: "Lerne Latein spielerisch — mit einem Lernpfad, kleinen Häppchen und jeder Menge Belohnungen.",
  },
  {
    emoji: "📚",
    gradient: "linear-gradient(135deg, #3B82F6, #2EC4B6)",
    title: "Pfad, Grammatik & Vokabeln",
    text: "Der Lernpfad führt dich Schritt für Schritt. Extra-Trainer für Deklinieren, Konjugieren und Vokabeln vertiefen, was du gelernt hast.",
  },
  {
    emoji: "🔥",
    gradient: "linear-gradient(135deg, #F59E0B, #EC4899)",
    title: "XP, Serien & Abzeichen",
    text: "Sammle XP, halte deine Serie am Leben und tritt mit einem Spitznamen gegen deine Klasse in der Rangliste an — ganz ohne echten Namen.",
  },
  {
    emoji: "🎮",
    gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
    title: "Spiele & tägliche Sätze",
    text: "Ab ein paar gesammelten Punkten warten Memory & Wortblitz. Und jeden Tag gibt's einen neuen lateinischen Satz zum Knacken.",
  },
];

function IntroScreen({ onFinish }) {
  const [idx, setIdx] = useState(0);
  const slide = INTRO_SLIDES[idx];
  const isLast = idx === INTRO_SLIDES.length - 1;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
      <FontImport />
      <BackgroundBlobs />
      <div className="w-full max-w-md min-h-screen flex flex-col px-8 pt-16 pb-10">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="glossy w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-8 animate-pop-in" style={{ background: slide.gradient }} key={idx}>
            {slide.emoji}
          </div>
          <h1 className="font-display text-2xl text-[#2B241D] mb-3">{slide.title}</h1>
          <p className="text-[14px] text-[#6B5F4E] leading-relaxed">{slide.text}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {INTRO_SLIDES.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6]" : "w-2 bg-[#DCCFA9]"}`} />
          ))}
        </div>

        <button
          onClick={() => (isLast ? onFinish() : setIdx((i) => i + 1))}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white font-display text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
        >
          {isLast ? "LOS GEHT'S!" : "WEITER"} <ArrowRight size={16} />
        </button>
        {!isLast && (
          <button onClick={onFinish} className="text-[#8A7F68] text-[12px] underline mt-4">
            Überspringen
          </button>
        )}
      </div>
    </div>
  );
}

function OnboardingScreen({ onCreate, onCancel, busy }) {
  const [classOpen, setClassOpen] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [alias, setAlias] = useState(() => generateAlias());
  const [avatar, setAvatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);

  const canSubmit = alias.trim().length > 0 && !busy;

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
          Wähle einen Spitznamen und leg direkt los — komplett kostenlos, ganz ohne echten Namen.
        </p>

        <label className="text-[12px] font-bold text-[#6B5F4E] mb-1.5">DEIN SPITZNAME</label>
        <div className="flex gap-2 mb-1">
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Spitzname"
            maxLength={24}
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
        <p className="text-[11px] text-[#A79A7E] mb-5">⚠️ Bitte keinen echten Namen verwenden.</p>

        <label className="text-[12px] font-bold text-[#6B5F4E] mb-2">AVATAR</label>
        <div className="grid grid-cols-6 gap-2 mb-6">
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
          onClick={() => setClassOpen((o) => !o)}
          className="flex items-center justify-between w-full px-1 py-2 mb-2"
        >
          <span className="text-[12px] font-bold text-[#6B5F4E]">
            Klassencode <span className="font-normal text-[#A79A7E]">(optional, geht auch später)</span>
          </span>
          <ChevronDown size={16} color="#8A7F68" className={`transition-transform ${classOpen ? "rotate-180" : ""}`} />
        </button>
        {classOpen && (
          <div className="mb-3 animate-pop-in">
            <input
              value={classCodeInput}
              onChange={(e) => setClassCodeInput(e.target.value)}
              placeholder="z. B. 7A-Latein"
              maxLength={40}
              className="w-full px-4 py-3.5 rounded-xl glass text-[#2B241D] text-[15px] mb-1 focus:outline-none focus:border-[#EC4899]"
            />
            <p className="text-[11px] text-[#A79A7E]">Von deiner Lehrkraft — alle mit demselben Code sehen sich in der Rangliste.</p>
          </div>
        )}

        <button
          onClick={() => canSubmit && onCreate({ classCodeInput, alias, avatar })}
          disabled={!canSubmit}
          className={`w-full py-3.5 rounded-xl font-display text-sm tracking-wide mt-auto shadow-md ${
            canSubmit ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white" : "bg-[#E4D7BA] text-[#A79A7E] cursor-not-allowed"
          }`}
        >
          {busy ? "WIRD ANGELEGT …" : "KOSTENLOS LOSLEGEN"}
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
  onJoinClass,
  onRetryCloud,
  onLeaveClass,
  t,
  lang,
  onChangeLang,
}) {
  const [editing, setEditing] = useState(false);
  const [alias, setAlias] = useState(active.alias);
  const [avatar, setAvatar] = useState(active.avatar);
  const [classInput, setClassInput] = useState("");
  const [classBusy, setClassBusy] = useState(false);
  const [classMsg, setClassMsg] = useState(null);

  const others = profiles.filter((p) => p.id !== active.id);
  const changed = alias !== active.alias || avatar !== active.avatar;

  async function handleJoinClass() {
    setClassBusy(true);
    const res = await onJoinClass(classInput);
    setClassMsg(res);
    setClassBusy(false);
    if (res.ok) setClassInput("");
  }

  async function handleLeaveClass() {
    setClassBusy(true);
    await onLeaveClass();
    setClassMsg(null);
    setClassBusy(false);
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#FFF6E9]">
      <FontImport />
      <BackgroundBlobs />
      <div className="w-full max-w-md min-h-screen pb-28 px-5 pt-6">
        <h1 className="font-display text-lg text-[#2B241D] mb-5">{t("profileTitle")}</h1>

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
              <div className="text-[12px] text-[#8A7F68]">
                {active.classCodeDisplay ? t("classLabel", active.classCodeDisplay) : t("noClassYet")}
              </div>
              <div className="text-[11px] font-bold text-[#C2185B] mt-0.5">
                {rank.current.title.toUpperCase()} · {t(rank.current.subKey)}
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
                {t("save")}
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2.5">
            <SummaryStat label={t("xp")} value={xp} color="#F59E0B" />
            <SummaryStat label={t("streakLabel")} value={streak} color="#FF7A1A" />
            <SummaryStat label={t("badgesTitle")} value={unlockedBadges.size} color="#0E9E85" />
          </div>
        </div>

        <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">{t("badgesTitle")}</div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {BADGES.map((b) => {
            const on = unlockedBadges.has(b.id);
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                title={t(b.descKey)}
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
            <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">{t("otherProfiles")}</div>
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
                    <div className="text-[11px] text-[#8A7F68]">{t("classLabel", p.classCodeDisplay)} · {p.xp} XP</div>
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
          <Plus size={16} /> {t("addProfile")}
        </button>

        <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">{t("classSectionTitle")}</div>
        {active.classCodeDisplay ? (
          <div className="glass rounded-2xl p-5 mb-6">
            <p className="text-[12px] text-[#8A7F68] mb-3">
              {t("memberOfClass", active.classCodeDisplay)}
            </p>
            <button
              onClick={handleLeaveClass}
              disabled={classBusy}
              className="w-full py-3 rounded-xl border-2 border-[#E8483A]/40 text-[#B4291D] font-display text-xs tracking-wide"
            >
              {t("leaveClass")}
            </button>
          </div>
        ) : (
          <div className="glass rounded-2xl p-5 mb-6">
            <p className="text-[12px] text-[#8A7F68] mb-3">
              {t("notInClassYet")}
            </p>
            <div className="flex items-center gap-2">
              <input
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                placeholder={t("classCodeInputPlaceholder")}
                maxLength={40}
                className="flex-1 px-3.5 py-3 rounded-xl glass text-[#2B241D] text-[15px] focus:outline-none"
              />
              <button
                onClick={handleJoinClass}
                disabled={classBusy || classInput.trim().length === 0}
                className={`px-4 py-3 rounded-xl font-display text-[11px] tracking-wide shrink-0 ${
                  classInput.trim().length > 0 ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white" : "bg-[#E4D7BA] text-[#A79A7E]"
                }`}
              >
                {t("join")}
              </button>
            </div>
            {classMsg && (
              <p className={`text-[12px] mt-2.5 ${classMsg.ok ? "text-[#0E9E85]" : "text-[#B4291D]"}`}>{classMsg.msg}</p>
            )}
          </div>
        )}

        <div className="mb-2 text-[11px] tracking-widest text-[#8A7F68] font-bold">{t("deviceSyncTitle")}</div>
        {!active.syncCode ? (
          <div className="glass rounded-2xl p-5 mb-6">
            <p className="text-[12px] text-[#8A7F68] mb-3">
              {t("syncUnavailable")}
            </p>
            {supabase && (
              <button
                onClick={async () => {
                  setClassBusy(true);
                  const res = await onRetryCloud();
                  setClassMsg(res);
                  setClassBusy(false);
                }}
                disabled={classBusy}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2EC4B6] text-white font-display text-xs tracking-wide"
              >
                🔄 JETZT ERNEUT VERSUCHEN
              </button>
            )}
            {classMsg && (
              <p className={`text-[12px] mt-2.5 ${classMsg.ok ? "text-[#0E9E85]" : "text-[#B4291D]"}`}>{classMsg.msg}</p>
            )}
          </div>
        ) : (
          <div className="glass rounded-2xl p-5 mb-4">
            <p className="text-[12px] text-[#8A7F68] mb-3">
              {t("syncCodeExplain")}
            </p>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 glass-strong rounded-xl py-3 text-center font-display text-base tracking-[0.15em] text-[#2B241D]">
                {active.syncCode}
              </div>
              <button
                onClick={onCopySyncCode}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2EC4B6] text-white font-display text-[11px] tracking-wide shrink-0"
              >
                {syncCopyLabel}
              </button>
            </div>
          </div>
        )}

        <div className="glass rounded-2xl p-5 mb-6">
          <p className="text-[12px] text-[#8A7F68] mb-3">{t("enterCodeFromOther")}</p>
          <div className="flex items-center gap-2">
            <input
              value={syncCodeInput}
              onChange={(e) => setSyncCodeInput(e.target.value.toUpperCase())}
              placeholder={t("codePlaceholder")}
              maxLength={10}
              className="flex-1 px-3.5 py-3 rounded-xl glass text-[#2B241D] text-[15px] tracking-[0.1em] text-center focus:outline-none"
            />
            <button
              onClick={onLoadSyncCode}
              disabled={syncCodeInput.trim().length === 0}
              className={`px-4 py-3 rounded-xl font-display text-[11px] tracking-wide shrink-0 ${
                syncCodeInput.trim().length > 0 ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white" : "bg-[#E4D7BA] text-[#A79A7E]"
              }`}
            >
              {t("load")}
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
          className="w-full py-3.5 rounded-xl glass text-[#2B241D] font-display text-xs tracking-wide flex items-center justify-center gap-2 mb-3"
        >
          ✉️ {t("sendFeedback")}
        </button>

        <button onClick={() => setScreen("impressum")} className="w-full text-center text-[#A79A7E] text-[12px] underline py-2">
          {t("impressum")}
        </button>

        <div className="mb-2 mt-4 text-[11px] tracking-widest text-[#8A7F68] font-bold text-center">{t("languageLabel")}</div>
        <div className="flex gap-1.5 justify-center flex-wrap">
          {SUPPORTED_LANGS.map((code) => (
            <button
              key={code}
              onClick={() => onChangeLang(code)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${
                lang === code ? "bg-gradient-to-r from-[#FF4FA3] to-[#8B5CF6] text-white" : "glass text-[#8A7F68]"
              }`}
            >
              {LANG_NAMES[code]}
            </button>
          ))}
        </div>
      </div>
      <BottomNav screen={screen} setScreen={setScreen} t={t} />
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

function DailySentenceCard({ revealed, onToggle, t }) {
  const sentence = useMemo(() => getDailySentence(), []);
  return (
    <button onClick={onToggle} className="w-full glass rounded-2xl px-5 py-4 mb-4 text-left">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={15} color="#F59E0B" />
        <div className="text-[11px] tracking-widest text-[#C2185B] font-bold">{t("dailySentenceTitle")}</div>
      </div>
      <div className="font-serif-latin italic text-[18px] text-[#2B241D] mb-1">{sentence.latin}</div>
      {revealed ? (
        <div className="text-[13px] text-[#8A7F68]">{sentence.german}</div>
      ) : (
        <div className="text-[12px] text-[#A79A7E]">{t("tapToTranslate")}</div>
      )}
    </button>
  );
}

function UnitBanner({ unit, completed, gradient, t }) {
  const done = unit.lessons.filter((l) => completed.has(l.id)).length;
  return (
    <div className="rounded-2xl px-5 py-4 my-4 shadow-md" style={{ background: gradient }}>
      <div className="text-[10px] tracking-widest text-white/80 font-bold mb-1">
        {done}/{unit.lessons.length} {t("lessonsOf")}
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
