# 固定列

固定列功能允许某些列在横向滚动时保持可见。

## 左侧固定列

将列固定在左侧：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'id', 
      title: 'ID', 
      dataIndex: 'id', 
      width: 100,
      fixed: 'left' // 固定在左侧
    },
    { 
      key: 'name', 
      title: '姓名', 
      dataIndex: 'name', 
      width: 150
    },
    { 
      key: 'email', 
      title: '邮箱', 
      dataIndex: 'email', 
      width: 200
    },
    // ... 更多列
  ],
}
</script>
```

## 右侧固定列

将列固定在右侧：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'name', 
      title: '姓名', 
      dataIndex: 'name', 
      width: 150
    },
    { 
      key: 'email', 
      title: '邮箱', 
      dataIndex: 'email', 
      width: 200
    },
    { 
      key: 'action', 
      title: '操作', 
      dataIndex: 'action', 
      width: 150,
      fixed: 'right' // 固定在右侧
    },
  ],
}
</script>
```

## 同时固定左右两侧

可以同时固定左侧和右侧的列：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    // 左侧固定列
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
      fixed: 'left'
    },
    // 普通列（可滚动）
    { 
      key: 'email', 
      title: '邮箱', 
      dataIndex: 'email', 
      width: 200
    },
    { 
      key: 'phone', 
      title: '电话', 
      dataIndex: 'phone', 
      width: 150
    },
    { 
      key: 'address', 
      title: '地址', 
      dataIndex: 'address', 
      width: 300
    },
    // 右侧固定列
    { 
      key: 'status', 
      title: '状态', 
      dataIndex: 'status', 
      width: 100,
      fixed: 'right'
    },
    { 
      key: 'action', 
      title: '操作', 
      dataIndex: 'action', 
      width: 150,
      fixed: 'right'
    },
  ],
}
</script>
```

## 固定列与行选择

固定列可以与行选择功能配合使用：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'id', 
      title: 'ID', 
      dataIndex: 'id', 
      width: 100,
      fixed: 'left'
    },
    // ... 其他列
  ],
  table: {
    rowSelection: {
      type: 'checkbox',
      rowKey: 'id',
    },
  },
}
</script>
```

## 注意事项

1. **固定列数量**: 建议固定列数量不要过多，以免影响表格布局。
2. **列宽**: 固定列的宽度是固定的，不会随内容自动调整。
3. **滚动性能**: 固定列的实现使用了特殊布局，对性能影响很小。
4. **表头同步**: 固定列的表头会与表体同步滚动。

