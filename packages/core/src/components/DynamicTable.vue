<template>
  <div class="dynamic-table-wrapper">
    <!-- 表头 -->
    <div class="table-header" :class="{ 'has-fixed': hasFixedColumns }">
      <!-- 左侧固定表头层：选择列 + 左固定列 -->
      <div
        v-if="rowSelection || leftFixedColumns.length > 0"
        class="header-fixed-left-layer"
        :style="{ width: leftFixedWidth + 'px' }"
      >
        <div class="header-row">
          <!-- 行选择列表头（如果有配置） -->
          <div
            v-if="rowSelection"
            class="header-cell header-cell-selection"
            :style="{ width: '50px', minWidth: '50px' }"
          >
            <VstCheckbox
              :checked="isAllSelected()"
              :indeterminate="isIndeterminate()"
              @change="handleSelectAll"
            />
          </div>

          <!-- 左固定列表头 -->
          <template v-for="column in leftFixedColumns" :key="column.key">
            <div
              :ref="el => setHeaderCellRef(el as HTMLElement | null, column.key)"
              class="header-cell header-cell-fixed-left"
              :class="[
                `align-${column.align || 'left'}`,
                { resizable: column.resizable !== false },
              ]"
              :style="{
                width: (columnWidths[column.key] || column.width) + 'px',
                minWidth: (columnWidths[column.key] || column.width) + 'px',
              }"
            >
              <div class="header-cell-content">
                <span class="header-title">{{ column.title }}</span>
                <div class="header-actions">
                  <div v-if="column.sortable !== false" class="header-sort-buttons">
                    <span
                      class="sort-btn"
                      :class="{ active: getSortOrder(column.key) === 'asc' }"
                      @click.stop="handleSort(column.key, 'asc')"
                      title="升序"
                    >
                      ↑
                    </span>
                    <span
                      class="sort-btn"
                      :class="{ active: getSortOrder(column.key) === 'desc' }"
                      @click.stop="handleSort(column.key, 'desc')"
                      title="降序"
                    >
                      ↓
                    </span>
                  </div>
                  <VstPopover
                    v-if="column.filterable !== false"
                    v-model:visible="filterPopoverVisible[column.key]"
                    trigger="click"
                    placement="bottomLeft"
                  >
                    <template #content>
                      <FilterPanel
                        :options="getFilterOptions(column)"
                        :selectedValues="getFilterSelectedValues(column.key)"
                        @confirm="(values: any[]) => handleFilterConfirm(column, values)"
                        @cancel="() => handleFilterCancel(column.key)"
                      />
                    </template>
                    <div class="header-filter-btn" title="筛选">
                      <span class="filter-icon" :class="{ active: hasFilter(column.key) }">
                        🔍
                      </span>
                    </div>
                  </VstPopover>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 中间可滚动表头层：只渲染普通列 -->
      <div
        class="header-scroll"
        ref="tableHeaderRef"
        @scroll="handleHeaderScroll"
        :style="{
          marginLeft: rowSelection || leftFixedColumns.length > 0 ? leftFixedWidth + 'px' : '0px',
          marginRight: rightFixedColumns.length > 0 ? rightFixedWidth + 'px' : '0px',
        }"
      >
        <div class="header-row">
          <div
            v-for="column in normalColumns"
            :key="column.key"
            :ref="el => setHeaderCellRef(el as HTMLElement | null, column.key)"
            class="header-cell"
            :class="[`align-${column.align || 'left'}`, { resizable: column.resizable !== false }]"
            :style="{
              width: (columnWidths[column.key] || column.width) + 'px',
              minWidth: (columnWidths[column.key] || column.width) + 'px',
            }"
          >
            <div class="header-cell-content">
              <span class="header-title">{{ column.title }}</span>
              <div class="header-actions">
                <div v-if="column.sortable !== false" class="header-sort-buttons">
                  <span
                    class="sort-btn"
                    :class="{ active: getSortOrder(column.key) === 'asc' }"
                    @click.stop="handleSort(column.key, 'asc')"
                    title="升序"
                  >
                    ↑
                  </span>
                  <span
                    class="sort-btn"
                    :class="{ active: getSortOrder(column.key) === 'desc' }"
                    @click.stop="handleSort(column.key, 'desc')"
                    title="降序"
                  >
                    ↓
                  </span>
                </div>
                <VstPopover
                  v-if="column.filterable !== false"
                  v-model:visible="filterPopoverVisible[column.key]"
                  trigger="click"
                  placement="bottomLeft"
                >
                  <template #content>
                    <FilterPanel
                      :options="getFilterOptions(column)"
                      :selectedValues="getFilterSelectedValues(column.key)"
                      @confirm="values => handleFilterConfirm(column, values)"
                      @cancel="() => handleFilterCancel(column.key)"
                    />
                  </template>
                  <div class="header-filter-btn" title="筛选">
                    <span class="filter-icon" :class="{ active: hasFilter(column.key) }"> 🔍 </span>
                  </div>
                </VstPopover>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧固定表头层 -->
      <div
        v-if="rightFixedColumns.length > 0"
        class="header-fixed-right-layer"
        :style="{ width: rightFixedWidth + 'px' }"
      >
        <div class="header-row">
          <template v-for="column in rightFixedColumns" :key="column.key">
            <div
              :ref="el => setHeaderCellRef(el as HTMLElement | null, column.key)"
              class="header-cell header-cell-fixed-right"
              :class="[
                `align-${column.align || 'left'}`,
                { resizable: column.resizable !== false },
              ]"
              :style="{
                width: (columnWidths[column.key] || column.width) + 'px',
                minWidth: (columnWidths[column.key] || column.width) + 'px',
              }"
            >
              <div class="header-cell-content">
                <span class="header-title">{{ column.title }}</span>
                <div class="header-actions">
                  <div v-if="column.sortable !== false" class="header-sort-buttons">
                    <span
                      class="sort-btn"
                      :class="{ active: getSortOrder(column.key) === 'asc' }"
                      @click.stop="handleSort(column.key, 'asc')"
                      title="升序"
                    >
                      ↑
                    </span>
                    <span
                      class="sort-btn"
                      :class="{ active: getSortOrder(column.key) === 'desc' }"
                      @click.stop="handleSort(column.key, 'desc')"
                      title="降序"
                    >
                      ↓
                    </span>
                  </div>
                  <VstPopover
                    v-if="column.filterable !== false"
                    v-model:visible="filterPopoverVisible[column.key]"
                    trigger="click"
                    placement="bottomLeft"
                  >
                    <template #content>
                      <FilterPanel
                        :options="getFilterOptions(column)"
                        :selectedValues="getFilterSelectedValues(column.key)"
                        @confirm="(values: any[]) => handleFilterConfirm(column, values)"
                        @cancel="() => handleFilterCancel(column.key)"
                      />
                    </template>
                    <div class="header-filter-btn" title="筛选">
                      <span class="filter-icon" :class="{ active: hasFilter(column.key) }">
                        🔍
                      </span>
                    </div>
                  </VstPopover>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 表格主体（虚拟滚动容器） -->
    <div
      class="table-body"
      ref="tableBodyRef"
      :style="{ height: containerHeight + 'px' }"
      @scroll="handleScroll"
    >
      <!-- 占位层（用于撑起总高度） -->
      <div class="table-placeholder" :style="{ height: totalHeight + 'px' }"></div>

      <!-- 可见行容器 -->
      <div class="table-rows" :style="{ transform: `translateY(${offsetY}px)` }">
        <!-- 渲染可见行 -->
        <div
          v-for="row in visibleRows"
          :key="`row-${row._globalIndex}`"
          class="table-row"
          :style="{ height: rowHeight + 'px' }"
        >
          <!-- 行选择列 -->
          <div
            v-if="rowSelection"
            class="table-cell table-cell-selection"
            :style="{ width: '50px', minWidth: '50px' }"
          >
            <VstCheckbox
              :checked="isRowSelected(row, row._globalIndex)"
              @change="(checked: boolean) => handleSelectRow(row, row._globalIndex, checked)"
            />
          </div>

          <!-- 固定左侧列 -->
          <template v-if="leftFixedColumns.length > 0">
            <div
              v-for="column in leftFixedColumns"
              :key="column.key"
              class="table-cell table-cell-fixed-left"
              :class="`align-${column.align || 'left'}`"
              :style="{
                width: (columnWidths[column.key] || column.width) + 'px',
                minWidth: (columnWidths[column.key] || column.width) + 'px',
                left: getLeftFixedPosition(column, false) + 'px',
              }"
            >
              {{ getCellValue(row, column) }}
            </div>
          </template>

          <!-- 普通列 -->
          <div
            v-for="column in normalColumns"
            :key="column.key"
            class="table-cell"
            :class="`align-${column.align || 'left'}`"
            :style="{
              width: (columnWidths[column.key] || column.width) + 'px',
              minWidth: (columnWidths[column.key] || column.width) + 'px',
            }"
          >
            {{ getCellValue(row, column) }}
          </div>

          <!-- 固定右侧列 -->
          <template v-if="rightFixedColumns.length > 0">
            <div
              v-for="column in rightFixedColumns"
              :key="column.key"
              class="table-cell table-cell-fixed-right"
              :class="`align-${column.align || 'left'}`"
              :style="{
                width: (columnWidths[column.key] || column.width) + 'px',
                minWidth: (columnWidths[column.key] || column.width) + 'px',
                right: getRightFixedPosition(column) + 'px',
              }"
            >
              {{ getCellValue(row, column) }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { validateSchema, mergeDefaultConfig } from '../schema/tableSchema'
import { calculateVisibleRange, getTotalHeight, throttle } from '../utils/virtualScroll'
import { sortData, toggleSort, getSortOrder as getSortOrderUtil } from '../utils/sort'
import { filterData, setFilter, hasFilter as hasFilterUtil, getFilterValue } from '../utils/filter'
import { initColumnResize } from '../utils/columnResize'
import FilterPanel from './FilterPanel.vue'
import VstCheckbox from './ui/Checkbox.vue'
import VstPopover from './ui/Popover.vue'
import type {
  TableSchema,
  ColumnSchema,
  SortConfig,
  FilterConfig,
  SortOrder,
  FilterOption,
} from '../types'

interface Props {
  /** 表格数据 */
  data?: any[]
  /** Schema 配置 */
  schema: TableSchema
  /** 容器高度 */
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  height: 600,
})

