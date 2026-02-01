# DynamicTable Props API

`DynamicTable` 组件的属性（Props）说明。

## Props

### data

- **类型**: `RowData[]`
- **必需**: 是
- **说明**: 表格数据数组。每行数据是一个对象，字段名对应 `ColumnSchema` 中的 `dataIndex`。

```typescript
interface RowData {
  [key: string]: any
}
```

**示例**:

```typescript
const tableData = [
  { id: 1, name: '张三', age: 25, department: '技术部' },
  { id: 2, name: '李四', age: 30, department: '产品部' },
]
```

### schema

- **类型**: `TableSchema`
- **必需**: 是
- **说明**: 表格配置 Schema，定义列和表格行为。详见 [TableSchema API](./table-schema.md)。

**示例**:

```typescript
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
  ],
  table: {
    virtualScroll: true,
    rowHeight: 40,
  },
}
```

### height

- **类型**: `number`
- **必需**: 否
- **默认值**: `600`
- **说明**: 表格容器的高度（像素）。此高度包括表头和表体，表体高度 = `height - 表头高度（50px）`。

**示例**:

```vue
<DynamicTable :data="tableData" :schema="tableSchema" :height="800" />
```

## 完整示例

```vue
<template>
  <DynamicTable 
    :data="tableData" 
    :schema="tableSchema" 
    :height="600" 
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicTable } from '@vue3-schema-table/core'
import type { TableSchema } from '@vue3-schema-table/core'

const tableData = ref([
  { id: 1, name: '张三', age: 25, department: '技术部' },
  { id: 2, name: '李四', age: 30, department: '产品部' },
  { id: 3, name: '王五', age: 28, department: '设计部' },
])

const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'id', 
      title: 'ID', 
      dataIndex: 'id', 
      width: 100,
      fixed: 'left'
    },
    { 
      key: 'name', 
      title: '姓名', 
      dataIndex: 'name', 
      width: 150,
      sortable: true,
      filterable: true
    },
    { 
      key: 'age', 
      title: '年龄', 
      dataIndex: 'age', 
      width: 100,
      align: 'right'
    },
    { 
      key: 'department', 
      title: '部门', 
      dataIndex: 'department', 
      width: 150,
      fixed: 'right'
    },
  ],
  table: {
    virtualScroll: true,
    rowHeight: 40,
    rowSelection: {
      type: 'checkbox',
      rowKey: 'id',
    },
  },
}
</script>
```

## 注意事项

1. **数据格式**: `data` 数组中的每个对象必须包含 `ColumnSchema` 中定义的 `dataIndex` 字段。
2. **Schema 验证**: 组件会自动验证 `schema` 的有效性，无效的列配置会被过滤掉。
3. **虚拟滚动**: 当数据量较大时（> 100 行），建议启用虚拟滚动以提升性能。
4. **固定列**: 固定列会始终显示在视口中，不会随横向滚动而移动。
5. **列宽调整**: 默认所有列都可以通过拖拽调整宽度，设置 `resizable: false` 可以禁用。

