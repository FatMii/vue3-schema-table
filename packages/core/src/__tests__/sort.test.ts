import { describe, it, expect } from 'vitest'
import { sortData, toggleSort, getSortOrder } from '../utils/sort'
import type { ColumnSchema } from '../types'

describe('排序工具', () => {
  const mockColumns: ColumnSchema[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      sortType: 'default',
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      sortType: 'default',
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      sortType: 'default',
    },
    {
      key: 'custom',
      title: '自定义',
      dataIndex: 'custom',
      width: 100,
      sortType: 'custom',
      sortFn: (a: string, b: string): number => {
        // 自定义排序：按长度排序
        return a.length - b.length
      },
    },
  ]

  const mockData = [
    { id: 3, name: '王五', age: 28, custom: 'abc' },
    { id: 1, name: '张三', age: 25, custom: 'a' },
    { id: 2, name: '李四', age: 30, custom: 'ab' },
  ]

  describe('sortData', () => {
    it('应该对数字进行升序排序', () => {
      const sortConfigs = [{ colKey: 'id', order: 'asc' as const }]
      const result = sortData(mockData, sortConfigs, mockColumns)

      expect(result[0].id).toBe(1)
      expect(result[1].id).toBe(2)
      expect(result[2].id).toBe(3)
    })

    it('应该对数字进行降序排序', () => {
      const sortConfigs = [{ colKey: 'id', order: 'desc' as const }]
      const result = sortData(mockData, sortConfigs, mockColumns)

      expect(result[0].id).toBe(3)
      expect(result[1].id).toBe(2)
      expect(result[2].id).toBe(1)
    })

    it('应该对字符串进行排序（支持中文）', () => {
      const sortConfigs = [{ colKey: 'name', order: 'asc' as const }]
      const result = sortData(mockData, sortConfigs, mockColumns)

      expect(result[0].name).toBe('李四')
      expect(result[1].name).toBe('王五')
      expect(result[2].name).toBe('张三')
    })

    it('应该处理 null 值（排在后面）', () => {
      const dataWithNull = [
        { id: 1, name: null },
        { id: 2, name: '张三' },
        { id: 3, name: '李四' },
      ]
      const sortConfigs = [{ colKey: 'name', order: 'asc' as const }]
      const result = sortData(dataWithNull, sortConfigs, mockColumns)

      expect(result[0].name).not.toBeNull()
      expect(result[result.length - 1].name).toBeNull()
    })

    it('应该使用自定义排序函数', () => {
      const sortConfigs = [{ colKey: 'custom', order: 'asc' as const }]
      const result = sortData(mockData, sortConfigs, mockColumns)

      expect(result[0].custom).toBe('a')
      expect(result[1].custom).toBe('ab')
      expect(result[2].custom).toBe('abc')
    })

    it('应该支持多列排序', () => {
      const data = [
        { id: 1, name: '张三', age: 25 },
        { id: 2, name: '张三', age: 30 },
        { id: 3, name: '李四', age: 20 },
      ]
      const sortConfigs = [
        { colKey: 'name', order: 'asc' as const },
        { colKey: 'age', order: 'asc' as const },
      ]
      const result = sortData(data, sortConfigs, mockColumns)

      // 先按 name 排序，name 相同时按 age 排序
      expect(result[0].name).toBe('李四')
      expect(result[1].name).toBe('张三')
      expect(result[1].age).toBe(25)
      expect(result[2].name).toBe('张三')
      expect(result[2].age).toBe(30)
    })

    it('应该处理空排序配置（返回原数据副本）', () => {
      const result = sortData(mockData, [], mockColumns)

      expect(result).not.toBe(mockData) // 应该是新数组
      expect(result.length).toBe(mockData.length)
    })

    it('应该处理空数据', () => {
      const result = sortData([], [{ colKey: 'id', order: 'asc' as const }], mockColumns)
      expect(result).toEqual([])
    })
  })

  describe('toggleSort', () => {
    it('应该添加新排序', () => {
      const result = toggleSort([], 'id', 'asc')
      expect(result).toEqual([{ colKey: 'id', order: 'asc' }])
    })

    it('应该切换排序方向', () => {
      const configs = [{ colKey: 'id', order: 'asc' as const }]
      const result = toggleSort(configs, 'id', 'desc')
      expect(result).toEqual([{ colKey: 'id', order: 'desc' }])
    })

    it('应该取消相同方向的排序', () => {
      const configs = [{ colKey: 'id', order: 'asc' as const }]
      const result = toggleSort(configs, 'id', 'asc')
      expect(result).toEqual([])
    })

    it('应该保留其他列的排序', () => {
      const configs = [
        { colKey: 'name', order: 'asc' as const },
        { colKey: 'age', order: 'desc' as const },
      ]
      const result = toggleSort(configs, 'id', 'asc')
      expect(result.length).toBe(3)
      expect(result.find(s => s.colKey === 'name')).toBeDefined()
      expect(result.find(s => s.colKey === 'age')).toBeDefined()
    })
  })

  describe('getSortOrder', () => {
    it('应该返回列的排序状态', () => {
      const configs = [{ colKey: 'id', order: 'asc' as const }]
      expect(getSortOrder(configs, 'id')).toBe('asc')
    })

    it('应该返回 null（如果列未排序）', () => {
      const configs = [{ colKey: 'id', order: 'asc' as const }]
      expect(getSortOrder(configs, 'name')).toBeNull()
    })

    it('应该处理空配置', () => {
      expect(getSortOrder([], 'id')).toBeNull()
    })
  })
})

