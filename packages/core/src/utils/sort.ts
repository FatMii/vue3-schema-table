import type { ColumnSchema, SortConfig, SortOrder } from '../types'

/**
 * 默认排序函数
 */
function defaultSort(a: any, b: any): number {
  // 处理 null/undefined
  if (a == null && b == null) {
    return 0
  }
  if (a == null) {
    return 1 // null 排在后面
  }
  if (b == null) {
    return -1
  }

  // 数字类型
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }

  // 字符串类型（支持中文）
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, 'zh-CN')
  }

  // 日期类型
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime()
  }

  // 其他类型转换为字符串比较
  return String(a).localeCompare(String(b), 'zh-CN')
}

/**
 * 排序数据
 */
export function sortData(
  data: any[],
  sortConfigs: SortConfig[],
  columns: ColumnSchema[]
): any[] {
  if (!sortConfigs || sortConfigs.length === 0) {
    return [...data] // 始终返回新数组，避免引用问题
  }

  if (!Array.isArray(data) || data.length === 0) {
    return []
  }

  const sortedData = [...data]

  sortedData.sort((a, b) => {
    for (const sortConfig of sortConfigs) {
      const { colKey, order } = sortConfig
      const column = columns.find((col) => col.key === colKey)

      if (!column) {
        continue
      }

      const aValue = a[column.dataIndex]
      const bValue = b[column.dataIndex]

      let comparison = 0

      // 使用自定义排序函数
      if (column.sortType === 'custom' && typeof column.sortFn === 'function') {
        comparison = column.sortFn(aValue, bValue)
      } else {
        // 使用默认排序
        comparison = defaultSort(aValue, bValue)
      }

      if (comparison !== 0) {
        return order === 'asc' ? comparison : -comparison
      }
    }
    return 0
  })

  return sortedData
}

/**
 * 切换排序状态
 */
export function toggleSort(
  sortConfigs: SortConfig[],
  colKey: string,
  order: SortOrder
): SortConfig[] {
  const newConfigs = [...sortConfigs]
  const existingIndex = newConfigs.findIndex((s) => s.colKey === colKey)

  if (existingIndex >= 0) {
    if (newConfigs[existingIndex].order === order) {
      // 相同排序方向，取消排序
      newConfigs.splice(existingIndex, 1)
    } else {
      // 切换排序方向
      newConfigs[existingIndex].order = order
    }
  } else {
    // 添加新排序
    newConfigs.push({ colKey, order })
  }

  return newConfigs
}

/**
 * 获取列的排序状态
 */
export function getSortOrder(sortConfigs: SortConfig[], colKey: string): SortOrder | null {
  const sortConfig = sortConfigs.find((s) => s.colKey === colKey)
  return sortConfig?.order || null
}

