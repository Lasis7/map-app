# AwesomeApp123
A map app that loosely borrows the idea of Pokemon GO. Move to the randomly generated targets on the map to collect points. The name AwesomeApp123 is a placeholder name until I come up with an actual name.

## History
This app originally started as the final assignment for Mobileapp development course. Therefor it is a PWA-application with offline support. After the course I decided to continue working on this project on my freetime, so I made its own repository for it. There is no commit history for the app, so I will just list the rough changelog below

## Changelog
1. 6/2/2025 - v1.0
- Markers for the user and the target
- Hardcoded radius of 1-2km for testing
- Score view and two targets, target refresh and score reset -buttons
- Offline support with service workers, score and target is saved with localstorage
- Phone vibration when target is reached

2. 6/24/2025 - v1.1
- Settings-menu
- Slider for changing maximum radius of target generation
- Score reset-button moved to settings, also added a confirmation window









# AwesomeApp123

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.7.

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

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

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

