# API 文档

Vue3 Schema Table 的完整 API 文档。

## 组件

### DynamicTable

主要的表格组件。

- [Props API](./props.md) - 组件属性说明

## Schema 配置

### TableSchema

表格的完整配置 Schema。

- [TableSchema API](./table-schema.md) - 表格配置说明

### ColumnSchema

列的配置 Schema。

- [ColumnSchema API](./column-schema.md) - 列配置说明

## 类型定义

所有类型定义都可以从 `@vue3-schema-table/core` 导入：

```typescript
import type {
  TableSchema,
  ColumnSchema,
  TableConfig,
  ColumnAlign,
  SortType,
  SortOrder,
  FilterType,
  FixedType,
  RowSelectionType,
  RowSelectionConfig,
} from '@vue3-schema-table/core'
```

