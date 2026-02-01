# Vue3 Schema Table

一个高性能、Schema 驱动的动态表格组件库，专为 Vue 3 设计。

## 特性

- 🚀 **高性能虚拟滚动** - 支持万级数据流畅渲染
- 📋 **Schema 驱动配置** - 通过 JSON Schema 轻松配置表格
- 🔧 **丰富的功能** - 排序、筛选、列宽调整、列固定、行选择
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎨 **灵活定制** - 支持自定义排序、筛选函数
- 📦 **TypeScript** - 完整的类型定义
- 🧪 **测试覆盖** - 完善的单元测试

## 安装

### 安装组件库

```bash
pnpm add @vue3-schema-table/core
# 或
npm install @vue3-schema-table/core
# 或
yarn add @vue3-schema-table/core
```

### 安装依赖

本组件库只依赖 Vue 3，无需安装其他 UI 库：

```bash
# Vue 3（必需）
pnpm add vue@^3.3.0
```

### 引入样式

```typescript
// main.ts
import { createApp } from 'vue'
import '@vue3-schema-table/core/style' // 引入样式
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

## 快速开始

### 基础用法

```vue
<template>
  <DynamicTable :data="tableData" :schema="tableSchema" :height="600" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicTable } from '@vue3-schema-table/core'
import '@vue3-schema-table/core/style'

const tableData = ref([
  { id: 1, name: '张三', age: 25, department: '技术部' },
  { id: 2, name: '李四', age: 30, department: '产品部' },
  { id: 3, name: '王五', age: 28, department: '设计部' },
])

const tableSchema = {
  columns: [
    { 
      key: 'id', 
      title: 'ID', 
      dataIndex: 'id', 
      width: 100,
      fixed: 'left' // 固定左侧
    },
    { 
      key: 'name', 
      title: '姓名', 
      dataIndex: 'name', 
      width: 150,
      sortable: true, // 可排序
      filterable: true // 可筛选
    },
    { 
      key: 'age', 
      title: '年龄', 
      dataIndex: 'age', 
      width: 100,
      align: 'right' // 右对齐
    },
    { 
      key: 'department', 
      title: '部门', 
      dataIndex: 'department', 
      width: 150,
      fixed: 'right' // 固定右侧
    },
  ],
  table: {
    virtualScroll: true, // 启用虚拟滚动
    rowHeight: 40, // 行高
  },
}
</script>
```

### 功能特性

- ✅ **虚拟滚动** - 支持大数据量流畅渲染
- ✅ **列固定** - 支持左侧和右侧固定列
- ✅ **排序** - 支持单列和多列排序
- ✅ **筛选** - 支持多选筛选
- ✅ **列宽调整** - 支持拖拽调整列宽
- ✅ **行选择** - 支持单选和多选

## 文档

详细文档请访问：[文档站点](https://your-docs-site.com)

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 文档开发
pnpm docs:dev
```

## 许可证

MIT

