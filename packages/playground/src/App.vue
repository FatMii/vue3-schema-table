<template>
  <div class="dynamic-table-page">
    <h1>Vue3 Schema Table - 演示</h1>

    <div class="page-actions">
      <button class="demo-button demo-button-primary" @click="loadLargeData">加载5000条</button>
      <button class="demo-button" @click="loadVeryLargeData">加载10000条</button>
      <button class="demo-button" @click="loadHugeData">加载50000条</button>
    </div>

    <div class="stats-bar">
      <div class="demo-statistic">
        <div class="demo-statistic-title">总数据量</div>
        <div class="demo-statistic-value">{{ tableData.length }}</div>
      </div>
    </div>

    <div class="table-container" ref="tableContainerRef">
      <DynamicTable :data="tableData" :schema="tableSchema" :height="tableHeight" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { DynamicTable } from '@vue3-schema-table/core'
import type { TableSchema } from '@vue3-schema-table/core'

// 示例 Schema
const tableSchema = ref<TableSchema>({
  columns: [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      align: 'left',
      fixed: 'left', // 固定左侧
      // ID 列默认不启用排序和筛选
    },
    {
      key: 'name',
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      align: 'right',
      // 默认启用排序和筛选
    },
    {
      key: 'email',
      title: '邮箱',
      dataIndex: 'email',
      width: 250,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'phone',
      title: '电话',
      dataIndex: 'phone',
      width: 150,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'address',
      title: '地址',
      dataIndex: 'address',
      width: 300,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'position',
      title: '职位',
      dataIndex: 'position',
      width: 150,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'salary',
      title: '薪资',
      dataIndex: 'salary',
      width: 120,
      align: 'right',
      // 默认启用排序和筛选
    },
    {
      key: 'joinDate',
      title: '入职日期',
      dataIndex: 'joinDate',
      width: 150,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'education',
      title: '学历',
      dataIndex: 'education',
      width: 100,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'experience',
      title: '工作经验',
      dataIndex: 'experience',
      width: 120,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'skill1',
      title: '技能1',
      dataIndex: 'skill1',
      width: 150,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'skill2',
      title: '技能2',
      dataIndex: 'skill2',
      width: 150,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'skill3',
      title: '技能3',
      dataIndex: 'skill3',
      width: 150,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'project1',
      title: '项目1',
      dataIndex: 'project1',
      width: 180,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'project2',
      title: '项目2',
      dataIndex: 'project2',
      width: 180,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'project3',
      title: '项目3',
      dataIndex: 'project3',
      width: 180,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'manager',
      title: '直属上级',
      dataIndex: 'manager',
      width: 120,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'team',
      title: '团队',
      dataIndex: 'team',
      width: 150,
      align: 'left',
      // 默认启用排序和筛选
    },
    {
      key: 'level',
      title: '职级',
      dataIndex: 'level',
      width: 100,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'performance',
      title: '绩效',
      dataIndex: 'performance',
      width: 100,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'bonus',
      title: '奖金',
      dataIndex: 'bonus',
      width: 120,
      align: 'right',
      // 默认启用排序和筛选
    },
    {
      key: 'insurance',
      title: '社保',
      dataIndex: 'insurance',
      width: 100,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'contract',
      title: '合同类型',
      dataIndex: 'contract',
      width: 120,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'expireDate',
      title: '合同到期',
      dataIndex: 'expireDate',
      width: 150,
      align: 'center',
      // 默认启用排序和筛选
    },
    {
      key: 'department',
      title: '部门',
      dataIndex: 'department',
      width: 150,
      align: 'left',
      fixed: 'right', // 固定右侧
      // 默认启用排序和筛选
    },
  ],
  table: {
    rowHeight: 40,
    virtualScroll: true,
    bufferSize: 10,
    rowSelection: {
      type: 'checkbox',
      rowKey: 'id', // 使用 id 作为行的唯一标识
    },
  },
})

