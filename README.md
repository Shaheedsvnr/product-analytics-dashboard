# Product Analytics Dashboard

A high-performance **Next.js + Zustand analytics dashboard** for product filtering, aggregation, and visualization.  
Designed with a strong focus on **scalability, performance optimization, and production-grade frontend architecture**.

---

## Overview

This project demonstrates a modern frontend architecture built with Next.js, emphasizing:

- Centralized state management using Zustand
- Derived selector-based data flow
- Pure functional filtering pipeline
- Memoized analytics computation layer
- Recharts-powered visualization layer
- Virtualized rendering for large datasets
- Unit-tested business logic using Vitest

The system is optimized for handling dynamic datasets while maintaining **predictable state transitions and efficient rendering performance**.

---

## Architecture

**State → Derived Layer → Logic Layer → Analytics Layer → UI → Visualization**

Zustand Store → useFilteredProducts → filterProducts → getAnalytics → Next.js UI → Recharts → Virtualized List

---

## Features

### Product System

- Multi-criteria filtering (search, category, price, rating)
- Case-insensitive search normalization
- Safe handling of undefined / empty datasets
- Deterministic AND-based filter composition

### Search System

- Debounced input handling (300ms)
- Local state buffering with global sync
- Input validation for performance safety
- Duplicate update prevention using refs

### Analytics Layer

- Total product aggregation
- Category distribution analysis
- Average price computation per category
- Top-performing category detection
- Highest-value category identification

### Visualization Layer

- Bar chart: Average price per category
- Pie chart: Category distribution
- Bar chart: Product count per category
- Memoized tooltip components for performance

### Virtualized Rendering

- High-performance list rendering using `react-virtuoso`
- Efficient rendering for large datasets
- Prevents DOM overload during heavy filtering
- Smooth scrolling with overscan optimization

---

## Performance Engineering

- `useMemo` for expensive aggregations
- `React.memo` for preventing unnecessary re-renders
- Derived state instead of duplicated store data
- Pure functions for deterministic computation
- Virtualized rendering for large datasets
- Controlled rendering via Zustand selectors

---

## Testing Strategy

Unit testing implemented using **Vitest**, focused on core business logic.

### Coverage Includes:

- Search-based filtering
- Category filtering
- Price range filtering
- Rating-based filtering
- Combined filter logic (AND conditions)
- Edge case handling (empty / undefined input)
- Case-insensitive normalization

### Result

- 9 unit tests validating filtering engine correctness

---

## Core Modules

### Zustand Store

Handles:

- Product state
- Filter state
- Loading state

---

### filterProducts (Core Engine)

A pure deterministic function responsible for:

- Text matching (case-insensitive)
- Category filtering
- Price range validation
- Rating threshold filtering
- Safe fallback handling

---

### getAnalytics (Aggregation Layer)

Transforms raw product data into structured insights:

- Category-level aggregation
- Statistical computations
- Chart-ready datasets

---

### Virtualized List (Performance Layer)

- Built using `react-virtuoso`
- Renders only visible DOM nodes
- Handles large datasets efficiently
- Improves scroll and filter performance significantly

---

### Search System

- Debounced input pipeline
- Local-to-global state synchronization
- Input throttling for performance stability

---

## Tech Stack

**Next.js (App Router)** • Zustand • Recharts • Vitest • React Virtuoso • Tailwind CSS • Iconify

---

## Key Engineering Decisions

- Separation of state, logic, and presentation layers
- Derived state model instead of duplicated store data
- Pure functional design for testability and predictability
- Virtualization for scalable rendering
- Debounced filtering for performance optimization
- Strict unidirectional data flow architecture

---

## Run Tests

```bash
npm run test
```

#### Setup Instructions

# 1. Clone the repository

git clone https://github.com/Shaheedsvnr/product-analytics-dashboard.git

# 2. Navigate into the project

cd product-analytics-dashboard

# 3. Install dependencies

npm install

# 4. Run development server

npm run dev

Build for production

npm run build
npm run start

#### Architecture Explanation

The system follows a layered, unidirectional data flow architecture:

#### Data Flow

- Zustand Store
  ↓
- Derived Selector Layer (useFilteredProducts)
  ↓
- Pure Logic Layer (filterProducts)
  ↓
- Analytics Layer (getAnalytics)
  ↓
- UI Components (Next.js)
  ↓
- Visualization Layer (Recharts)
  ↓
- Virtualized Rendering Layer

#### Performance Optimizations

The application is optimized for large-scale datasets (1000+ products) using:

## List Virtualization

- Only visible rows are rendered using react-virtuoso
- Prevents DOM overload and improves scroll performance

## Memoization Strategy

- useMemo for expensive analytics computations
- React.memo for preventing unnecessary re-renders

## Derived State Pattern

- Avoids duplicating filtered data in global state
- Uses selectors instead of store mutation

## Debounced Search Input

- Reduces state updates during typing
- Prevents excessive re-filtering

## Pure Function Architecture

- Filtering logic is completely stateless
- Enables predictable performance and easy testing

## Trade-offs

- Client-side filtering chosen for simplicity and responsiveness
- Not optimal for datasets beyond ~10k items
- Real-time updates simulated using setInterval
- Simpler than WebSocket-based architecture
- Slight memory overhead due to memoization
- Virtualization adds external dependency
