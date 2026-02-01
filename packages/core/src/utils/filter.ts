import type { ColumnSchema, FilterConfig } from '../types'

/**
 * 默认文本筛选
 */
function textFilter(cellValue: any, filterValue: string): boolean {
  if (cellValue == null) {
    return false
  }
  return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase())
}

/**
 * 默认数字筛选
 */
function numberFilter(cellValue: any, filterValue: string | number): boolean {
  const numValue = Number(filterValue)
  if (isNaN(numValue)) {
    return true // 无效数字不过滤
  }
  return Number(cellValue) === numValue
}

/**
 * 默认选择筛选（支持数组多选）
 */
function selectFilter(cellValue: any, filterValue: any): boolean {
  if (Array.isArray(filterValue)) {
    return filterValue.includes(cellValue)
  }
  return cellValue === filterValue
}

/**
 * 筛选数据
 */
export function filterData(
  data: any[],
  filterConfigs: FilterConfig,
  columns: ColumnSchema[]
): any[] {
  if (!filterConfigs || Object.keys(filterConfigs).length === 0) {
    return [...data] // 始终返回新数组，避免引用问题
  }

  if (!Array.isArray(data) || data.length === 0) {
    return []
  }

  return data.filter((row) => {
    return Object.entries(filterConfigs).every(([colKey, filterValue]) => {
      // 空值不过滤
      if (filterValue === null || filterValue === undefined || filterValue === '') {
        return true
      }

      // 数组为空不过滤
      if (Array.isArray(filterValue) && filterValue.length === 0) {
        return true
      }

      const column = columns.find((col) => col.key === colKey)
      if (!column) {
        return true // 列不存在，不过滤
      }

      const cellValue = row[column.dataIndex]

      // 使用自定义筛选函数
      if (column.filterType === 'custom' && typeof column.filterFn === 'function') {
        return column.filterFn(filterValue, row)
      }

      // 使用默认筛选类型
      switch (column.filterType || 'text') {
        case 'text':
          // 文本筛选：如果是数组，检查是否包含任一值
          if (Array.isArray(filterValue)) {
            return filterValue.some((fv) => textFilter(cellValue, fv))
          }
          return textFilter(cellValue, filterValue)

        case 'number':
          // 数字筛选：如果是数组，检查是否包含任一值
          if (Array.isArray(filterValue)) {
            return filterValue.some((fv) => numberFilter(cellValue, fv))
          }
          return numberFilter(cellValue, filterValue)

        case 'select':
          return selectFilter(cellValue, filterValue)

        default:
          // 默认文本筛选：如果是数组，检查是否包含任一值
          if (Array.isArray(filterValue)) {
            return filterValue.some((fv) => textFilter(cellValue, fv))
          }
          return textFilter(cellValue, filterValue)
      }
    })
  })
}

/**
 * 设置筛选值
 */
export function setFilter(
  filterConfigs: FilterConfig,
  colKey: string,
  filterValue: any
): FilterConfig {
  const newConfigs = { ...filterConfigs }

  if (filterValue === null || filterValue === undefined || filterValue === '') {
    // 清除筛选
    delete newConfigs[colKey]
  } else {
    // 设置筛选
    newConfigs[colKey] = filterValue
  }

  return newConfigs
}

/**
 * 检查列是否有筛选
 */
export function hasFilter(filterConfigs: FilterConfig, colKey: string): boolean {
  const filterValue = filterConfigs[colKey]
  if (filterValue === null || filterValue === undefined || filterValue === '') {
    return false
  }
  // 如果是数组，检查是否为空
  if (Array.isArray(filterValue)) {
    return filterValue.length > 0
  }
  return true
}

/**
 * 获取筛选值
 */
export function getFilterValue(filterConfigs: FilterConfig, colKey: string): any {
  return filterConfigs[colKey] || null
}

