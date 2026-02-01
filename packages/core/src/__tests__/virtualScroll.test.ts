import { describe, it, expect } from 'vitest'
import { calculateVisibleRange, getTotalHeight, throttle } from '../utils/virtualScroll'

describe('虚拟滚动工具', () => {
  describe('calculateVisibleRange', () => {
    const rowHeight = 40
    const containerHeight = 400
    const bufferSize = 5

    it('应该计算可见行范围', () => {
      const result = calculateVisibleRange(0, containerHeight, rowHeight, 100, bufferSize)
      
      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBeGreaterThan(0)
      expect(result.offsetY).toBe(0)
      expect(result.visibleCount).toBeGreaterThan(0)
    })

    it('应该处理空数据', () => {
      const result = calculateVisibleRange(0, containerHeight, rowHeight, 0, bufferSize)
      
      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBe(0)
      expect(result.offsetY).toBe(0)
      expect(result.visibleCount).toBe(0)
    })

    it('应该处理无效的容器高度', () => {
      const result = calculateVisibleRange(0, 0, rowHeight, 100, bufferSize)
      
      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBeGreaterThan(0)
    })

    it('应该根据滚动位置计算正确的起始索引', () => {
      const scrollTop = 200 // 滚动到第5行
      const result = calculateVisibleRange(scrollTop, containerHeight, rowHeight, 100, bufferSize)
      
      // 应该从第5行附近开始渲染（考虑缓冲区）
      expect(result.startIndex).toBeGreaterThanOrEqual(0)
      expect(result.startIndex).toBeLessThan(10)
    })

    it('应该包含缓冲区', () => {
      const result = calculateVisibleRange(0, containerHeight, rowHeight, 100, bufferSize)
      
      // 结束索引应该包含缓冲区
      const visibleCount = Math.ceil(containerHeight / rowHeight)
      expect(result.endIndex).toBeGreaterThanOrEqual(visibleCount + bufferSize)
    })

    it('应该限制结束索引不超过总行数', () => {
      const totalRows = 5
      const result = calculateVisibleRange(0, containerHeight, rowHeight, totalRows, bufferSize)
      
      expect(result.endIndex).toBeLessThanOrEqual(totalRows)
    })

    it('应该计算正确的偏移量', () => {
      const scrollTop = 200
      const result = calculateVisibleRange(scrollTop, containerHeight, rowHeight, 100, bufferSize)
      
      // 偏移量应该是起始索引 * 行高
      expect(result.offsetY).toBe(result.startIndex * rowHeight)
    })

    it('应该处理大数据量', () => {
      const totalRows = 10000
      const result = calculateVisibleRange(5000, containerHeight, rowHeight, totalRows, bufferSize)
      
      expect(result.startIndex).toBeGreaterThan(0)
      expect(result.endIndex).toBeLessThanOrEqual(totalRows)
      expect(result.endIndex - result.startIndex).toBeLessThan(100) // 只渲染可见行
    })
  })

  describe('getTotalHeight', () => {
    it('应该计算总高度', () => {
      expect(getTotalHeight(100, 40)).toBe(4000)
      expect(getTotalHeight(0, 40)).toBe(0)
      expect(getTotalHeight(50, 30)).toBe(1500)
    })
  })

  describe('throttle', () => {
    it('应该节流函数调用', (done) => {
      let callCount = 0
      const func = (): void => {
        callCount++
      }
      const throttledFunc = throttle(func, 100)

      // 快速调用多次
      throttledFunc()
      throttledFunc()
      throttledFunc()

      // 应该只调用一次（立即执行）
      setTimeout(() => {
        expect(callCount).toBe(1)
        done()
      }, 50)
    })

    it('应该在等待时间后再次执行', (done) => {
      let callCount = 0
      const func = (): void => {
        callCount++
      }
      const throttledFunc = throttle(func, 100)

      throttledFunc()
      
      setTimeout(() => {
        throttledFunc()
        expect(callCount).toBe(2)
        done()
      }, 150)
    })
  })
})

