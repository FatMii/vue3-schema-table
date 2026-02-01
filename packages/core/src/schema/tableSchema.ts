import type { TableSchema, ColumnSchema, TableConfig } from '../types'

/**
 * 默认表格配置
 */
export const defaultTableConfig: Required<Omit<TableConfig, 'rowSelection'>> = {
  rowHeight: 40,
  virtualScroll: true,
  bufferSize: 10,
}

/**
 * 验证列配置
 */
export function validateColumn(column: ColumnSchema | null | undefined): boolean {
  if (!column) {
    return false
  }

  // 必需字段检查
  if (!column.key || !column.title || !column.dataIndex) {
    return false
  }

  // 宽度检查
  if (column.width && (typeof column.width !== 'number' || column.width <= 0)) {
    return false
  }

  // 对齐方式检查
  if (column.align && !['left', 'center', 'right'].includes(column.align)) {
    return false
  }

  // 排序配置检查
  if (column.sortable && column.sortType === 'custom' && typeof column.sortFn !== 'function') {
    return false
  }

  // 筛选配置检查
  if (column.filterable) {
    if (column.filterType === 'custom' && typeof column.filterFn !== 'function') {
      return false
    }
    if (column.filterType === 'select' && !Array.isArray(column.filterOptions)) {
      return false
    }
  }

  return true
}

/**
 * 验证表格 Schema
 */
export function validateSchema(schema: TableSchema | null | undefined): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!schema) {
    return { valid: false, errors: ['Schema 不能为空'] }
  }

  if (!Array.isArray(schema.columns)) {
    return { valid: false, errors: ['columns 必须是数组'] }
  }

  if (schema.columns.length === 0) {
    return { valid: false, errors: ['columns 不能为空'] }
  }

  // 验证每一列（记录错误但不阻止验证通过）
  schema.columns.forEach((column, index) => {
    if (!validateColumn(column)) {
      errors.push(`第 ${index + 1} 列配置无效`)
    }
  })

  // 检查是否至少有一列有效
  const hasValidColumn = schema.columns.some((column) => validateColumn(column))
  if (!hasValidColumn) {
    return { valid: false, errors: ['至少需要一列有效配置', ...errors] }
  }

  // 验证表格配置
  let hasTableConfigError = false
  if (schema.table) {
    if (
      schema.table.rowHeight &&
      (typeof schema.table.rowHeight !== 'number' || schema.table.rowHeight <= 0)
    ) {
      errors.push('rowHeight 必须是大于 0 的数字')
      hasTableConfigError = true
    }
    if (
      schema.table.bufferSize &&
      (typeof schema.table.bufferSize !== 'number' || schema.table.bufferSize < 0)
    ) {
      errors.push('bufferSize 必须是非负数')
      hasTableConfigError = true
    }
  }

  // Schema 有效需要满足：
  // 1. 至少有一列有效
  // 2. 表格配置（如果存在）必须有效
  const isValid = hasValidColumn && !hasTableConfigError

  return {
    valid: isValid,
    errors,
  }
}

/**
 * 合并默认配置
 */
export function mergeDefaultConfig(schema: TableSchema): TableSchema {
  if (!schema) {
    throw new Error('Schema 不能为空')
  }

  return {
    ...schema,
    table: {
      ...defaultTableConfig,
      ...(schema.table || {}),
    },
    columns: schema.columns.map((column) => {
      // 默认配置：除了 ID 列，其他列默认启用排序和筛选
      const isIdColumn = column.key === 'id' || column.dataIndex === 'id'

      // 先设置默认值
      const defaultColumn: Partial<ColumnSchema> = {
        align: 'left',
        sortType: 'default',
        filterType: 'text',
      }

      // ID 列默认不启用排序和筛选，其他列默认启用
      // 如果用户明确设置了值，使用用户的值；否则使用默认值
      if (column.sortable === undefined) {
        defaultColumn.sortable = !isIdColumn
      } else {
        defaultColumn.sortable = column.sortable
      }

      if (column.filterable === undefined) {
        defaultColumn.filterable = !isIdColumn
      } else {
        defaultColumn.filterable = column.filterable
      }

      // 用户配置覆盖默认配置
      return {
        ...defaultColumn,
        ...column,
      } as ColumnSchema
    }),
  }
}

