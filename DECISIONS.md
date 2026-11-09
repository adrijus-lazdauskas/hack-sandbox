# Entscheidungen

Was das Team entschieden hat. Neue Entscheidungen kommen oben dazu, mit Datum und Quelle.

## Design-Richtung: B „Kacheln“

*09.11.2026, Antwort von Adrijus auf [#13](https://github.com/adrijus-lazdauskas/hack-sandbox/issues/13): „Variante B“. Keine Änderungswünsche.*

Vorlage ist [`mockups/b.html`](mockups/b.html) ([Vorschau](https://adrijus-lazdauskas.github.io/hack-sandbox/mockups/b.html)). A und C bleiben in `mockups/` zum Nachschauen.

Was B ausmacht:

- **Stil:** dunkler Hintergrund, kräftige Farben, große Rundungen, fette Schrift. Handy zuerst, auf dem Desktop dasselbe Layout breiter.
- **Übersicht:** jeder Stapel ist eine farbige Kachel mit Name, Kartenzahl, Anzahl offener Karten und einem Fortschrittsring (Prozent gewusst). Die letzte Kachel ist „Neuer Stapel“.
- **Navigation:** Tab-Leiste mit „Stapel“ und „Fortschritt“, auf dem Handy unten, auf dem Desktop oben. Im Abfrage-Modus ist sie ausgeblendet.
- **Anlegen, Import, Karte hinzufügen:** als Bottom-Sheet über der aktuellen Ansicht. Beim Anlegen wählt man eine Farbe für den Stapel. Der Import zeigt live, wie viele Karten erkannt wurden und welche Zeilen übersprungen werden.
- **Stapel-Ansicht:** farbiger Kopf mit Fortschrittsbalken und Zahlen (gewusst, nicht gewusst, neu), großer Knopf „Jetzt lernen“, darunter die Karten mit Statuspunkt.
- **Abfrage-Modus:** Vollbild, große Karte in Stapelfarbe, Umdrehen per Tippen (3D-Drehung), danach „Nicht gewusst“ / „Gewusst“. Oben ein Punkt pro Karte, der grün oder rot wird.
- **Ergebnis:** großer Ring mit „x/y gewusst“, Knopf „nicht gewusste wiederholen“, zurück zum Stapel.
- **Fortschritt-Tab:** Summen über alle Stapel und pro Stapel ein Balken aus gewusst / nicht gewusst / neu.

## Produkt (Kickoff, 09.11.2026)

- Lernkarten-Web-App für Studierende, Brief in [`IDEA.md`](IDEA.md).
- Muss: Stapel anlegen, Karten mit Frage und Antwort, Abfrage-Modus mit „gewusst“ / „nicht gewusst“, Fortschritt pro Stapel, Import aus Text.
- **Import-Format:** eine Karte pro Zeile, `Frage;Antwort`. Getrennt wird am ersten `;`. Leere Zeilen werden ignoriert, Zeilen ohne `;` oder mit leerer Frage oder Antwort werden übersprungen und angezeigt.
- **Fortschritt** eines Stapels = Anteil der Karten, deren letzte Bewertung „gewusst“ ist. Karten ohne Bewertung zählen als „neu“.
- **Speicherung** nur im Browser (localStorage). Kein Login, kein Backend.
- Testlauf ohne Thema und ohne Jury, also klein halten. Keine Pflicht-Technik.
- Läuft als statische Seite auf GitHub Pages unter einem Unterpfad. Oberfläche auf Deutsch.

## Offene Fragen

- Soll es beim ersten Start einen Beispielstapel geben, damit die App nicht leer ist?
- Reicht der dunkle Stil, oder braucht es zusätzlich einen hellen Modus?
- Wie wichtig sind die Kann-Funktionen aus `IDEA.md` (Karten bearbeiten, Tastenkürzel, Export) für diesen Testlauf?
