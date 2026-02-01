import { describe, it, expect } from 'vitest'
import { validateColumn, validateSchema, mergeDefaultConfig, defaultTableConfig } from '../schema/tableSchema'
import type { ColumnSchema, TableSchema } from '../types'

describe('Schema 验证', () => {
  describe('validateColumn', () => {
    it('应该验证有效的列配置', () => {
      const column: ColumnSchema = {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: 100,
        align: 'left',
      }
      expect(validateColumn(column)).toBe(true)
    })

    it('应该拒绝缺少必需字段的列配置', () => {
      expect(validateColumn({} as ColumnSchema)).toBe(false)
      expect(validateColumn({ key: 'id' } as ColumnSchema)).toBe(false)
      expect(validateColumn({ key: 'id', title: 'ID' } as ColumnSchema)).toBe(false)
    })

    it('应该验证列宽', () => {
      const column1: ColumnSchema = {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: 100,
      }
      expect(validateColumn(column1)).toBe(true)

      const column2: ColumnSchema = {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: -10,
      }
      expect(validateColumn(column2)).toBe(false)
    })

    it('应该验证对齐方式', () => {
      const validAligns: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right']
      validAligns.forEach((align) => {
        const column: ColumnSchema = {
          key: 'id',
          title: 'ID',
          dataIndex: 'id',
          align,
        }
        expect(validateColumn(column)).toBe(true)
      })

      const column: ColumnSchema = {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        align: 'invalid' as any,
      }
      expect(validateColumn(column)).toBe(false)
    })

    it('应该验证自定义排序函数', () => {
      const column1: ColumnSchema = {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: 100,
        sortable: true,
        sortType: 'custom',
        sortFn: (a: any, b: any) => a - b,
      }
      expect(validateColumn(column1)).toBe(true)

      const column2: ColumnSchema = {
        key: 'id',
        title: 'ID',
        dataIndex: 'id',
        width: 100,
        sortable: true,
        sortType: 'custom',
        // 缺少 sortFn
      }
      expect(validateColumn(column2)).toBe(false)
    })

    it('应该验证自定义筛选函数', () => {
      const column1: ColumnSchema = {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        filterable: true,
        filterType: 'custom',
        filterFn: (value: any, row: any) => row.name.includes(value),
      }
      expect(validateColumn(column1)).toBe(true)

      const column2: ColumnSchema = {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        filterable: true,
        filterType: 'custom',
        // 缺少 filterFn
      }
      expect(validateColumn(column2)).toBe(false)
    })

    it('应该验证 select 类型的筛选选项', () => {
      const column1: ColumnSchema = {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 100,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
        ],
      }
      expect(validateColumn(column1)).toBe(true)

      const column2: ColumnSchema = {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 100,
        filterable: true,
        filterType: 'select',
        // 缺少 filterOptions
      }
      expect(validateColumn(column2)).toBe(false)
    })
  })

  describe('validateSchema', () => {
    it('应该验证有效的 Schema', () => {
      const schema: TableSchema = {
        columns: [
          {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            width: 100,
          },
        ],
        table: {
          rowHeight: 40,
        },
      }
      const result = validateSchema(schema)
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('应该拒绝空的 Schema', () => {
      const result = validateSchema(null)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('应该拒绝缺少 columns 的 Schema', () => {
      const result = validateSchema({} as TableSchema)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('应该拒绝空的 columns 数组', () => {
      const result = validateSchema({ columns: [] } as TableSchema)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('应该验证表格配置', () => {
      const schema1: TableSchema = {
        columns: [
          {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            width: 100,
          },
        ],
        table: {
          rowHeight: 40,
          bufferSize: 10,
        },
      }
      expect(validateSchema(schema1).valid).toBe(true)

      const schema2: TableSchema = {
        columns: [
          {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            width: 100,
          },
        ],
        table: {
          rowHeight: -10, // 无效
        },
      }
      expect(validateSchema(schema2).valid).toBe(false)
    })
  })

  describe('mergeDefaultConfig', () => {
    it('应该合并默认配置', () => {
      const schema: TableSchema = {
        columns: [
          {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            width: 100,
          },
        ],
      }
      const merged = mergeDefaultConfig(schema)
      
      expect(merged.table?.rowHeight).toBe(defaultTableConfig.rowHeight)
      expect(merged.table?.virtualScroll).toBe(defaultTableConfig.virtualScroll)
      expect(merged.table?.bufferSize).toBe(defaultTableConfig.bufferSize)
    })

    it('应该保留用户的自定义配置', () => {
      const schema: TableSchema = {
        columns: [
          {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            align: 'center',
            sortable: true,
          },
        ],
        table: {
          rowHeight: 50,
        },
      }
      const merged = mergeDefaultConfig(schema)
      
      expect(merged.columns[0].align).toBe('center')
      expect(merged.columns[0].sortable).toBe(true)
      expect(merged.table?.rowHeight).toBe(50)
    })

    it('应该为列添加默认值', () => {
      const schema: TableSchema = {
        columns: [
          {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            width: 100,
          },
          {
            key: 'name',
            title: '姓名',
            dataIndex: 'name',
            width: 150,
          },
        ],
      }
      const merged = mergeDefaultConfig(schema)
      
      // ID 列默认不启用排序和筛选
      expect(merged.columns[0].align).toBe('left')
      expect(merged.columns[0].sortable).toBe(false)
      expect(merged.columns[0].filterable).toBe(false)
      
      // 其他列默认启用排序和筛选
      expect(merged.columns[1].align).toBe('left')
      expect(merged.columns[1].sortable).toBe(true)
      expect(merged.columns[1].filterable).toBe(true)
    })
    
    it('应该保留用户的自定义配置（即使覆盖默认值）', () => {
      const schema: TableSchema = {
        columns: [
          {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            sortable: true, // 用户明确设置为 true（覆盖默认的 false）
          },
          {
            key: 'name',
            title: '姓名',
            dataIndex: 'name',
            width: 150,
            sortable: false, // 用户明确设置为 false（覆盖默认的 true）
            filterable: false, // 用户明确设置为 false（覆盖默认的 true）
          },
          {
            key: 'age',
            title: '年龄',
            dataIndex: 'age',
            width: 100,
            // 不设置 sortable 和 filterable，应该使用默认值 true
          },
        ],
      }
      const merged = mergeDefaultConfig(schema)
      
      // ID 列：用户明确设置为 true，应该保留
      expect(merged.columns[0].sortable).toBe(true)
      
      // name 列：用户明确设置为 false，应该保留（禁用排序和筛选）
      expect(merged.columns[1].sortable).toBe(false)
      expect(merged.columns[1].filterable).toBe(false)
      
      // age 列：未设置，应该使用默认值 true（非 ID 列默认启用）
      expect(merged.columns[2].sortable).toBe(true)
      expect(merged.columns[2].filterable).toBe(true)
    })
  })
})

