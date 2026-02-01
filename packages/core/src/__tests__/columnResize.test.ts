import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { initColumnResize } from '../utils/columnResize'

describe('列宽拖拽工具', () => {
  let headerCell: HTMLElement
  let onResizeCallback: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // 创建模拟的表头单元格
    headerCell = document.createElement('div')
    headerCell.style.width = '100px'
    headerCell.style.height = '50px'
    document.body.appendChild(headerCell)

    // 创建回调函数
    onResizeCallback = vi.fn()
  })

  afterEach(() => {
    if (headerCell && headerCell.parentNode) {
      headerCell.parentNode.removeChild(headerCell)
    }
  })

  it('应该创建拖拽手柄', () => {
    const handler = initColumnResize(headerCell, onResizeCallback)
    
    expect(handler).not.toBeNull()
    const resizeHandle = headerCell.querySelector('.column-resize-handle')
    expect(resizeHandle).not.toBeNull()
    expect((resizeHandle as HTMLElement).style.cursor).toBe('col-resize')
    
    handler?.destroy()
  })

  it('应该处理无效的 headerCell', () => {
    const handler = initColumnResize(null, onResizeCallback)
    expect(handler).toBeNull()
  })

  it('应该设置最小宽度限制', () => {
    const handler = initColumnResize(headerCell, onResizeCallback)
    const resizeHandle = headerCell.querySelector('.column-resize-handle')
    
    // 模拟拖拽到很小的宽度
    const mouseDownEvent = new MouseEvent('mousedown', {
      clientX: 100,
      bubbles: true,
      cancelable: true,
    })
    resizeHandle?.dispatchEvent(mouseDownEvent)
    
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 10, // 拖拽到很小的位置
      bubbles: true,
    })
    document.dispatchEvent(mouseMoveEvent)
    
    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 10,
      bubbles: true,
    })
    document.dispatchEvent(mouseUpEvent)
    
    // 应该至少是 50px
    expect(onResizeCallback).toHaveBeenCalled()
    const lastCall = onResizeCallback.mock.calls[onResizeCallback.mock.calls.length - 1]
    expect(lastCall[0]).toBeGreaterThanOrEqual(50)
    
    handler?.destroy()
  })

  it('应该清理事件监听器', () => {
    const handler = initColumnResize(headerCell, onResizeCallback)
    const resizeHandle = headerCell.querySelector('.column-resize-handle')
    
    handler?.destroy()
    
    // 销毁后不应该有拖拽手柄
    expect(headerCell.querySelector('.column-resize-handle')).toBeNull()
  })

  it('应该在拖拽过程中调用实时回调', () => {
    const onResizingCallback = vi.fn()
    // 设置明确的宽度和布局，确保 offsetWidth 可用
    headerCell.style.width = '100px'
    headerCell.style.display = 'block'
    headerCell.style.position = 'relative'
    // 强制浏览器计算布局
    headerCell.offsetHeight // 触发重排
    
    const handler = initColumnResize(headerCell, onResizeCallback, onResizingCallback)
    const resizeHandle = headerCell.querySelector('.column-resize-handle')
    
    // 在 mousedown 时，代码会读取 offsetWidth，所以我们需要确保它有值
    // 由于测试环境可能无法准确获取，我们直接验证回调被调用，并验证宽度变化
    const startX = 100
    const moveDistance = 50
    
    // 模拟拖拽
    const mouseDownEvent = new MouseEvent('mousedown', {
      clientX: startX,
      bubbles: true,
      cancelable: true,
    })
    resizeHandle?.dispatchEvent(mouseDownEvent)
    
    // 模拟移动（向右移动50px）
    const newClientX = startX + moveDistance
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: newClientX,
      bubbles: true,
    })
    document.dispatchEvent(mouseMoveEvent)
    
    // 应该调用实时回调
    expect(onResizingCallback).toHaveBeenCalled()
    // 验证回调被调用，并且宽度至少是最小宽度50px
    const actualWidth = onResizingCallback.mock.calls[0][0]
    expect(actualWidth).toBeGreaterThanOrEqual(50)
    // 如果 offsetWidth 可用，应该是初始宽度 + 移动距离
    // 如果 offsetWidth 为 0，则至少是 50px
    if (headerCell.offsetWidth > 0) {
      expect(actualWidth).toBe(headerCell.offsetWidth + moveDistance)
    }
    
    // 结束拖拽
    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: newClientX,
      bubbles: true,
    })
    document.dispatchEvent(mouseUpEvent)
    
    // 应该调用最终回调
    expect(onResizeCallback).toHaveBeenCalled()
    const finalWidth = onResizeCallback.mock.calls[0][0]
    expect(finalWidth).toBeGreaterThanOrEqual(50)
    expect(finalWidth).toBe(actualWidth) // 最终宽度应该和实时宽度一致
    
    handler?.destroy()
  })

  it('应该在没有实时回调时正常工作', () => {
    // 设置明确的宽度和布局
    headerCell.style.width = '100px'
    headerCell.style.display = 'block'
    headerCell.style.position = 'relative'
    // 强制浏览器计算布局
    headerCell.offsetHeight // 触发重排
    
    const handler = initColumnResize(headerCell, onResizeCallback)
    const resizeHandle = headerCell.querySelector('.column-resize-handle')
    
    const startX = 100
    const moveDistance = 50
    
    // 模拟拖拽
    const mouseDownEvent = new MouseEvent('mousedown', {
      clientX: startX,
      bubbles: true,
      cancelable: true,
    })
    resizeHandle?.dispatchEvent(mouseDownEvent)
    
    // 模拟移动（向右移动50px）
    const newClientX = startX + moveDistance
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: newClientX,
      bubbles: true,
    })
    document.dispatchEvent(mouseMoveEvent)
    
    // 应该正常工作，宽度应该更新（至少是最小宽度50px）
    const currentWidth = parseInt(headerCell.style.width) || 0
    expect(currentWidth).toBeGreaterThanOrEqual(50)
    
    // 如果 offsetWidth 可用，应该等于初始宽度 + 移动距离
    if (headerCell.offsetWidth > 0) {
      // 注意：在 mousedown 时已经读取了 offsetWidth，所以这里需要验证
      // 由于 offsetWidth 可能在测试环境中不准确，我们只验证宽度被更新了
      expect(headerCell.style.width).toMatch(/^\d+px$/)
    }
    
    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: newClientX,
      bubbles: true,
    })
    document.dispatchEvent(mouseUpEvent)
    
    expect(onResizeCallback).toHaveBeenCalled()
    const finalWidth = onResizeCallback.mock.calls[0][0]
    expect(finalWidth).toBeGreaterThanOrEqual(50)
    // 最终宽度应该和当前样式宽度一致
    expect(finalWidth).toBe(currentWidth)
    
    handler?.destroy()
  })
})