// 引用
const tableBodyRef = ref<HTMLElement | null>(null)
const tableHeaderRef = ref<HTMLElement | null>(null)

// 验证并合并 Schema
const validatedSchema = computed(() => {
  const validation = validateSchema(props.schema)
  if (!validation.valid) {
    console.warn('### Schema 验证失败', validation.errors)
    return null
  }
  return mergeDefaultConfig(props.schema)
})

// 安全的列配置（过滤掉无效的列）
const safeColumns = computed<ColumnSchema[]>(() => {
  if (!validatedSchema.value || !Array.isArray(validatedSchema.value.columns)) {
    return []
  }
  // 过滤掉无效的列（必须有 key、title 和 dataIndex）
  return validatedSchema.value.columns.filter((col): col is ColumnSchema => {
    return !!(col && col.key && col.title && col.dataIndex)
  })
})

// 列分组：固定左侧、普通列、固定右侧
const leftFixedColumns = computed(() => {
  return safeColumns.value.filter((col: ColumnSchema) => col.fixed === 'left')
})

const normalColumns = computed(() => {
  return safeColumns.value.filter(
    (col: ColumnSchema) => !col.fixed || (col.fixed !== 'left' && col.fixed !== 'right')
  )
})

const rightFixedColumns = computed(() => {
  return safeColumns.value.filter((col: ColumnSchema) => col.fixed === 'right')
})