// 生成示例数据（支持大数据量测试）
function generateMockData(count = 100): any[] {
  const departments = ['技术部', '产品部', '运营部', '市场部', '人事部']
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const statuses = ['在职', '离职', '试用期']
  const positions = ['前端工程师', '后端工程师', '产品经理', 'UI设计师', '测试工程师', '项目经理']
  const educations = ['本科', '硕士', '博士', '专科']
  const skills = ['Vue', 'React', 'Angular', 'Node.js', 'Python', 'Java', 'Go', 'PHP']
  const projects = ['项目A', '项目B', '项目C', '项目D', '项目E']
  const managers = ['张经理', '李经理', '王经理', '赵经理']
  const teams = ['前端组', '后端组', '产品组', '设计组', '测试组']
  const levels = ['P5', 'P6', 'P7', 'P8', 'P9']
  const performances = ['优秀', '良好', '一般', '待改进']
  const contracts = ['正式', '试用', '外包', '实习']

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + (i + 1),
    age: 20 + (i % 40),
    email: `user${i + 1}@example.com`,
    phone: `138${String(i + 1).padStart(8, '0')}`,
    address: `北京市朝阳区某某街道${i + 1}号`,
    status: statuses[i % statuses.length],
    position: positions[i % positions.length],
    salary: 5000 + (i % 50) * 1000 + '元',
    joinDate: `202${i % 4}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    education: educations[i % educations.length],
    experience: `${(i % 10) + 1}年`,
    skill1: skills[i % skills.length],
    skill2: skills[(i + 1) % skills.length],
    skill3: skills[(i + 2) % skills.length],
    remark: `这是第${i + 1}条数据的备注信息`,
    project1: projects[i % projects.length],
    project2: projects[(i + 1) % projects.length],
    project3: projects[(i + 2) % projects.length],
    manager: managers[i % managers.length],
    team: teams[i % teams.length],
    level: levels[i % levels.length],
    performance: performances[i % performances.length],
    bonus: 1000 + (i % 20) * 500 + '元',
    insurance: i % 2 === 0 ? '已缴纳' : '未缴纳',
    contract: contracts[i % contracts.length],
    expireDate: `202${(i % 4) + 5}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    department: departments[i % departments.length],
  }))
}

// 示例数据（默认 100 条）
const tableData = ref<any[]>(generateMockData(100))

// 表格容器引用和高度
const tableContainerRef = ref<HTMLElement | null>(null)
const tableHeight = ref(600)

// 计算表格高度
function updateTableHeight() {
  if (tableContainerRef.value) {
    // 获取容器高度，减去 padding (24px * 2 = 48px)
    tableHeight.value = tableContainerRef.value.clientHeight - 48
  }
}

// 窗口大小变化处理
function handleResize() {
  updateTableHeight()
}

// ResizeObserver 引用
let resizeObserver: ResizeObserver | null = null

// 初始化
onMounted(() => {
  updateTableHeight()
  window.addEventListener('resize', handleResize)

  // 使用 ResizeObserver 监听容器大小变化
  if (tableContainerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateTableHeight()
    })
    resizeObserver.observe(tableContainerRef.value)
  }
})

// 清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

// 加载不同规模的数据
function loadLargeData() {
  console.log('### 加载大数据集（5000条）')
  tableData.value = generateMockData(5000)
  console.log('### 加载完成！')
}

function loadVeryLargeData() {
  console.log('### 加载超大数据集（10000条）')
  tableData.value = generateMockData(10000)
  console.log('### 加载完成！')
}

function loadHugeData() {
  console.log('### 加载巨量数据集（50000条）')
  tableData.value = generateMockData(50000)
  console.log('### 加载完成！')
}
</script>

<style scoped lang="scss">
.dynamic-table-page {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  h1 {
    margin: 0 0 24px 0;
    font-size: 24px;
    font-weight: 600;
    color: #262626;
    flex-shrink: 0;
  }
}

.page-actions {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.stats-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.table-container {
  flex: 1;
  min-height: 0;
  background: #fff;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.demo-button {
  padding: 4px 15px;
  font-size: 14px;
  line-height: 1.5715;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #262626;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #1890ff;
    border-color: #1890ff;
  }

  &.demo-button-primary {
    background: #1890ff;
    border-color: #1890ff;
    color: #fff;

    &:hover {
      background: #40a9ff;
      border-color: #40a9ff;
    }
  }
}

.demo-statistic {
  .demo-statistic-title {
    font-size: 14px;
    color: #8c8c8c;
    margin-bottom: 4px;
  }

  .demo-statistic-value {
    font-size: 24px;
    font-weight: 600;
    color: #262626;
  }
}
</style>

