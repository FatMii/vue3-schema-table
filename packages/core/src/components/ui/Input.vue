<template>
  <div class="vst-input-wrapper" :class="{ 'vst-input-small': size === 'small' }">
    <span v-if="$slots.prefix" class="vst-input-prefix">
      <slot name="prefix" />
    </span>
    <input
      class="vst-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span
      v-if="allowClear && modelValue"
      class="vst-input-suffix vst-input-clear"
      @click="handleClear"
    >
      ×
    </span>
    <span v-else-if="$slots.suffix" class="vst-input-suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  size?: 'small' | 'default'
  allowClear?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'default',
  allowClear: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleClear() {
  emit('update:modelValue', '')
}
</script>

<style scoped lang="scss">
.vst-input-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--vst-border-color, #d9d9d9);
  border-radius: var(--vst-border-radius, 4px);
  background-color: var(--vst-bg-color, #fff);
  transition: all 0.2s;

  &:hover:not(.vst-input-disabled) {
    border-color: var(--vst-primary-color-hover, #40a9ff);
  }

  &:focus-within {
    border-color: var(--vst-primary-color, #1890ff);
    box-shadow: 0 0 0 2px var(--vst-primary-shadow, rgba(24, 144, 255, 0.2));
  }

  &.vst-input-disabled {
    background-color: var(--vst-disabled-bg, #f5f5f5);
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.vst-input {
  flex: 1;
  width: 100%;
  padding: 4px 11px;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--vst-font-size, 14px);
  color: var(--vst-text-color, #262626);
  line-height: 1.5715;

  &::placeholder {
    color: var(--vst-placeholder-color, #bfbfbf);
  }

  &:disabled {
    cursor: not-allowed;
  }
}

.vst-input-small {
  .vst-input {
    padding: 2px 7px;
    font-size: 12px;
  }
}

.vst-input-prefix {
  display: flex;
  align-items: center;
  padding-left: 11px;
  color: var(--vst-text-color-secondary, #8c8c8c);
}

.vst-input-suffix {
  display: flex;
  align-items: center;
  padding-right: 11px;
  color: var(--vst-text-color-secondary, #8c8c8c);
}

.vst-input-clear {
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: var(--vst-text-color-secondary, #8c8c8c);
  transition: color 0.2s;

  &:hover {
    color: var(--vst-text-color, #262626);
  }
}
</style>

