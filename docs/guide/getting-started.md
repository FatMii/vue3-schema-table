# 快速开始

## 安装

```bash
# 使用 pnpm
pnpm add @vue3-schema-table/core

# 使用 npm
npm install @vue3-schema-table/core

# 使用 yarn
yarn add @vue3-schema-table/core
```

## 依赖

Vue3 Schema Table 采用**零依赖**设计，只需要 Vue 3：

- `vue` >= 3.3.0（必需）

### 安装依赖

```bash
# 安装 Vue 3
pnpm add vue@^3.3.0
```

### 引入样式

在你的 `main.ts` 中引入组件库样式：

```typescript
import { createApp } from 'vue'
import '@vue3-schema-table/core/style' // 引入样式
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

### 主题定制

组件库提供了完整的 CSS 变量系统，你可以轻松自定义主题：

```css
/* 在你的全局样式中覆盖变量 */
:root {
  --vst-primary-color: #409eff; /* Element Plus 蓝色 */
  --vst-border-radius: 4px;
}
```

或者使用预设主题：

```vue
<template>
  <div class="vst-theme-element">
    <DynamicTable :data="data" :schema="schema" />
  </div>
</template>
```

## 基础用法

```vue
<template>
  <DynamicTable :data="tableData" :schema="tableSchema" :height="600" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicTable } from '@vue3-schema-table/core'
import type { TableSchema } from '@vue3-schema-table/core'

const tableData = ref([
  { id: 1, name: '张三', age: 25, status: 'active' },
  { id: 2, name: '李四', age: 30, status: 'inactive' },
])

const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
    { key: 'age', title: '年龄', dataIndex: 'age', width: 100 },
    { key: 'status', title: '状态', dataIndex: 'status', width: 100 },
  ],
}
</script>
```

