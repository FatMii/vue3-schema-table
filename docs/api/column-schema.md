# ColumnSchema API

`ColumnSchema` 用于定义表格中每一列的配置。

## 类型定义

```typescript
interface ColumnSchema {
  key: string
  title: string
  dataIndex: string
  width: number
  align?: ColumnAlign
  sortable?: boolean
  sortType?: SortType
  sortFn?: (a: any, b: any) => number
  filterable?: boolean
  filterType?: FilterType
  filterFn?: (value: any, row: any) => boolean
  filterOptions?: FilterOption[]
  fixed?: FixedType
  resizable?: boolean
}
```

## 必需属性

### key

- **类型**: `string`
- **必需**: 是
- **说明**: 列的唯一标识符，在同一表格中必须唯一。

### title

- **类型**: `string`
- **必需**: 是
- **说明**: 列标题，显示在表头。

### dataIndex

- **类型**: `string`
- **必需**: 是
- **说明**: 数据对象中对应的字段名，用于从数据行中提取值。

### width

- **类型**: `number`
- **必需**: 是
- **说明**: 列的宽度（像素）。

## 可选属性

### align

- **类型**: `'left' | 'center' | 'right'`
- **默认值**: `'left'`
- **说明**: 列内容的对齐方式。

```typescript
{ key: 'amount', title: '金额', dataIndex: 'amount', width: 120, align: 'right' }
```

### sortable

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否允许对该列进行排序。设置为 `false` 时，表头不会显示排序按钮。

```typescript
{ key: 'name', title: '姓名', dataIndex: 'name', width: 150, sortable: true }
```

### sortType

- **类型**: `'default' | 'custom'`
- **默认值**: `'default'`
- **说明**: 排序类型。
  - `'default'`: 使用默认排序（数字按大小，字符串按字典序）
  - `'custom'`: 使用自定义排序函数 `sortFn`

### sortFn

- **类型**: `(a: any, b: any) => number`
- **说明**: 自定义排序函数。返回负数表示 `a` 排在 `b` 前面，返回正数表示 `a` 排在 `b` 后面，返回 0 表示相等。

```typescript
{
  key: 'date',
  title: '日期',
  dataIndex: 'date',
  width: 150,
  sortType: 'custom',
  sortFn: (a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  }
}
```

### filterable

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否允许对该列进行筛选。设置为 `false` 时，表头不会显示筛选按钮。

### filterType

- **类型**: `'text' | 'number' | 'select' | 'custom'`
- **默认值**: `'select'`
- **说明**: 筛选类型。
  - `'text'`: 文本筛选（暂未实现）
  - `'number'`: 数字筛选（暂未实现）
  - `'select'`: 下拉多选筛选（默认）
  - `'custom'`: 使用自定义筛选函数 `filterFn`

### filterFn

- **类型**: `(value: any, row: any) => boolean`
- **说明**: 自定义筛选函数。返回 `true` 表示该行通过筛选。

```typescript
{
  key: 'status',
  title: '状态',
  dataIndex: 'status',
  width: 100,
  filterType: 'custom',
  filterFn: (value, row) => {
    return row.status === value
  }
}
```

### filterOptions

- **类型**: `FilterOption[]`
- **说明**: 筛选选项列表（用于 `filterType: 'select'`）。如果不提供，会自动从数据中提取唯一值。

```typescript
interface FilterOption {
  label: string
  value: any
}
```

```typescript
{
  key: 'status',
  title: '状态',
  dataIndex: 'status',
  width: 100,
  filterOptions: [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' },
  ]
}
```

### fixed

- **类型**: `'left' | 'right'`
- **说明**: 固定列位置。设置为 `'left'` 时，列固定在左侧；设置为 `'right'` 时，列固定在右侧。

```typescript
{ key: 'id', title: 'ID', dataIndex: 'id', width: 100, fixed: 'left' }
{ key: 'action', title: '操作', dataIndex: 'action', width: 150, fixed: 'right' }
```

### resizable

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否允许通过拖拽调整列宽。设置为 `false` 时，列宽不可调整。

```typescript
{ key: 'name', title: '姓名', dataIndex: 'name', width: 150, resizable: false }
```

## 完整示例

```typescript
const columns: ColumnSchema[] = [
  {
    key: 'id',
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    fixed: 'left',
    resizable: false,
  },
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    width: 150,
    align: 'center',
    sortable: true,
    filterable: true,
  },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    width: 100,
    align: 'right',
    sortable: true,
    sortType: 'custom',
    sortFn: (a, b) => a.age - b.age,
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    width: 120,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ],
  },
  {
    key: 'action',
    title: '操作',
    dataIndex: 'action',
    width: 150,
    fixed: 'right',
  },
]
```

