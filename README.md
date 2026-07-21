# Explorador técnico de Tules ITF

[![Next.js](https://img.shields.io/badge/Next.js-16.2.11-000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149eca?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Deploy](https://github.com/MAlexVR/itf-tul-graph/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/MAlexVR/itf-tul-graph/actions/workflows/deploy-pages.yml)

Aplicación pública, estática y responsive para explorar el inventario técnico de
Taekwon-Do ITF desde Saju Jirugi hasta Choong-Moo.

## Qué ofrece

- 2 figuras básicas, 9 tules, 273 movimientos y 78 técnicas canónicas.
- Filtros desplegables para figura, tipo técnico, técnica y terminología
  (coreano, español o ambos), pensados para aprendizaje guiado.
- Tarjetas interactivas de categoría con el conteo de técnicas canónicas:
  Makgi/defensa, Jirugi/ataque de puño, Taerigi/golpe, Tulgi/estocada,
  Chagi/patada y otras técnicas o transiciones.
- Secuencias numeradas, posturas completas de inicio/finalización y colores por
  familia técnica: defensa, puñetazo, golpe, estocada, patada u otra.
- Significados oficiales de cada figura según el **Manual de Teoría y Programa
  Técnico de Taekwon-Do ITF de la Asociación Colombiana de Taekwon-Do ITF**,
  consultado mediante el cuaderno NotebookLM del propietario del proyecto.
- Diseño mobile-first y accesible, sin bases de datos, cookies, analítica ni
  credenciales expuestas.

## Arquitectura

El proyecto usa Next.js 16 con App Router, React 19, TypeScript estricto,
Tailwind CSS 4 y exportación estática. La interfaz sigue una composición
atómica:

```text
atoms/       Badge, StatCard, SelectField
molecules/   PatternCard, TechniqueRow
organisms/   Explorer (estado, filtros y composición)
lib/         tipos y significados oficiales
data/        inventario público estático del grafo
```

Los datos son una instantánea pública sin secretos, generada a partir del grafo
de conocimiento de la tesis. Esta aplicación no modifica ni se conecta al
Neo4j local.

## Desarrollo

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev
```

Verificación de producción:

```bash
npm run lint
npm run build
```

`npm run build` genera el sitio en `out/`. El flujo de GitHub Actions lo
publica en GitHub Pages al hacer push a `main`.

### Vercel

El proyecto está listo para importarse directamente en Vercel: detecte el
framework **Next.js**, conserve los comandos predeterminados (`npm run build` y
`next start`) y no defina variables de entorno. El favicon propio está en
`src/app/icon.svg`; Next.js lo sirve automáticamente en desarrollo, producción
y despliegues de Vercel.

## Alcance y fuentes

La terminología técnica en español se normalizó conforme al manual de la
Asociación Colombiana de Taekwon-Do ITF. La secuencia técnica es material de
consulta académica; antes de utilizarla para enseñanza o evaluación debe ser
revisada por un instructor ITF competente.

El repositorio no contiene el PDF/cuaderno privado de NotebookLM ni archivos
de la tesis. Solo incluye datos técnicos publicados para la visualización.

## Licencia

Pendiente de definición por el titular. Los nombres, significados y
terminología de Taekwon-Do ITF se incluyen con fines educativos y de consulta.