// 计算固定左侧列的总宽度
const leftFixedWidth = computed(() => {
  const selectionWidth = rowSelection.value ? 50 : 0
  return leftFixedColumns.value.reduce((sum: number, col: ColumnSchema) => {
    return sum + (columnWidths.value[col.key] || col.width || 100)
  }, selectionWidth)
})

// 计算固定右侧列的总宽度
const rightFixedWidth = computed(() => {
  return rightFixedColumns.value.reduce((sum: number, col: ColumnSchema) => {
    return sum + (columnWidths.value[col.key] || col.width || 100)
  }, 0)
})

// 是否有固定列
const hasFixedColumns = computed(() => {
  return leftFixedColumns.value.length > 0 || rightFixedColumns.value.length > 0
})

// 滚动位置（用于同步固定列）
const scrollLeft = ref(0)
// 防止循环滚动的标志
const isSyncingScroll = ref(false)

// 行选择配置
const rowSelection = computed(() => validatedSchema.value?.table?.rowSelection)
const selectedRowKeys = ref<(string | number)[]>([]) // 选中的行key数组

// 获取行的唯一标识（优先使用rowKey，否则使用id）
function getRowKey(row: any, index: number): string | number {
  if (rowSelection.value?.rowKey) {
    if (typeof rowSelection.value.rowKey === 'function') {
      return rowSelection.value.rowKey(row)
    }
    return row[rowSelection.value.rowKey]
  }
  return row.id || row.key || index
}

