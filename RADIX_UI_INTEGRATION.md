# Radix UI Integration Guide

This project now includes [Radix UI](https://www.radix-ui.com/) - a library of unstyled, accessible UI components for React.

## What's Included

### 1. Accordion Component
The user list now uses Radix UI's Accordion component for a better user experience:
- **Location**: `src/components/UserList.tsx`
- **Features**: 
  - Collapsible user details
  - Smooth animations
  - Keyboard accessible (Tab, Enter, Arrow keys)
  - Single item expansion

### 2. Dialog Component
A modal dialog for displaying information:
- **Location**: `src/components/WelcomeDialog.tsx`
- **Features**:
  - Modal overlay with backdrop
  - Focus trap (keyboard navigation stays within dialog)
  - ESC key to close
  - Click outside to close
  - Smooth fade-in animations

### 3. Icons
Using `@radix-ui/react-icons` for consistent iconography:
- ChevronDownIcon - Accordion expansion indicator
- Cross2Icon - Dialog close button

## Installed Packages

```json
{
  "@radix-ui/react-accordion": "^1.2.2",
  "@radix-ui/react-dialog": "^1.1.2",
  "@radix-ui/react-icons": "^1.3.2"
}
```

## Accessibility

All Radix UI components are built with accessibility in mind:
- ✅ ARIA attributes for screen readers
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Semantic HTML structure

## Animations

Custom CSS animations are defined in `src/app/globals.css`:
- `slideDown` / `slideUp` - For accordion content
- `fadeIn` / `contentShow` - For dialog modal

## Usage Examples

### Adding More Accordion Items

```tsx
import * as Accordion from '@radix-ui/react-accordion';

<Accordion.Root type="single" collapsible>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Trigger text</Accordion.Trigger>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Adding More Dialogs

```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## Styling

Radix UI components are unstyled by default, allowing full customization with:
- Tailwind CSS classes (current approach)
- CSS modules
- Styled-components
- Any CSS-in-JS solution

## Learn More

- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Radix UI GitHub](https://github.com/radix-ui/primitives)
- [Accessibility Features](https://www.radix-ui.com/primitives/docs/overview/accessibility)
