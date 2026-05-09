# Agente Salud IA

Frontend Angular para el reto de hackathon: estimador agéntico de copago y cobertura para pacientes.

## Arquitectura

```text
src/app/
├── core/
│   ├── application/     # Casos de uso y servicios de presentación del dominio
│   ├── config/          # Tokens de configuración
│   └── domain/          # Entidades y contratos de repositorio
├── infrastructure/
│   ├── http/            # DTOs, mappers y repositorio FastAPI
│   └── mocks/           # Fallback demo para presentación
└── features/
    └── copay-assistant/ # Pantalla conversacional y resultado inteligente
```

## Integración con backend

El frontend consume:

```text
POST http://localhost:8000/api/care-estimates
```

Payload:

```json
{
  "document_number": "0922334455",
  "symptom_text": "Tengo dolor de garganta y fiebre."
}
```

Si el backend no responde, la UI activa datos demo para poder presentar el flujo completo.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