// 行选择相关函数
function handleSelectAll(checked: boolean) {
  if (checked) {
    selectedRowKeys.value = filteredAndSortedData.value.map((row: any, index: number) =>
      getRowKey(row, index)
    )
  } else {
    selectedRowKeys.value = []
  }
  console.log('### 全选变化', { checked, selectedRowKeys: selectedRowKeys.value })
}

function handleSelectRow(row: any, index: number, checked: boolean) {
  const rowKey = getRowKey(row, index)
  if (checked) {
    if (!selectedRowKeys.value.includes(rowKey)) {
      selectedRowKeys.value.push(rowKey)
    }
  } else {
    const idx = selectedRowKeys.value.indexOf(rowKey)
    if (idx > -1) {
      selectedRowKeys.value.splice(idx, 1)
    }
  }
  console.log('### 行选择变化', { rowKey, checked, selectedRowKeys: selectedRowKeys.value })
}

function isRowSelected(row: any, index: number): boolean {
  const rowKey = getRowKey(row, index)
  return selectedRowKeys.value.includes(rowKey)
}

function isAllSelected(): boolean {
  if (filteredAndSortedData.value.length === 0) return false
  return filteredAndSortedData.value.every((row: any, index: number) => isRowSelected(row, index))
}

function isIndeterminate(): boolean {
  const selectedCount = filteredAndSortedData.value.filter((row: any, index: number) =>
    isRowSelected(row, index)
  ).length
  return selectedCount > 0 && selectedCount < filteredAndSortedData.value.length
}

// 计算固定列位置（表头：从0开始；行单元格：从选择列宽度开始）
function getLeftFixedPosition(column: ColumnSchema, isHeader = false): number {
  // 表头的固定列不需要考虑选择列宽度（因为选择列在 flex 布局中是独立的）
  // 行单元格的固定列需要考虑选择列宽度（因为选择列在 flex 布局中是独立的）
  const selectionWidth = isHeader || !rowSelection.value ? 0 : 50
  let position = selectionWidth
  for (const col of leftFixedColumns.value) {
    if (col.key === column.key) {
      break
    }
    const colWidth = columnWidths.value[col.key] || col.width || 100
    position += colWidth
  }
  return position
}

