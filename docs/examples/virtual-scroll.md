# 虚拟滚动

虚拟滚动功能可以大幅提升大数据量表格的渲染性能。

## 启用虚拟滚动

默认情况下，虚拟滚动是启用的：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
  ],
  table: {
    virtualScroll: true, // 启用虚拟滚动（默认值）
  },
}
</script>
```

## 禁用虚拟滚动

当数据量较小时（< 100 行），可以禁用虚拟滚动：

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

## 调整缓冲区大小

缓冲区大小决定了在可见区域上下额外渲染的行数：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
  ],
  table: {
    virtualScroll: true,
    bufferSize: 20, // 增大缓冲区，提升滚动体验（默认 10）
  },
}
</script>
```

## 大数据量示例

处理万级数据：

```vue
<template>
  <DynamicTable 
    :data="largeData" 
    :schema="tableSchema" 
    :height="600" 
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DynamicTable } from '@vue3-schema-table/core'
import type { TableSchema } from '@vue3-schema-table/core'

const largeData = ref<any[]>([])

// 生成 10000 条数据
onMounted(() => {
  const data = []
  for (let i = 1; i <= 10000; i++) {
    data.push({
      id: i,
      name: `用户${i}`,
      age: Math.floor(Math.random() * 50) + 20,
      email: `user${i}@example.com`,
      department: ['技术部', '产品部', '设计部'][Math.floor(Math.random() * 3)],
    })
  }
  largeData.value = data
})

const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100, fixed: 'left' },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
    { key: 'age', title: '年龄', dataIndex: 'age', width: 100 },
    { key: 'email', title: '邮箱', dataIndex: 'email', width: 200 },
    { key: 'department', title: '部门', dataIndex: 'department', width: 150 },
  ],
  table: {
    virtualScroll: true,
    rowHeight: 40,
    bufferSize: 15, // 适中的缓冲区大小
  },
}
</script>
```

## 性能优化建议

1. **启用虚拟滚动**: 当数据量 > 100 行时，建议启用虚拟滚动。
2. **合理设置缓冲区**: 
   - 数据量 < 1000 行：`bufferSize: 10`（默认）
   - 数据量 1000-5000 行：`bufferSize: 15`
   - 数据量 > 5000 行：`bufferSize: 20`
3. **固定行高**: 启用虚拟滚动时，必须设置固定的 `rowHeight`。
4. **避免频繁更新**: 尽量减少对 `data` 数组的直接修改。

## 工作原理

虚拟滚动只渲染可见区域内的行，而不是渲染所有数据：

1. **计算可见范围**: 根据滚动位置和容器高度，计算当前可见的行范围。
2. **渲染可见行**: 只渲染可见范围内的行，以及缓冲区内的行。
3. **占位元素**: 使用占位元素撑起总高度，保持滚动条的正确性。
4. **动态更新**: 滚动时动态更新可见范围，重新渲染相应的行。

这样可以确保即使有数万行数据，也只会渲染几十行 DOM 元素，大幅提升性能。

