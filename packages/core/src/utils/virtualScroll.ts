/**
 * 虚拟滚动工具函数
 * 计算需要渲染的行范围，实现高性能的大数据量表格渲染
 */

export interface VisibleRange {
  startIndex: number
  endIndex: number
  offsetY: number
  visibleCount: number
}

/**
 * 计算虚拟滚动需要渲染的行范围
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  rowHeight: number,
  totalRows: number,
  bufferSize = 10
): VisibleRange {
  // 如果没有数据，返回空范围
  if (totalRows === 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      offsetY: 0,
      visibleCount: 0,
    }
  }

  // 如果容器高度为0或无效，至少渲染第一行（用于初始化）
  if (containerHeight <= 0) {
    const minRenderCount = Math.max(1, bufferSize * 2)
    return {
      startIndex: 0,
      endIndex: Math.min(minRenderCount, totalRows),
      offsetY: 0,
      visibleCount: minRenderCount,
    }
  }

  // 计算可见区域的行数
  const visibleCount = Math.ceil(containerHeight / rowHeight)

  // 计算开始索引（向上取整，并减去缓冲区）
  let startIndex = Math.floor(scrollTop / rowHeight)
  // 增加缓冲区，确保快速滚动时不会出现空白
  startIndex = Math.max(0, startIndex - bufferSize)

  // 计算结束索引（加上可见行数和缓冲区）
  let endIndex = startIndex + visibleCount + bufferSize * 2
  endIndex = Math.min(totalRows, endIndex)

  // 确保至少渲染一行（如果有数据）
  if (endIndex <= startIndex && totalRows > 0) {
    endIndex = Math.min(startIndex + 1, totalRows)
  }

  // 计算偏移量（用于定位渲染的起始位置）
  const offsetY = startIndex * rowHeight

  return {
    startIndex,
    endIndex,
    offsetY,
    visibleCount,
  }
}

/**
 * 获取总高度
 */
export function getTotalHeight(totalRows: number, rowHeight: number): number {
  return totalRows * rowHeight
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func(...args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func(...args)
      }, remaining)
    }
  }
}