function getRightFixedPosition(column: ColumnSchema): number {
  let position = 0
  const reversedColumns = [...rightFixedColumns.value].reverse()
  for (const col of reversedColumns) {
    if (col.key === column.key) {
      break
    }
    position += columnWidths.value[col.key] || col.width || 100
  }
  return position
}

// 计算普通列的左边距（用于占位，避免被固定列遮挡）
// const normalColumnsLeftOffset = computed(() => {
//   const selectionWidth = rowSelection.value ? 50 : 0
//   return selectionWidth + leftFixedWidth.value - (rowSelection.value ? 50 : 0)
// })

// 表格配置
const rowHeight = computed(() => validatedSchema.value?.table?.rowHeight || 40)
const headerHeight = computed(() => 50) // 表头高度
const bufferSize = computed(() => validatedSchema.value?.table?.bufferSize || 10)
const containerHeight = computed(() => props.height - headerHeight.value)
const useVirtualScroll = computed(() => validatedSchema.value?.table?.virtualScroll !== false)

// 虚拟滚动状态
const scrollTop = ref(0)
const visibleRange = ref<{ startIndex: number; endIndex: number; offsetY: number }>({
  startIndex: 0,
  endIndex: 0,
  offsetY: 0,
})

// 排序状态
const sortConfigs = ref<SortConfig[]>([]) // [{ colKey, order: 'asc'|'desc' }]

// 筛选状态
const filterConfigs = ref<FilterConfig>({}) // { colKey: filterValue | filterValue[] }
// Popover 显示状态
const filterPopoverVisible = ref<Record<string, boolean>>({}) // { colKey: boolean }

// 列宽管理
const columnWidths = ref<Record<string, number>>({}) // { colKey: width }
const headerCellRefs = ref<Record<string, HTMLElement>>({}) // { colKey: HTMLElement }
const resizeHandlers = ref<Record<string, { destroy: () => void } | null>>({}) // { colKey: { destroy } }

// 先筛选后排序的数据
const filteredAndSortedData = computed(() => {
  if (!Array.isArray(props.data) || props.data.length === 0) {
    return []
  }

  // 先筛选
  let result = filterData(props.data, filterConfigs.value, safeColumns.value)

  // 再排序
  if (sortConfigs.value.length > 0) {
    result = sortData(result, sortConfigs.value, safeColumns.value)
  }

  return result
})

// 计算总高度
const totalHeight = computed(() => {
  if (!useVirtualScroll.value) {
    return 0
  }
  return getTotalHeight(filteredAndSortedData.value.length, rowHeight.value)
})

// 计算可见行
const visibleRows = computed(() => {
  const data = filteredAndSortedData.value

  if (!useVirtualScroll.value) {
    // 不使用虚拟滚动时，返回所有数据
    return data.map((row: any, index: number) => ({
      ...row,
      _globalIndex: index,
    }))
  }

  const { startIndex, endIndex } = visibleRange.value

  // 边界检查
  if (startIndex < 0 || endIndex < startIndex) {
    return []
  }

  const safeStartIndex = Math.max(0, Math.min(startIndex, data.length))
  const safeEndIndex = Math.max(safeStartIndex, Math.min(endIndex, data.length))

  if (safeEndIndex <= safeStartIndex) {
    return []
  }

  const rows = data.slice(safeStartIndex, safeEndIndex)
  return rows.map((row: any, localIndex: number) => ({
    ...row,
    _globalIndex: safeStartIndex + localIndex,
  }))
})

// 获取偏移量
const offsetY = computed(() => visibleRange.value.offsetY || 0)

// 更新可见范围
function updateVisibleRange() {
  if (!useVirtualScroll.value) {
    return
  }

  const result = calculateVisibleRange(
    scrollTop.value,
    containerHeight.value,
    rowHeight.value,
    filteredAndSortedData.value.length,
    bufferSize.value
  )

  visibleRange.value = result
}

