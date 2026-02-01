# 基础用法

最简单的表格使用示例。

## 基础表格

```vue
<template>
  <DynamicTable :data="tableData" :schema="tableSchema" :height="600" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicTable } from '@vue3-schema-table/core'
import type { TableSchema } from '@vue3-schema-table/core'

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' },
])

const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
    { key: 'age', title: '年龄', dataIndex: 'age', width: 100 },
    { key: 'email', title: '邮箱', dataIndex: 'email', width: 200 },
  ],
}
</script>
```

## 禁用虚拟滚动

当数据量较小时，可以禁用虚拟滚动：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
  ],
  table: {
    virtualScroll: false, // 禁用虚拟滚动
  },
}
</script>
```

## 自定义行高

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
  ],
  table: {
    rowHeight: 50, // 设置行高为 50px
  },
}
</script>
```

## 列对齐

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100, align: 'left' },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150, align: 'center' },
    { key: 'age', title: '年龄', dataIndex: 'age', width: 100, align: 'right' },
  ],
}
</script>
```

