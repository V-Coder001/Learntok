# LernTok (iOS-App)

Expo-App mit Expo Router, TypeScript (strict) und React Native. Läuft im Simulator mit Mock-Daten.

## Start

```bash
npm install
npx expo start
```

Mock-Modus ist Standard. Ohne Netz und ohne Backend lässt sich alles durchklicken.

```bash
EXPO_PUBLIC_USE_MOCKS=true npx expo start   # Standard
EXPO_PUBLIC_USE_MOCKS=false npx expo start  # echte Dienste (noch nicht angebunden, Phase C)
```

Für native Module (Kamera, Dokumentauswahl, Apple-Login, RevenueCat) ist ein Development-Build nötig, Expo Go reicht nicht:

```bash
npx expo run:ios          # lokal mit Xcode
```

Den Cloud-Build (`eas build --profile development`) startest du nur nach Freigabe, er verbraucht Kontingent.

## Tests und Typprüfung

```bash
npx tsc --noEmit
npm test
```

## Aufbau

- `src/app`: Routen (Expo Router). Jede Datei ist ein Screen. `(tabs)` enthält die fünf Tabs.
- `src/components`: Bausteine (Button, Chip, Card, ListRow, Toggle, SegmentControl, Avatar, ProgressBar, Badge, BottomSheet, TabBar, ClipView, …).
- `src/theme.ts`: Design-Tokens. Screens nutzen keine festen Farben.
- `src/i18n/de.ts`: alle sichtbaren Texte.
- `src/services`: Interfaces (`types.ts`) und Umsetzungen. `mock/` für den Simulator, `real/` als Platzhalter.
- `src/store`: Zustand-Stores (Sitzung, Upload-Entwurf).
- `src/hooks/queries.ts`: react-query für Server-Daten.
- `app.config.ts`, `eas.json`: Build-Konfiguration. Bundle-ID ist ein Platzhalter.
- `docs/app-store.md`: Checkliste für App Store, TestFlight und Einreichung.

## Offene Punkte

- **Backend (Phase C):** Supabase (Auth, Postgres, Storage, Realtime), Mux, RevenueCat sind nur als Interfaces und Mocks umgesetzt. `src/services/real` wirft bis zur Anbindung.
- **Sign in with Apple:** Der Login ruft im Mock-Modus den Mock-Dienst. Die echte Anmeldung mit `expo-apple-authentication` kommt mit Phase C.
- **RevenueCat:** `react-native-purchases` hat kein Config-Plugin. Es wird per Autolinking eingebunden. Die SDK-Konfiguration (`Purchases.configure`) fehlt noch.
- **Bundle-ID:** `com.example.lerntok` ist ein Platzhalter.
- **Rechtstexte:** Datenschutz und Nutzungsbedingungen sind Platzhalter, Impressum fehlt.
- **Upload:** Dateien werden nur ausgewählt, nicht hochgeladen. Die KI-Erstellung ist ein Mock mit Fortschritt.
- **Live-Lernraum:** Teilnehmende und Timer sind Mock-Daten, kein Realtime.
- **Konto-Löschung und Blockieren:** wirken im Mock lokal, nicht auf dem Server.
- **Simulator-Durchlauf:** siehe Abschnitt unten.

## Store

Alle Schritte für App Store Connect, TestFlight und Einreichung stehen in [docs/app-store.md](docs/app-store.md). Nichts davon ist ausgeführt.
