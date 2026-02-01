/**
 * 列宽拖拽调整工具
 */

/**
 * 初始化列宽拖拽
 */
export function initColumnResize(
  headerCell: HTMLElement | null,
  onResize: (newWidth: number) => void,
  onResizing?: (newWidth: number) => void
): { destroy: () => void } | null {
  if (!headerCell) return null

  const resizeHandle = document.createElement('div')
  resizeHandle.className = 'column-resize-handle'
  resizeHandle.style.cssText = `
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: col-resize;
    user-select: none;
    z-index: 10;
    background: transparent;
  `

  headerCell.style.position = 'relative'
  headerCell.appendChild(resizeHandle)

  let isResizing = false
  let startX = 0
  let startWidth = 0

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isResizing = true
    startX = e.clientX
    startWidth = headerCell.offsetWidth

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // 添加全局样式
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const diff = e.clientX - startX
    const newWidth = Math.max(50, startWidth + diff) // 最小宽度 50px

    // 实时更新表头单元格宽度（直接操作 DOM）
    headerCell.style.width = newWidth + 'px'
    headerCell.style.minWidth = newWidth + 'px'

    // 如果提供了实时回调，调用它来更新行单元格宽度
    if (typeof onResizing === 'function') {
      onResizing(newWidth)
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!isResizing) return

    isResizing = false
    const diff = e.clientX - startX
    const newWidth = Math.max(50, startWidth + diff)

    // 恢复全局样式
    document.body.style.cursor = ''
    document.body.style.userSelect = ''

    // 移除事件监听
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    // 调用最终回调（更新响应式数据）
    onResize(newWidth)
  }

  resizeHandle.addEventListener('mousedown', handleMouseDown)

  return {
    destroy: () => {
      resizeHandle.removeEventListener('mousedown', handleMouseDown)
      resizeHandle.remove()
    },
  }
}