// 滚动处理（使用节流优化性能）
const handleScroll = throttle((event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
  const newScrollLeft = target.scrollLeft
  scrollLeft.value = newScrollLeft

  // 同步表头滚动
  if (!isSyncingScroll.value && tableHeaderRef.value) {
    isSyncingScroll.value = true
    tableHeaderRef.value.scrollLeft = newScrollLeft
    // 使用 requestAnimationFrame 确保在下一帧重置标志
    requestAnimationFrame(() => {
      isSyncingScroll.value = false
    })
  }

  updateVisibleRange()
}, 16) // 约60fps

// 表头滚动处理（同步到表体）
function handleHeaderScroll(event: Event) {
  const target = event.target as HTMLElement
  if (!isSyncingScroll.value && tableBodyRef.value) {
    isSyncingScroll.value = true
    tableBodyRef.value.scrollLeft = target.scrollLeft
    requestAnimationFrame(() => {
      isSyncingScroll.value = false
    })
  }
}

// 获取单元格值
function getCellValue(row: any, column: ColumnSchema): any {
  const value = row[column.dataIndex]
  if (value === null || value === undefined || value === '') {
    return '-'
  }
  return value
}

// 排序处理
function handleSort(colKey: string, order: SortOrder) {
  sortConfigs.value = toggleSort(sortConfigs.value, colKey, order)
  console.log('### 排序变化', { colKey, order, sortConfigs: sortConfigs.value })
}

// 获取列的排序状态
function getSortOrder(colKey: string): SortOrder | null {
  return getSortOrderUtil(sortConfigs.value, colKey)
}

// 获取列的筛选选项（从数据中提取唯一值）
function getFilterOptions(column: ColumnSchema): FilterOption[] {
  if (!Array.isArray(props.data) || props.data.length === 0) {
    return []
  }

  // 提取唯一值
  const uniqueValues = new Set<any>()
  props.data.forEach((row: any) => {
    const value = row[column.dataIndex]
    if (value !== null && value !== undefined && value !== '') {
      uniqueValues.add(value)
    }
  })

  // 转换为选项数组并排序
  return Array.from(uniqueValues)
    .sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b
      }
      return String(a).localeCompare(String(b), 'zh-CN')
    })
    .map(value => ({
      label: String(value),
      value: value,
    }))
}

// 获取当前列的已选筛选值
function getFilterSelectedValues(colKey: string): any[] {
  const filterValue = getFilterValue(filterConfigs.value, colKey)
  if (Array.isArray(filterValue)) {
    return filterValue
  }
  if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
    return [filterValue]
  }
  return []
}

// 筛选确认
function handleFilterConfirm(column: ColumnSchema, selectedValues: any[]) {
  if (selectedValues.length === 0) {
    // 清除筛选
    filterConfigs.value = setFilter(filterConfigs.value, column.key, null)
  } else if (selectedValues.length === 1) {
    // 单个值，直接设置
    filterConfigs.value = setFilter(filterConfigs.value, column.key, selectedValues[0])
  } else {
    // 多个值，设置为数组
    filterConfigs.value = setFilter(filterConfigs.value, column.key, selectedValues)
  }

  // 关闭 Popover
  filterPopoverVisible.value[column.key] = false

  console.log('### 筛选变化', {
    colKey: column.key,
    filterValue: selectedValues,
    filterConfigs: filterConfigs.value,
  })
}

// 筛选取消
function handleFilterCancel(colKey: string) {
  filterPopoverVisible.value[colKey] = false
}

// 检查列是否有筛选
function hasFilter(colKey: string): boolean {
  return hasFilterUtil(filterConfigs.value, colKey)
}

