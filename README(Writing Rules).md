# coowners-mobile
Our new client wants to build a fractional ownership app where users can buy shares in real estate units. This includes a mobile app for users and an admin dashboard for backend operations. We will build it on top of our Brokers Hub infrastructure.


# 🧱 Code Writing Best Practices at DNAAYA

This document defines how we write clean, readable, maintainable, and scalable code at DNAAYA. It applies to all developers across stacks and project levels.

---

## 1. 🧠 Naming Conventions

### ✅ Variable & Function Naming
- Use **descriptive** names (`userList`, `calculateTotal`, `isValid`)
- **camelCase** for variables/functions: `userName`, `fetchOrders()`
- Avoid abbreviations: `tmp`, `val`, `u`, `svc`
- Booleans should sound like questions: `isEnabled`, `hasPermission`

### ✅ Class, File & Component Naming
- **PascalCase** for React components, classes, and some files: `UserProfile.jsx`
- File names should reflect contents (no `test1.js`, `utils2.ts`)
- Use **kebab-case** for backend files: `user-controller.js`, `order-routes.ts`

---

## 2. 📦 Functions & Methods

### ✅ Keep Functions Short and Focused
- One function = one job
- If it does more, split it

### ✅ Function Parameters
```ts
// ❌ Bad
function update(a, b, c) {...}

// ✅ Good
function updateUser({ userId, newData, notifyAdmin }) {...}
```

### ✅ Use Default Values
```js
function greet(name = "Guest") {
  console.log(`Hello, ${name}`);
}
```

---

## 3. 🧼 Code Formatting & Style

- Use our **Prettier** config for formatting
- Consistent indentation (2 spaces or tabs — follow project standard)
- Always use **braces** `{}` for conditionals
```js
if (user) {
  logout();
}
```
- Use semicolons if project config requires

---

## 4. 🔁 Loops & Conditions

### ✅ Prefer Built-in Methods
- Use `.map()`, `.filter()`, `.reduce()` instead of `for` loops

### ✅ Guard Clauses Over Nested Conditions
```ts
// ❌
if (user) {
  if (user.isActive) {
    sendWelcomeMessage();
  }
}

// ✅
if (!user || !user.isActive) return;
sendWelcomeMessage();
```

---

## 5. 🚨 Error Handling

- Always use try/catch around async logic
- Never swallow errors silently
```ts
try {
  await createInvoice(data);
} catch (error) {
  console.error("Failed to create invoice:", error);
  throw error;
}
```

---

## 6. 🧪 Commenting

- Comment **why**, not **what**
```js
// We subtract one to account for zero-based indexing
const lastItem = items[items.length - 1];
```
- Avoid redundant comments like `let i = 0; // initialize i`

---

## 7. 💡 Readability Over Cleverness

- Clear code beats smart code
- Your future self and your teammate should easily understand your work

---

## 8. 🧼 Remove Dead Code

- Delete unused vars, console logs, commented blocks
- Don’t leave dead code in PRs “just in case”

---

## 9. ✅ Before You Push

- [ ] Linter passed?
- [ ] Manual testing done?
- [ ] Tests added?
- [ ] Edge cases handled?
- [ ] Would you sign this with your name?

---

**This is not optional — it's how we build great software together at DNAAYA.**

