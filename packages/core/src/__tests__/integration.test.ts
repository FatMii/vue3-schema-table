import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DynamicTable from '../components/DynamicTable.vue'
import { sortData } from '../utils/sort'
import { filterData } from '../utils/filter'
import type { TableSchema, ColumnSchema } from '../types'

describe('集成测试', () => {
  const mockSchema: TableSchema = {
    columns: [
      {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: 100,
        sortable: true,
      },
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'age',
        title: '年龄',
        dataIndex: 'age',
        width: 100,
        sortable: true,
        filterable: true,
        filterType: 'number',
      },
    ],
    table: {
      rowHeight: 40,
      virtualScroll: true,
      bufferSize: 10,
    },
  }

  const mockData = [
    { id: 3, name: '王五', age: 28 },
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 4, name: '赵六', age: 25 },
  ]

  it('应该正确渲染表格', () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: mockSchema,
        height: 600,
      },
    })

    expect(wrapper.exists()).toBe(true)
    const headers = wrapper.findAll('.header-cell')
    expect(headers.length).toBe(3)
  })

  it('排序和筛选应该协同工作', () => {
    // 先筛选
    const filtered = filterData(mockData, { name: '张' }, mockSchema.columns as ColumnSchema[])
    expect(filtered.length).toBe(1)

    // 再排序
    const sorted = sortData(filtered, [{ colKey: 'id', order: 'asc' }], mockSchema.columns as ColumnSchema[])
    expect(sorted[0].id).toBe(1)
  })

  it('应该处理大数据量', () => {
    const largeData = Array.from({ length: 5000 }, (_, i) => ({
      id: i + 1,
      name: `用户${i + 1}`,
      age: 20 + (i % 40),
    }))

    const wrapper = mount(DynamicTable, {
      props: {
        data: largeData,
        schema: mockSchema,
        height: 600,
      },
    })

    expect(wrapper.exists()).toBe(true)
    // 应该只渲染可见行，而不是全部 5000 行
    const rows = wrapper.findAll('.table-row')
    expect(rows.length).toBeLessThan(100) // 虚拟滚动只渲染可见行
  })

  it('应该处理空数据', () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: [],
        schema: mockSchema,
        height: 600,
      },
    })

    expect(wrapper.exists()).toBe(true)
    const rows = wrapper.findAll('.table-row')
    expect(rows.length).toBe(0)
  })

  it('应该处理无效的 Schema', () => {
    const invalidSchema: TableSchema = {
      columns: [
        {
          // 缺少必需字段
          title: '无效列',
        } as any,
      ],
    }

    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: invalidSchema,
        height: 600,
      },
    })

    // 应该过滤掉无效列
    const headers = wrapper.findAll('.header-cell')
    expect(headers.length).toBe(0)
  })
})

