# 行选择

行选择功能允许用户选择表格中的行，支持单选和多选。

## 多选（Checkbox）

使用复选框进行多选：

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
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  { id: 3, name: '王五', age: 28 },
])

const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
    { key: 'age', title: '年龄', dataIndex: 'age', width: 100 },
  ],
  table: {
    rowSelection: {
      type: 'checkbox', // 多选
      rowKey: 'id', // 使用 id 字段作为行的唯一标识
    },
  },
}
</script>
```

## 单选（Radio）

使用单选框进行单选：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
  ],
  table: {
    rowSelection: {
      type: 'radio', // 单选
      rowKey: 'id',
    },
  },
}
</script>
```

## 自定义 rowKey

使用函数返回行的唯一标识：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
  ],
  table: {
    rowSelection: {
      type: 'checkbox',
      rowKey: (record) => `${record.id}-${record.name}`, // 组合多个字段作为唯一标识
    },
  },
}
</script>
```

## 禁用某些行的选择

使用 `getCheckboxProps` 函数禁用某些行的选择：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
    { key: 'status', title: '状态', dataIndex: 'status', width: 100 },
  ],
  table: {
    rowSelection: {
      type: 'checkbox',
      rowKey: 'id',
      getCheckboxProps: (record) => ({
        // 禁用状态为 'disabled' 的行
        disabled: record.status === 'disabled',
      }),
    },
  },
}
</script>
```

## 完整示例

```vue
<template>
  <div>
    <DynamicTable 
      :data="tableData" 
      :schema="tableSchema" 
      :height="600" 
    />
    <div style="margin-top: 20px;">
      <p>已选择: {{ selectedCount }} 行</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DynamicTable } from '@vue3-schema-table/core'
import type { TableSchema } from '@vue3-schema-table/core'

const tableData = ref([
  { id: 1, name: '张三', age: 25, status: 'active' },
  { id: 2, name: '李四', age: 30, status: 'active' },
  { id: 3, name: '王五', age: 28, status: 'disabled' },
  { id: 4, name: '赵六', age: 32, status: 'active' },
])

const tableSchema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100, fixed: 'left' },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
    { key: 'age', title: '年龄', dataIndex: 'age', width: 100 },
    { key: 'status', title: '状态', dataIndex: 'status', width: 100 },
  ],
  table: {
    rowSelection: {
      type: 'checkbox',
      rowKey: 'id',
      getCheckboxProps: (record) => ({
        disabled: record.status === 'disabled',
      }),
    },
  },
}

// 注意：当前版本暂不支持直接获取选中的行，需要后续添加事件支持
const selectedCount = computed(() => 0)
</script>
```

## 注意事项

1. **rowKey 必需**: 必须提供 `rowKey` 来唯一标识每一行。
2. **数据唯一性**: 确保 `rowKey` 返回的值在数据中是唯一的。
3. **固定列**: 行选择列会自动固定在左侧，与左侧固定列一起显示。
4. **全选功能**: 表头会显示全选复选框，可以一键选择/取消所有行。

