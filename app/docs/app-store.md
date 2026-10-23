# App Store und TestFlight: Checkliste

Stand: Phase B abgeschlossen. **Nichts davon ist ausgeführt.** Jeder Schritt braucht deine ausdrückliche Zustimmung, weil er Geld kostet oder nicht umkehrbar ist.

## 0. Vorab klären

- [ ] Endgültige Bundle-ID festlegen. Im Projekt steht `com.example.lerntok` (Platzhalter) in `app.config.ts` unter `ios.bundleIdentifier`.
- [ ] Anzeigename „LernTok“ prüfen (Markenrecht und Namensverfügbarkeit im App Store).
- [ ] Apple Developer Program (kostenpflichtig, jährlich). Ohne Mitgliedschaft kein TestFlight.
- [ ] Entscheidung, ob ein Konto für Apple Developer auf eine Firma (informatiq-consulting) läuft.

## 1. Apple Developer und App Store Connect

- [ ] App in App Store Connect anlegen (Neue App, Plattform iOS, Bundle-ID, SKU).
- [ ] Bundle-ID im Developer-Portal registrieren, Capabilities: Sign in with Apple, In-App Purchase, Push Notifications.
- [ ] Paid-Apps-Vertrag, Steuer- und Bankdaten im App Store Connect unterschreiben. **Ohne diesen Vertrag sind keine Abos möglich.**
- [ ] Abo-Gruppe „pro“ anlegen mit den Produkten `pro_yearly` und `pro_semester`. Preise festlegen.
- [ ] Sandbox-Tester anlegen (Benutzer und Access, Sandbox), für Testkäufe ohne echtes Geld.

## 2. RevenueCat

- [ ] Projekt in RevenueCat anlegen, iOS-App mit Bundle-ID verknüpfen.
- [ ] App-Store-Connect-Schlüssel (In-App-Purchase-Key) in RevenueCat hinterlegen.
- [ ] Entitlement `pro` anlegen, mit `pro_yearly` und `pro_semester` verknüpfen.
- [ ] Offering `default` anlegen, Pakete `pro_yearly` und `pro_semester` darin.
- [ ] Öffentlichen iOS-SDK-Schlüssel in `EXPO_PUBLIC_REVENUECAT_IOS_KEY` eintragen (nicht den Secret-Key).

## 3. EAS Build und Submit

- [ ] EAS-Konto anlegen, `eas login`, `eas init` (setzt die `projectId`).
- [ ] Development-Build: `eas build --profile development --platform ios` (**kostet Cloud-Build-Kontingent**, erst nach Freigabe).
- [ ] Preview-Build für TestFlight-Tests: `eas build --profile preview --platform ios`.
- [ ] Production-Build: `eas build --profile production --platform ios`.
- [ ] Apple-Zugangsdaten für EAS (Apple-ID, App-spezifisches Passwort oder API-Key), im EAS-Dashboard hinterlegen.
- [ ] TestFlight-Upload: `eas submit --profile production --platform ios` (**lädt in App Store Connect hoch, nicht umkehrbar**, erst nach Freigabe).

## 4. TestFlight

- [ ] Build in App Store Connect unter TestFlight auf Verarbeitung prüfen (Export-Compliance: `ITSAppUsesNonExemptEncryption` ist auf `false` gesetzt).
- [ ] Interne Tester hinzufügen (bis 100, sofort verfügbar).
- [ ] Externe Tester: einmalige Beta-Prüfung durch Apple, Beschreibung und Kontakt angeben.

## 5. Store-Eintrag und Screenshots

- [ ] Screenshots: mindestens 6,9-Zoll-iPhone (1290 × 2796 px) und optional 6,5-Zoll. Die Screens aus dem Simulator eignen sich als Entwurf.
- [ ] App-Beschreibung, Schlagwörter, Support-URL und Marketing-URL.
- [ ] Altersfreigabe-Fragebogen ausfüllen.
- [ ] Kategorie (z. B. Bildung).

## 6. Datenschutz und Rechtliches

- [ ] Datenschutz-Angaben (App Privacy) in App Store Connect: Kontaktdaten, Nutzerinhalte (Lernmaterial, Clips), Nutzungsdaten, Kaufhistorie.
- [ ] Datenschutzerklärung und Nutzungsbedingungen veröffentlichen. Die App verlinkt auf `/legal/privacy` und `/legal/terms`, die Texte sind noch Platzhalter.
- [ ] Impressum (Pflicht in Deutschland, §5 DDG).
- [ ] Auftragsverarbeitungsverträge mit Supabase, Mux, RevenueCat und dem KI-Anbieter abschließen.

## 7. Vor der Einreichung prüfen (App Review)

- [ ] Sign in with Apple ist oben auf dem Login (4.8). Google-Login ist nur zusätzlich.
- [ ] Konto löschen in der App erreichbar (5.1.1(v)): Einstellungen → Konto löschen.
- [ ] Melden und Blockieren für nutzergenerierte Inhalte (1.2): Melden-Sheet am Clip, Blockieren im Sheet.
- [ ] Abos laufen über In-App-Kauf (3.1.1). Die App enthält **keinen** Hinweis und **keinen** Link auf andere Zahlungswege.
- [ ] „Käufe wiederherstellen“ ist sichtbar (Paywall und Mein Abo).
- [ ] Clips sind standardmäßig privat, Teilen in Gruppe oder öffentlich nur mit Rechte-Bestätigung.
- [ ] Demo-Zugang für den Reviewer: Testkonto mit Login und, falls nötig, Sandbox-Abo beschreiben.

## 8. Einreichung

- [ ] Versionsnummer und Build prüfen.
- [ ] Release-Notizen auf Deutsch.
- [ ] **Einreichen zur Prüfung** erst nach ausdrücklicher Freigabe. Danach ist der Schritt nicht zurücknehmbar.