// 设置表头单元格引用并初始化拖拽
function setHeaderCellRef(el: HTMLElement | null, colKey: string) {
  if (el) {
    // 如果元素已经存在且相同，不重复初始化
    if (headerCellRefs.value[colKey] === el) {
      return
    }

    headerCellRefs.value[colKey] = el

    // 使用 nextTick 延迟初始化，避免在响应式更新过程中初始化
    nextTick(() => {
      // 再次检查元素是否还存在
      if (headerCellRefs.value[colKey] === el) {
        initColumnResizeForColumn(el, colKey)
      }
    })
  } else {
    // 元素被移除时，清理引用
    if (headerCellRefs.value[colKey]) {
      delete headerCellRefs.value[colKey]
    }
  }
}

// 为列初始化拖拽调整
function initColumnResizeForColumn(headerCell: HTMLElement, colKey: string) {
  const column = safeColumns.value.find((col: ColumnSchema) => col.key === colKey)
  // 如果列配置了 resizable: false，则不启用拖拽
  if (!column || column.resizable === false) {
    return
  }

  // 清理旧的处理器
  if (resizeHandlers.value[colKey]) {
    resizeHandlers.value[colKey]?.destroy()
    delete resizeHandlers.value[colKey]
  }

  // 创建新的拖拽处理器
  const handler = initColumnResize(
    headerCell,
    // 拖拽结束时的回调（更新响应式数据）
    (newWidth: number) => {
      if (columnWidths.value[colKey] !== newWidth) {
        columnWidths.value[colKey] = newWidth
        console.log('### 列宽变化', { colKey, width: newWidth })
      }
    },
    // 拖拽过程中的实时回调（直接更新DOM，提升用户体验）
    (newWidth: number) => {
      // 实时更新响应式数据，让行单元格宽度也跟着变化
      columnWidths.value[colKey] = newWidth
    }
  )

  resizeHandlers.value[colKey] = handler
}

// 初始化
onMounted(() => {
  nextTick(() => {
    updateVisibleRange()
  })
})

// 清理
onUnmounted(() => {
  // 清理拖拽处理器
  Object.values(resizeHandlers.value).forEach(handler => {
    if (handler?.destroy) {
      handler.destroy()
    }
  })
  resizeHandlers.value = {}
})

// 监听数据变化
watch(
  () => props.data.length,
  () => {
    nextTick(() => {
      updateVisibleRange()
    })
  },
  { flush: 'post' }
)

// 监听排序变化
watch(
  () => sortConfigs.value.length,
  () => {
    nextTick(() => {
      updateVisibleRange()
    })
  },
  { flush: 'post' }
)

// 监听筛选变化
watch(
  () => Object.keys(filterConfigs.value).length,
  () => {
    nextTick(() => {
      updateVisibleRange()
    })
  },
  { flush: 'post' }
)

// 监听容器高度变化
watch(
  () => containerHeight.value,
  () => {
    if (containerHeight.value > 0) {
      nextTick(() => {
        updateVisibleRange()
      })
    }
  },
  { flush: 'post' }
)
</script>

<style scoped lang="scss">
.dynamic-table-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
}

.table-header {
  flex-shrink: 0;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  position: relative;
  z-index: 10;
  // 外层不滚动，只让内层 .header-scroll 横向滚动，避免影响 sticky / 固定层
  overflow: hidden;
}

.header-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  // 隐藏表头自身的滚动条，只通过 body 的滚动条来控制
  scrollbar-width: none; // Firefox
}

.header-scroll::-webkit-scrollbar {
  display: none; // Chrome / Safari
}

.header-fixed-left-layer,
.header-fixed-right-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 11;
  pointer-events: none; // 默认不拦截事件
}

.header-fixed-left-layer {
  left: 0;
}

.header-fixed-right-layer {
  right: 0;
}

// 让实际的单元格可以正常响应点击（排序 / 筛选）
.header-fixed-left-layer .header-cell,
.header-fixed-right-layer .header-cell {
  pointer-events: auto;
}

