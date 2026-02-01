# 排序和筛选

## 排序

### 基础排序

默认情况下，所有列都支持排序：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'name', 
      title: '姓名', 
      dataIndex: 'name', 
      width: 150,
      sortable: true // 启用排序（默认已启用）
    },
    { 
      key: 'age', 
      title: '年龄', 
      dataIndex: 'age', 
      width: 100,
      sortable: true
    },
  ],
}
</script>
```

### 禁用排序

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'id', 
      title: 'ID', 
      dataIndex: 'id', 
      width: 100,
      sortable: false // 禁用排序
    },
  ],
}
</script>
```

### 自定义排序

使用自定义排序函数：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'date', 
      title: '日期', 
      dataIndex: 'date', 
      width: 150,
      sortType: 'custom',
      sortFn: (a, b) => {
        // 按日期排序
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
    },
    { 
      key: 'price', 
      title: '价格', 
      dataIndex: 'price', 
      width: 120,
      sortType: 'custom',
      sortFn: (a, b) => {
        // 按价格降序排序
        return b.price - a.price
      }
    },
  ],
}
</script>
```

## 筛选

### 基础筛选

默认情况下，所有列都支持筛选（自动提取唯一值）：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'status', 
      title: '状态', 
      dataIndex: 'status', 
      width: 120,
      filterable: true // 启用筛选（默认已启用）
    },
    { 
      key: 'department', 
      title: '部门', 
      dataIndex: 'department', 
      width: 150,
      filterable: true
    },
  ],
}
</script>
```

### 禁用筛选

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'id', 
      title: 'ID', 
      dataIndex: 'id', 
      width: 100,
      filterable: false // 禁用筛选
    },
  ],
}
</script>
```

### 自定义筛选选项

手动指定筛选选项：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'status', 
      title: '状态', 
      dataIndex: 'status', 
      width: 120,
      filterType: 'select',
      filterOptions: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
        { label: '待审核', value: 'pending' },
      ]
    },
  ],
}
</script>
```

### 自定义筛选函数

使用自定义筛选逻辑：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
    { 
      key: 'age', 
      title: '年龄', 
      dataIndex: 'age', 
      width: 100,
      filterType: 'custom',
      filterFn: (value, row) => {
        // 筛选年龄大于等于指定值的行
        return row.age >= value
      }
    },
  ],
}
</script>
```

## 组合使用

同时启用排序和筛选：

```vue
<script setup lang="ts">
const tableSchema: TableSchema = {
  columns: [
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
      sortable: true,
      filterable: true,
      sortType: 'custom',
      sortFn: (a, b) => a.age - b.age
    },
    { 
      key: 'department', 
      title: '部门', 
      dataIndex: 'department', 
      width: 150,
      sortable: true,
      filterable: true,
      filterOptions: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '设计部', value: 'design' },
      ]
    },
  ],
}
</script>
```

