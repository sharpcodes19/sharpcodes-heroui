# HeroUI

A comprehensive React component library built on top of [HeroUI](https://heroui.com) with advanced form handling, data tables, and utility functions. Designed to streamline development with pre-configured, production-ready components.

## ✨ Features

- **Pre-built Form Fields** - Autocomplete, date pickers, number inputs, and more
- **Data Tables** - Advanced table component with pagination and empty states
- **Form Management** - Integrated with React Hook Form and Zod validation
- **Type-Safe** - Full TypeScript support with comprehensive type definitions
- **Next.js Support** - Axios clients for server and client-side operations
- **Utility Functions** - Date, form, and response handling utilities
- **Theme Support** - Built-in theming with CSS customization

## 📦 Installation

```bash
npm install sharpcodes-heroui
# or
yarn add sharpcodes-heroui
# or
bun add sharpcodes-heroui
```

### Peer Dependencies

This library requires the following peer dependencies:

```json
{
	"react": "^19.0.0",
	"react-dom": "^19.0.0",
	"@tanstack/react-query": "^5.0.0",
	"@tanstack/react-table": "^8.0.0",
	"@heroui/react": "^3.0.0"
}
```

Make sure these packages are installed in your project:

```bash
npm install react react-dom @tanstack/react-query @tanstack/react-table @heroui/react
```

## 🚀 Quick Start

### Import Components

```typescript
import { Button, AutoComplete, DateRangePicker, Table } from "sharpcodes-heroui"
```

### Use Form Fields

```typescript
import { DateField, InputField, AutoCompleteField } from 'sharpcodes-heroui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  birthDate: z.date(),
  country: z.string(),
});

export function MyForm() {
  const { control } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form>
      <InputField control={control} name="name" label="Name" />
      <DateField control={control} name="birthDate" label="Birth Date" />
      <AutoCompleteField control={control} name="country" label="Country" />
    </form>
  );
}
```

### Use Data Tables

```typescript
import { DataTable } from 'sharpcodes-heroui';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

export function MyTable() {
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
  ];

  const table = useReactTable({
    data: myData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
}
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── fields/         # UI field components (Button, Modal, Search, etc.)
│   ├── form-fields/    # Form-integrated components with react-hook-form
│   └── index.ts
├── libs/
│   ├── next/          # Next.js utilities (Axios clients)
│   ├── utils/         # Helper functions (date, form, response handling)
│   └── index.ts
├── styles/
│   ├── main.css       # Main styles
│   ├── theme.css      # Theme variables
│   └── index.ts
└── types/             # TypeScript type definitions
    ├── app.d.ts
    └── properties.d.ts
```

## 📚 Components

### Fields (`components/fields/`)

- **Button** - Customizable button component
- **Modal** - Modal dialog component
- **Autocomplete** - Autocomplete search field
- **DateRange** - Date range picker
- **Number** - Number input field
- **Search** - Search component
- **Tabs** - Tab navigation
- **Table** - Data table with pagination
- **Breadcrumbs** - Breadcrumb navigation
- **Scroll** - Scroll component

### Form Fields (`components/form-fields/`)

React Hook Form integrated components:

- **AutoCompleteField** - Form-connected autocomplete
- **DateField** - Form-connected date picker
- **DateRangeField** - Form-connected date range picker
- **InputField** - Form-connected text input
- **ErrorField** - Error message display
- **Field** - Base form field wrapper

## 🛠️ Utilities

### Date Utilities (`libs/utils/date.ts`)

Helper functions for date handling and formatting

### Form Utilities (`libs/utils/form.ts`)

Form validation and manipulation helpers

### Response Utilities (`libs/utils/response.ts`)

API response handling and normalization

## 🔧 Development

### Build

```bash
npm run build
# or
bun run build
```

The build outputs:

- **CJS** - CommonJS format: `dist/index.cjs.js`
- **ESM** - ES Module format: `dist/index.es.js`
- **Types** - TypeScript definitions: `dist/index.d.ts`

### Requirements

- **Node.js** >= 22
- **React** 19.x
- **TypeScript** 6.x

## 📋 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 Notes

- This is a pre-configured package maintained by SharpCodes
- All components are built with TypeScript for type safety
- The library uses Vite for fast builds and optimal tree-shaking
- Components follow HeroUI design patterns and conventions