.header-row {
  display: flex;
  width: 100%;
  position: relative;
  align-items: stretch;
  // 确保固定列在 flex 布局中正常排列
  min-width: fit-content;
}

.header-cell {
  flex-shrink: 0;
  padding: 12px;
  font-weight: 600;
  color: #262626;
  border-right: 1px solid #e8e8e8;
  background: #fafafa;

  &.align-left {
    text-align: left;
  }

  &.align-center {
    text-align: center;
  }

  &.align-right {
    text-align: right;
  }

  &:last-child {
    border-right: none;
  }

  // 固定列样式
  &.header-cell-fixed-left {
    position: sticky;
    z-index: 11;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  }

  &.header-cell-fixed-right {
    position: sticky;
    right: 0;
    z-index: 11;
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  }

  &.header-cell-selection {
    position: sticky;
    left: 0;
    z-index: 12;
    background: #fafafa;
  }

  .header-cell-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .header-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .header-sort-buttons {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .sort-btn {
      cursor: pointer;
      font-size: 12px;
      line-height: 1.2;
      color: #595959;
      transition: all 0.2s;
      user-select: none;
      padding: 2px 3px;
      border-radius: 2px;

      &:hover {
        color: #1890ff;
        background-color: #e6f7ff;
      }

      &.active {
        color: #1890ff;
        font-weight: bold;
        background-color: #bae7ff;
      }
    }

    .header-filter-btn {
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 2px;
      transition: all 0.2s;

      &:hover {
        background-color: #e6f7ff;
      }

      .filter-icon {
        font-size: 14px;
        display: inline-block;
        line-height: 1;
        opacity: 0.8;

        &.active {
          opacity: 1;
          filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%)
            hue-rotate(346deg) brightness(104%) contrast(97%);
        }
      }
    }
  }

  &.resizable {
    .column-resize-handle {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      cursor: col-resize;
      user-select: none;
      z-index: 10;
      background: transparent;
      transition: background-color 0.2s;

      &:hover {
        background-color: #1890ff;
      }
    }
  }
}

  .table-body {
    flex: 1;
    overflow: auto;
    position: relative;
    /* 优化滚动性能 */
    will-change: scroll-position;
    /* 关键：移除 transform，因为它会创建新的定位上下文，导致 position: sticky 失效 */
    /* 虽然 .table-rows 的 translateY() 仍然会创建定位上下文，但至少减少一个 transform */
    /* transform: translateZ(0); */
    -webkit-overflow-scrolling: touch;
  }

.table-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  pointer-events: none;
}

.table-rows {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* 优化渲染性能 */
  will-change: transform;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

.table-row {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  position: relative;
  // 确保固定列在 flex 布局中正常排列，与表头对齐
  align-items: stretch;
  min-width: fit-content; // 确保固定列在 flex 布局中正常排列

  &:hover {
    background-color: #fafafa;
  }

  &:last-child {
    border-bottom: none;
  }
}

.table-cell {
  flex-shrink: 0;
  padding: 12px;
  border-right: 1px solid #f0f0f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: #fff;

  &.align-left {
    text-align: left;
  }

  &.align-center {
    text-align: center;
  }

  &.align-right {
    text-align: right;
  }

  &:last-child {
    border-right: none;
  }

  // 固定列样式
  &.table-cell-fixed-left {
    position: sticky;
    z-index: 9;
    background: #fff;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  }

  &.table-cell-fixed-right {
    position: sticky;
    right: 0;
    z-index: 9;
    background: #fff;
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  }

  &.table-cell-selection {
    position: sticky;
    left: 0;
    z-index: 10;
    background: #fff;
  }

  // 行悬停时，固定列背景也要变化
  .table-row:hover & {
    &.table-cell-fixed-left,
    &.table-cell-fixed-right,
    &.table-cell-selection {
      background: #fafafa;
    }
  }
}
</style>
