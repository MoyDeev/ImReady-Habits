# Tecnologías usadas

> Versiones tomadas de [`package.json`](../package.json), [`app.json`](../app.json)
> y [`eas.json`](../eas.json). Manténlas sincronizadas si cambian.

## Núcleo

| Tecnología | Versión | Para qué |
|------------|---------|----------|
| Expo SDK | `~57.0.8` | Framework y tooling de la app. |
| React | `19.2.3` | Librería base de UI. |
| React Native | `0.86.0` | Runtime móvil nativo. |
| TypeScript | `~6.0.3` | Tipado estático (modo **strict**). |
| expo-router | `~57.0.8` | Navegación por archivos (rutas tipadas). |

## Expo / nativo

| Paquete | Versión | Uso |
|---------|---------|-----|
| expo-notifications | `~57.0.7` | Recordatorios locales (permisos, canal Android, schedule/cancel). |
| @react-native-async-storage/async-storage | `2.2.0` | Persistencia local de todo el estado. |
| @react-native-community/datetimepicker | `9.1.0` | Selector de hora de los hábitos. |
| expo-constants | `~57.0.7` | Constantes del entorno/app. |
| expo-device | `~57.0.1` | Detección de dispositivo (permisos de notificaciones). |
| expo-linking | `~57.0.4` | Deep links / scheme `imreadyhabits`. |
| expo-status-bar | `~57.0.1` | Barra de estado adaptada al tema. |
| expo-system-ui | `~57.0.1` | Color de fondo del sistema. |

## UI y gestos

| Paquete | Versión | Uso |
|---------|---------|-----|
| @expo/vector-icons | `^15.0.2` | Iconos (Ionicons) del dock y las secciones. |
| react-native-gesture-handler | `~2.32.0` | Gestos (base de `SwipeNavigator`). |
| react-native-reanimated | `4.5.0` | Animaciones. |
| react-native-worklets | `0.10.0` | Worklets requeridos por Reanimated 4. |
| react-native-safe-area-context | `~5.7.0` | Insets seguros (dock, FAB). |
| react-native-screens | `~4.26.0` | Pantallas nativas para la navegación. |

> **No hay librería de componentes de UI.** Todo se construye con `View`/`Pressable`
> y un tema propio ([`src/theme.ts`](../src/theme.ts) + [`src/useTheme.ts`](../src/useTheme.ts)),
> con soporte claro/oscuro automático.

## Configuración de la app (`app.json`)

- Nombre visible: **Im Ready** · slug: `imready-habits` · versión `1.0.0`.
- `scheme`: `imreadyhabits` · `userInterfaceStyle`: `automatic` (claro/oscuro).
- `newArchEnabled: true` (Nueva Arquitectura de RN).
- `bundleIdentifier` iOS y `package` Android: `com.moydeev.imreadyhabits`.
- Plugins: `expo-router` y `expo-notifications` (color de acento `#7C5CFF`).
- `experiments.typedRoutes: true` (rutas tipadas).
- Splash `#0E0E12`.

## Builds (`eas.json`)

- **development** — cliente de desarrollo, distribución interna.
- **preview** — genera un **APK** instalable (distribución interna). Es el perfil para
  probar recordatorios en Android real.
- **production** — `autoIncrement` de versión.

## Persistencia

- AsyncStorage bajo la clave `imready-habits/state/v1`
  ([`src/storage.ts`](../src/storage.ts)), con migración de esquema v1 → v2 al cargar.

## Scripts (`package.json`)

`start` (`expo start`), `android` (`expo run:android`), `ios` (`expo run:ios`),
`web` (`expo start --web`).

> ⚠️ **Recuerda:** el asistente de IA **no ejecuta** estos scripts ni ningún comando;
> los corre el usuario. Ver [reglas.md](reglas.md).
