import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DynamicTable from '../components/DynamicTable.vue'
import type { TableSchema } from '../types'

describe('DynamicTable 组件', () => {
  const mockSchema: TableSchema = {
    columns: [
      {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: 100,
        align: 'left',
      },
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        align: 'center',
      },
      {
        key: 'age',
        title: '年龄',
        dataIndex: 'age',
        width: 100,
        align: 'right',
      },
    ],
  }

  const mockData = [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 3, name: '王五', age: 28 },
  ]

  it('应该能够正确接收 data 和 schema props', () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: {
          ...mockSchema,
          table: {
            virtualScroll: false,
          },
        },
        height: 400,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('应该根据 schema.columns 渲染表头', async () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: {
          ...mockSchema,
          table: {
            virtualScroll: false, // 禁用虚拟滚动以便测试
          },
        },
        height: 400,
      },
    })

    await wrapper.vm.$nextTick()

    const headers = wrapper.findAll('.header-cell')
    expect(headers.length).toBe(3)
    
    // 查找表头标题（排除排序和筛选按钮）
    const titles = wrapper.findAll('.header-title')
    expect(titles.length).toBe(3)
    expect(titles[0].text()).toBe('ID')
    expect(titles[1].text()).toBe('姓名')
    expect(titles[2].text()).toBe('年龄')
  })

  it('应该根据 data 渲染表格行', async () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: {
          ...mockSchema,
          table: {
            virtualScroll: false, // 禁用虚拟滚动以便测试
          },
        },
        height: 400,
      },
    })

    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('.table-row')
    expect(rows.length).toBe(3)
  })

  it('应该正确渲染单元格数据', async () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: {
          ...mockSchema,
          table: {
            virtualScroll: false, // 禁用虚拟滚动以便测试
          },
        },
        height: 400,
      },
    })

    await wrapper.vm.$nextTick()

    const cells = wrapper.findAll('.table-cell')
    expect(cells.length).toBe(9) // 3行 x 3列

    // 检查第一行数据
    expect(cells[0].text()).toBe('1')
    expect(cells[1].text()).toBe('张三')
    expect(cells[2].text()).toBe('25')
  })

  it('应该正确应用列宽', async () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: {
          ...mockSchema,
          table: {
            virtualScroll: false,
          },
        },
        height: 400,
      },
    })

    await wrapper.vm.$nextTick()

    const headerCells = wrapper.findAll('.header-cell')
    expect(headerCells[0].attributes('style')).toContain('width: 100px')
    expect(headerCells[1].attributes('style')).toContain('width: 150px')
    expect(headerCells[2].attributes('style')).toContain('width: 100px')
  })

  it('应该正确应用对齐方式', async () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: {
          ...mockSchema,
          table: {
            virtualScroll: false,
          },
        },
        height: 400,
      },
    })

    await wrapper.vm.$nextTick()

    const headerCells = wrapper.findAll('.header-cell')
    expect(headerCells[0].classes()).toContain('align-left')
    expect(headerCells[1].classes()).toContain('align-center')
    expect(headerCells[2].classes()).toContain('align-right')
  })

  it('应该处理空数据', async () => {
    const wrapper = mount(DynamicTable, {
      props: {
        data: [],
        schema: {
          ...mockSchema,
          table: {
            virtualScroll: false,
          },
        },
        height: 400,
      },
    })

    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('.table-row')
    expect(rows.length).toBe(0)
  })

  it('应该处理空值显示为 "-"', async () => {
    const dataWithNull = [
      { id: 1, name: null, age: 25 },
      { id: 2, name: '', age: 30 },
      { id: 3, name: undefined, age: 28 },
    ]

    const wrapper = mount(DynamicTable, {
      props: {
        data: dataWithNull,
        schema: {
          ...mockSchema,
          table: {
            virtualScroll: false,
          },
        },
        height: 400,
      },
    })

    await wrapper.vm.$nextTick()

    const cells = wrapper.findAll('.table-cell')
    // 第一行的 name 列应该是 "-"
    expect(cells[1].text()).toBe('-')
    expect(cells[4].text()).toBe('-')
    expect(cells[7].text()).toBe('-')
  })

  it('应该过滤掉无效的列配置', async () => {
    const invalidSchema: TableSchema = {
      columns: [
        {
          key: 'id',
          title: 'ID',
          dataIndex: 'id',
          width: 100,
        },
        {
          // 无效的列配置（缺少必需字段）
          title: '无效列',
        } as any,
        {
          key: 'name',
          title: '姓名',
          dataIndex: 'name',
          width: 150,
        },
      ],
      table: {
        virtualScroll: false,
      },
    }

    const wrapper = mount(DynamicTable, {
      props: {
        data: mockData,
        schema: invalidSchema,
        height: 400,
      },
    })

    await wrapper.vm.$nextTick()

    // 应该只渲染有效的列
    const headers = wrapper.findAll('.header-cell')
    expect(headers.length).toBe(2) // 只有 id 和 name
  })
})

