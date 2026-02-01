/**
 * 列对齐方式
 */
export type ColumnAlign = 'left' | 'center' | 'right'

/**
 * 排序类型
 */
export type SortType = 'default' | 'custom'

/**
 * 排序方向
 */
export type SortOrder = 'asc' | 'desc'

/**
 * 筛选类型
 */
export type FilterType = 'text' | 'number' | 'select' | 'custom'

/**
 * 固定列位置
 */
export type FixedType = 'left' | 'right'

/**
 * 行选择类型
 */
export type RowSelectionType = 'checkbox' | 'radio'

/**
 * 筛选选项
 */
export interface FilterOption {
  label: string
  value: any
}

/**
 * 列配置 Schema
 */
export interface ColumnSchema {
  /** 列的唯一标识 */
  key: string
  /** 列标题 */
  title: string
  /** 数据字段名 */
  dataIndex: string
  /** 列宽（像素） */
  width: number
  /** 对齐方式 */
  align?: ColumnAlign
  /** 是否可排序 */
  sortable?: boolean
  /** 排序类型 */
  sortType?: SortType
  /** 自定义排序函数 */
  sortFn?: (a: any, b: any) => number
  /** 是否可筛选 */
  filterable?: boolean
  /** 筛选类型 */
  filterType?: FilterType
  /** 自定义筛选函数 */
  filterFn?: (value: any, row: any) => boolean
  /** 筛选选项（用于 select 类型） */
  filterOptions?: FilterOption[]
  /** 固定列 */
  fixed?: FixedType
  /** 是否可调整列宽 */
  resizable?: boolean
}

/**
 * 行选择配置
 */
export interface RowSelectionConfig {
  /** 选择类型 */
  type?: RowSelectionType
  /** 行的唯一标识字段名或函数 */
  rowKey?: string | ((record: any) => string | number)
  /** 获取复选框属性的函数 */
  getCheckboxProps?: (record: any) => Record<string, any>
}

/**
 * 表格配置
 */
export interface TableConfig {
  /** 行高（像素） */
  rowHeight?: number
  /** 是否启用虚拟滚动 */
  virtualScroll?: boolean
  /** 虚拟滚动缓冲区大小 */
  bufferSize?: number
  /** 行选择配置 */
  rowSelection?: RowSelectionConfig
}

/**
 * 表格 Schema
 */
export interface TableSchema {
  /** 列配置数组 */
  columns: ColumnSchema[]
  /** 表格配置 */
  table?: TableConfig
}

/**
 * 排序配置
 */
export interface SortConfig {
  /** 列 key */
  colKey: string
  /** 排序方向 */
  order: SortOrder
}

/**
 * 筛选配置
 */
export interface FilterConfig {
  [colKey: string]: any
}

