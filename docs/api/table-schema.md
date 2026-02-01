# TableSchema API

`TableSchema` 是表格的核心配置对象，用于定义表格的列和表格行为。

## 类型定义

```typescript
interface TableSchema {
  /** 列配置数组 */
  columns: ColumnSchema[]
  /** 表格配置 */
  table?: TableConfig
}
```

## 属性说明

### columns

- **类型**: `ColumnSchema[]`
- **必需**: 是
- **说明**: 列配置数组，定义表格的所有列。详见 [ColumnSchema API](./column-schema.md)

### table

- **类型**: `TableConfig`
- **必需**: 否
- **说明**: 表格全局配置选项

## TableConfig

```typescript
interface TableConfig {
  /** 行高（像素），默认 40 */
  rowHeight?: number
  /** 是否启用虚拟滚动，默认 true */
  virtualScroll?: boolean
  /** 虚拟滚动缓冲区大小，默认 10 */
  bufferSize?: number
  /** 行选择配置 */
  rowSelection?: RowSelectionConfig
}
```

### rowHeight

- **类型**: `number`
- **默认值**: `40`
- **说明**: 表格行的高度（像素）。启用虚拟滚动时，此值用于计算总高度和可见范围。

### virtualScroll

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否启用虚拟滚动。当数据量较大时（> 100 行），建议启用虚拟滚动以提升性能。

### bufferSize

- **类型**: `number`
- **默认值**: `10`
- **说明**: 虚拟滚动时，在可见区域上下额外渲染的行数。增大此值可以提升滚动体验，但会增加渲染负担。

### rowSelection

- **类型**: `RowSelectionConfig`
- **说明**: 行选择配置，详见下方说明。

## RowSelectionConfig

```typescript
interface RowSelectionConfig {
  /** 选择类型：'checkbox' 多选，'radio' 单选 */
  type?: RowSelectionType
  /** 行的唯一标识字段名或函数 */
  rowKey?: string | ((record: any) => string | number)
  /** 获取复选框属性的函数 */
  getCheckboxProps?: (record: any) => Record<string, any>
}
```

### type

- **类型**: `'checkbox' | 'radio'`
- **默认值**: `'checkbox'`
- **说明**: 选择类型。`checkbox` 支持多选，`radio` 支持单选。

### rowKey

- **类型**: `string | ((record: any) => string | number)`
- **说明**: 行的唯一标识。可以是数据对象的字段名（如 `'id'`），或返回唯一值的函数。

### getCheckboxProps

- **类型**: `(record: any) => Record<string, any>`
- **说明**: 获取复选框属性的函数，可用于禁用某些行的选择。

## 示例

### 基础配置

```typescript
const schema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100 },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
  ],
}
```

### 完整配置

```typescript
const schema: TableSchema = {
  columns: [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 100, fixed: 'left' },
    { key: 'name', title: '姓名', dataIndex: 'name', width: 150 },
    { key: 'age', title: '年龄', dataIndex: 'age', width: 100 },
  ],
  table: {
    rowHeight: 50,
    virtualScroll: true,
    bufferSize: 15,
    rowSelection: {
      type: 'checkbox',
      rowKey: 'id',
      getCheckboxProps: (record) => ({
        disabled: record.status === 'disabled',
      }),
    },
  },
}
```

