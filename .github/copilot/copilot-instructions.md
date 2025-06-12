# GitHub Copilot Instructions for SagaEditorWeb

## Project Overview

SagaEditorWeb is a web-based editor for creating and managing saga campaigns. It's built with React and uses Material UI for the component library. The application allows users to create, edit, and manage campaign missions.

## Project Structure

- `src/`: Main source code
  - `components/`: React components organized by functionality
    - `CampaignManager/`: Components related to campaign management
    - `Dialogs/`: Reusable dialog components
    - `EventActionDialogs/`: Dialogs for event and action management
    - `MapComponents/`: Components for map rendering and interaction
    - `Panels/`: Panel components for the application
    - `SubComponents/`: Smaller, reusable components
  - `data/`: JSON data files and data management
  - `hooks/`: Custom React hooks
  - `lib/`: Utility libraries

## Coding Standards and Preferences

### React Component Style

- Functional components with hooks are preferred over class components
- Component files should be named using PascalCase
- Export components as default when they are the main component in a file

### State Management

- Use React's built-in state management (useState, useContext) for component-level state
- Consider data flow and state locality when designing components

### Styling

- Material UI (MUI) is the primary component library
- Custom styles should be applied using MUI's styling system

### JavaScript/JSX Style

- Use ES6+ features when appropriate
- Prefer destructuring for props and state
- Use JSX for rendering components
- Keep components focused on a single responsibility

### File Organization

- Keep related files together
- Group components by feature or functionality
- Place utility functions in appropriate locations

## Common Patterns

### Dialog Components

Dialog components typically:

- Accept an open/close state
- Have a standardized way to be shown (often using a static method)
- Include appropriate actions (buttons)
- Handle callbacks for completion

### Data Management

- Data is typically loaded from JSON files
- Components may use a centralized data store for shared state

## Dependencies

- React
- Material UI
- Additional dependencies can be found in package.json

## Specific Guidance

- When suggesting new components, follow the existing component structure
- Use the established dialog pattern for new dialogs
- Maintain consistent error handling and user feedback
- Consider performance implications for operations on large data sets
