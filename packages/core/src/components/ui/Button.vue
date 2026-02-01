<template>
  <button
    class="vst-button"
    :class="[
      `vst-button-${type}`,
      `vst-button-${size}`,
      { 'vst-button-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'default' | 'primary' | 'dashed' | 'text'
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.vst-button {
  position: relative;
  display: inline-block;
  padding: 4px 15px;
  font-size: var(--vst-font-size, 14px);
  line-height: 1.5715;
  text-align: center;
  cursor: pointer;
  border: 1px solid var(--vst-border-color, #d9d9d9);
  border-radius: var(--vst-border-radius, 4px);
  background-color: var(--vst-bg-color, #fff);
  color: var(--vst-text-color, #262626);
  transition: all 0.2s;
  user-select: none;
  outline: none;

  &:hover:not(.vst-button-disabled) {
    color: var(--vst-primary-color, #1890ff);
    border-color: var(--vst-primary-color, #1890ff);
  }

  &:active:not(.vst-button-disabled) {
    transform: scale(0.98);
  }

  &.vst-button-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.vst-button-primary {
  background-color: var(--vst-primary-color, #1890ff);
  border-color: var(--vst-primary-color, #1890ff);
  color: #fff;

  &:hover:not(.vst-button-disabled) {
    background-color: var(--vst-primary-color-hover, #40a9ff);
    border-color: var(--vst-primary-color-hover, #40a9ff);
  }

  &:active:not(.vst-button-disabled) {
    background-color: var(--vst-primary-color-active, #096dd9);
    border-color: var(--vst-primary-color-active, #096dd9);
  }
}

.vst-button-dashed {
  border-style: dashed;
}

.vst-button-text {
  border: none;
  background: transparent;

  &:hover:not(.vst-button-disabled) {
    background-color: var(--vst-item-hover-bg, rgba(0, 0, 0, 0.06));
  }
}

.vst-button-small {
  padding: 2px 7px;
  font-size: 12px;
}

.vst-button-large {
  padding: 6px 19px;
  font-size: 16px;
}
</style>

