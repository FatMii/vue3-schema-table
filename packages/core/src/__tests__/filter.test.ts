import { describe, it, expect } from 'vitest'
import { filterData, setFilter, hasFilter, getFilterValue } from '../utils/filter'
import type { ColumnSchema, FilterConfig } from '../types'

describe('筛选工具', () => {
  const mockColumns: ColumnSchema[] = [
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      filterType: 'text',
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      filterType: 'number',
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      width: 100,
      filterType: 'select',
    },
    {
      key: 'custom',
      title: '自定义',
      dataIndex: 'custom',
      width: 100,
      filterType: 'custom',
      filterFn: (value: number, row: any): boolean => {
        // 自定义筛选：值必须大于筛选值
        return row.custom > value
      },
    },
  ]

  const mockData = [
    { name: '张三', age: 25, status: 'active', custom: 100 },
    { name: '李四', age: 30, status: 'inactive', custom: 200 },
    { name: '王五', age: 28, status: 'active', custom: 150 },
    { name: 'Zhang San', age: 35, status: 'pending', custom: 80 },
    { name: 'Li Si', age: 22, status: 'inactive', custom: 90 },
  ]

  describe('filterData', () => {
    it('应该进行文本筛选（包含匹配）', () => {
      const filterConfigs: FilterConfig = { name: '张' }
      const result = filterData(mockData, filterConfigs, mockColumns)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('张三')
    })

    it('文本筛选应该不区分大小写', () => {
      const filterConfigs: FilterConfig = { name: 'zhang' }
      const result = filterData(mockData, filterConfigs, mockColumns)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('Zhang San')
      
      // 测试大写也能匹配
      const filterConfigs2: FilterConfig = { name: 'ZHANG' }
      const result2 = filterData(mockData, filterConfigs2, mockColumns)
      expect(result2.length).toBe(1)
      expect(result2[0].name).toBe('Zhang San')
    })

    it('应该进行数字筛选（精确匹配）', () => {
      const filterConfigs: FilterConfig = { age: 25 }
      const result = filterData(mockData, filterConfigs, mockColumns)

      expect(result.length).toBe(1)
      expect(result[0].age).toBe(25)
    })

    it('应该进行选择筛选（精确匹配）', () => {
      const filterConfigs: FilterConfig = { status: 'active' }
      const result = filterData(mockData, filterConfigs, mockColumns)

      expect(result.length).toBe(2)
      expect(result.every(row => row.status === 'active')).toBe(true)
    })

    it('应该使用自定义筛选函数', () => {
      const filterConfigs: FilterConfig = { custom: 120 }
      const result = filterData(mockData, filterConfigs, mockColumns)

      expect(result.length).toBe(2)
      expect(result.every(row => row.custom > 120)).toBe(true)
    })

    it('应该支持多列筛选', () => {
      const filterConfigs: FilterConfig = {
        name: '张',
        status: 'active',
      }
      const result = filterData(mockData, filterConfigs, mockColumns)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('张三')
      expect(result[0].status).toBe('active')
    })

    it('应该处理空筛选值（不过滤）', () => {
      const filterConfigs: FilterConfig = { name: '' }
      const result = filterData(mockData, filterConfigs, mockColumns)

      expect(result.length).toBe(mockData.length)
    })

    it('应该处理空数据', () => {
      const result = filterData([], { name: '张' }, mockColumns)
      expect(result).toEqual([])
    })

    it('应该处理空筛选配置（返回原数据副本）', () => {
      const result = filterData(mockData, {}, mockColumns)

      expect(result).not.toBe(mockData) // 应该是新数组
      expect(result.length).toBe(mockData.length)
    })

    it('应该处理 null 值', () => {
      const dataWithNull = [
        { name: '张三', age: 25 },
        { name: null, age: 30 },
      ]
      const filterConfigs: FilterConfig = { name: '张' }
      const result = filterData(dataWithNull, filterConfigs, mockColumns)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('张三')
    })

    it('应该支持数组筛选（多选）', () => {
      const filterConfigs: FilterConfig = { status: ['active', 'inactive'] }
      const result = filterData(mockData, filterConfigs, mockColumns)

      // 现在有 5 条数据：张三(active)、李四(inactive)、王五(active)、Li Si(inactive)
      expect(result.length).toBe(4) // 匹配 active 或 inactive 的数据
      expect(result.every(row => ['active', 'inactive'].includes(row.status))).toBe(true)
    })

    it('应该处理空数组筛选（不过滤）', () => {
      const filterConfigs: FilterConfig = { status: [] }
      const result = filterData(mockData, filterConfigs, mockColumns)

      expect(result.length).toBe(mockData.length)
    })
  })

  describe('setFilter', () => {
    it('应该设置筛选值', () => {
      const result = setFilter({}, 'name', '张')
      expect(result.name).toBe('张')
    })

    it('应该清除筛选值（当值为空）', () => {
      const configs: FilterConfig = { name: '张' }
      const result = setFilter(configs, 'name', '')
      expect(result.name).toBeUndefined()
    })

    it('应该保留其他列的筛选', () => {
      const configs: FilterConfig = { name: '张', age: 25 }
      const result = setFilter(configs, 'status', 'active')
      expect(result.name).toBe('张')
      expect(result.age).toBe(25)
      expect(result.status).toBe('active')
    })
  })

  describe('hasFilter', () => {
    it('应该检查列是否有筛选', () => {
      const configs: FilterConfig = { name: '张' }
      expect(hasFilter(configs, 'name')).toBe(true)
      expect(hasFilter(configs, 'age')).toBe(false)
    })

    it('应该处理空配置', () => {
      expect(hasFilter({}, 'name')).toBe(false)
    })
  })

  describe('getFilterValue', () => {
    it('应该获取筛选值', () => {
      const configs: FilterConfig = { name: '张' }
      expect(getFilterValue(configs, 'name')).toBe('张')
    })

    it('应该返回 null（如果列未筛选）', () => {
      const configs: FilterConfig = { name: '张' }
      expect(getFilterValue(configs, 'age')).toBeNull()
    })
  })
})

