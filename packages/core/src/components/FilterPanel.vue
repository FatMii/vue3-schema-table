<template>
  <div class="filter-panel">
    <div class="filter-search">
      <VstInput
        v-model="searchText"
        placeholder="搜索选项"
        size="small"
        allow-clear
      >
        <template #prefix>
          <span>🔍</span>
        </template>
      </VstInput>
    </div>
    <div class="filter-options">
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        class="filter-option-item"
        @click="toggleOption(option.value)"
      >
        <VstCheckbox
          :checked="internalSelectedValues.includes(option.value)"
          @change="(checked: boolean) => toggleOption(option.value)"
          @click.stop
        />
        <span class="option-label">{{ option.label }}</span>
      </div>
      <div v-if="filteredOptions.length === 0" class="filter-empty">
        暂无匹配项
      </div>
    </div>
    <div class="filter-actions">
      <VstButton size="small" @click="handleCancel">取消</VstButton>
      <VstButton type="primary" size="small" @click="handleConfirm">确认</VstButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { FilterOption } from '../types'
import VstCheckbox from './ui/Checkbox.vue'
import VstInput from './ui/Input.vue'
import VstButton from './ui/Button.vue'

interface Props {
  /** 选项列表 */
  options?: FilterOption[]
  /** 当前选中的值 */
  selectedValues?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  selectedValues: () => [],
})

const emit = defineEmits<{
  confirm: [values: any[]]
  cancel: []
}>()

// 内部选中的值
const internalSelectedValues = ref<any[]>([...props.selectedValues])

// 搜索文本
const searchText = ref('')

// 过滤后的选项
const filteredOptions = computed(() => {
  if (!searchText.value) {
    return props.options
  }

  const searchLower = searchText.value.toLowerCase()
  return props.options.filter((option) => {
    const label = String(option.label).toLowerCase()
    return label.includes(searchLower)
  })
})

// 监听外部值变化
watch(
  () => props.selectedValues,
  (newVal) => {
    internalSelectedValues.value = [...newVal]
  },
  { immediate: true }
)

// 切换选项
function toggleOption(value: any) {
  const index = internalSelectedValues.value.indexOf(value)
  if (index > -1) {
    internalSelectedValues.value.splice(index, 1)
  } else {
    internalSelectedValues.value.push(value)
  }
}

// 确认
function handleConfirm() {
  emit('confirm', [...internalSelectedValues.value])
}

// 取消
function handleCancel() {
  // 恢复为原始值
  internalSelectedValues.value = [...props.selectedValues]
  emit('cancel')
}
</script>

<style scoped lang="scss">
.filter-panel {
  width: 200px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.filter-search {
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.filter-options {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;

  .filter-option-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }

    .option-label {
      margin-left: 8px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .filter-empty {
    padding: 16px;
    text-align: center;
    color: #999;
    font-size: 12px;
  }
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>

