# Summary 12-01: Shared Design Tokens And Typography

## Shipped

- Added `src/design/system.ts` as the shared design-system source for spacing, radius, typography, layout, shadows, and navigation font definitions
- Refined `ThemeContext` colors so both dark and light modes use cleaner, more professional surface neutrals while preserving EveryBible's accent red
- Moved `RootNavigator` onto the shared navigation typography instead of ad hoc `System` font declarations

## Verification

- `node --test --import tsx src/design/designSystemSource.test.ts`
- `npm run lint -- src/design/system.ts src/contexts/ThemeContext.tsx src/navigation/RootNavigator.tsx src/design/designSystemSource.test.ts`
- `npm run typecheck`
