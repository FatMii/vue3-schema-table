# Vue3 Schema Table

一个高性能、Schema 驱动的动态表格组件库，专为 Vue 3 设计。

## 特性

- 🚀 **高性能虚拟滚动** - 支持万级数据流畅渲染
- 📋 **Schema 驱动配置** - 通过 JSON Schema 轻松配置表格
- 🔧 **丰富的功能** - 排序、筛选、列宽调整、列固定、行选择
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎨 **灵活定制** - 支持自定义排序、筛选函数
- 📦 **TypeScript** - 完整的类型定义

## 快速开始

```bash
pnpm add @vue3-schema-table/core
```

```vue
<template>
  <DynamicTable :data="tableData" :schema="tableSchema" :height="600" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicTable } from '@vue3-schema-table/core'
import type { TableSchema } from '@vue3-schema-table/core'

const tableData = ref([
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
])

const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
    { key: 'age', title: '年龄', dataIndex: 'age', width: 100 },
  ],
}
</script>
```

## 文档

- [快速开始](/guide/getting-started)
- [API 文档](/api/)
- [示例](/examples/)

