<template>
  <label class="vst-checkbox-wrapper" :class="{ disabled: disabled }">
    <span class="vst-checkbox" :class="{ checked: checked, indeterminate: indeterminate, disabled: disabled }">
      <input
        type="checkbox"
        class="vst-checkbox-input"
        :checked="checked"
        :disabled="disabled"
        @change="handleChange"
      />
      <span class="vst-checkbox-inner"></span>
    </span>
    <span v-if="$slots.default" class="vst-checkbox-label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  checked: false,
  indeterminate: false,
  disabled: false,
})

const emit = defineEmits<{
  change: [checked: boolean]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('change', target.checked)
}
</script>

<style scoped lang="scss">
.vst-checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.vst-checkbox {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid var(--vst-border-color, #d9d9d9);
  border-radius: var(--vst-border-radius-sm, 2px);
  background-color: var(--vst-bg-color, #fff);
  transition: all 0.2s;

  &:hover:not(.disabled) {
    border-color: var(--vst-primary-color, #1890ff);
  }

  &.checked {
    background-color: var(--vst-primary-color, #1890ff);
    border-color: var(--vst-primary-color, #1890ff);

    .vst-checkbox-inner {
      &::after {
        display: block;
      }
    }
  }

  &.indeterminate {
    background-color: var(--vst-primary-color, #1890ff);
    border-color: var(--vst-primary-color, #1890ff);

    .vst-checkbox-inner {
      &::after {
        display: block;
        width: 8px;
        height: 2px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: none;
        border-radius: 0;
      }
    }
  }

  &.disabled {
    cursor: not-allowed;
    background-color: var(--vst-disabled-bg, #f5f5f5);
    border-color: var(--vst-disabled-border, #d9d9d9);
  }
}

.vst-checkbox-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
}

.vst-checkbox-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &::after {
    content: '';
    display: none;
    position: absolute;
    top: 2px;
    left: 5px;
    width: 4px;
    height: 8px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg);
  }
}

.vst-checkbox-label {
  margin-left: 8px;
  font-size: var(--vst-font-size, 14px);
  color: var(--vst-text-color, #262626);
}
</style>

