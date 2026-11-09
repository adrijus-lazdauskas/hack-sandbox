# Lernkarten – Idee in einer Seite

## Problem

Studierende lernen für Klausuren oft mit Karteikarten. Papierkarten gehen verloren, und große Apps wollen ein Konto, sind überladen oder kosten Geld. Wer schnell 30 Begriffe aus dem Skript abfragen will, braucht etwas, das sofort funktioniert.

## Zielgruppe

Studierende, die kurz vor einer Klausur Begriffe, Definitionen oder Vokabeln lernen. Sie haben ihre Fragen schon irgendwo als Text (Skript, Notizen, Tabelle) und wollen sie ohne Abtippen in Karten verwandeln.

## Demo in fünf Schritten

1. **Stapel anlegen:** „Makroökonomie – Klausur“ erstellen.
2. **Karten importieren:** Fünf Zeilen `Frage;Antwort` aus den Notizen einfügen, die App zeigt sofort, wie viele Karten erkannt wurden.
3. **Abfragen:** Karte ansehen, umdrehen, „gewusst“ oder „nicht gewusst“ wählen.
4. **Ergebnis sehen:** Nach der Runde steht da, wie viele Karten sitzen.
5. **Fortschritt pro Stapel:** Zurück in der Übersicht zeigt jeder Stapel seinen Fortschritt, auch nach dem Neuladen der Seite.

## Kernfunktionen

**Muss**

- Stapel anlegen, umbenennen, löschen
- Karte mit Frage und Antwort hinzufügen
- Import aus Text: eine Karte pro Zeile, `Frage;Antwort`, fehlerhafte Zeilen werden angezeigt
- Abfrage-Modus: Karte umdrehen, „gewusst“ / „nicht gewusst“
- Fortschritt pro Stapel (Anteil gewusster Karten)
- Speicherung im Browser (localStorage), kein Login, kein Server

**Kann**

- Nur die „nicht gewussten“ Karten noch einmal abfragen
- Karten bearbeiten und löschen
- Tastenkürzel im Abfrage-Modus (Leertaste, J, N)
- Export eines Stapels als Text
- Beispielstapel beim ersten Start

## Was überzeugen soll

Es gibt keine Jury, es ist ein Testlauf. Trotzdem soll die Demo zeigen: In unter einer Minute vom eingefügten Text zur ersten Abfrage, ohne Anmeldung, auf Handy und Laptop.

## Rahmen

- Testlauf, also klein halten: eine Single-Page-Web-App, keine Pflicht-Technik
- Alles im Browser gespeichert, kein Backend, kein Login
- Läuft als statische Seite auf GitHub Pages unter einem Unterpfad
- Oberfläche auf Deutsch, funktioniert auf Handy- und Desktopbreite
