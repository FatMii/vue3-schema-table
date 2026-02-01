<template>
  <div class="vst-popover-wrapper" ref="popoverRef">
    <div ref="triggerRef" class="vst-popover-trigger" @click="handleTriggerClick">
      <slot />
    </div>
    <Teleport to="body">
      <Transition name="vst-popover-fade">
        <div
          v-if="visible"
          ref="contentRef"
          class="vst-popover-content"
          :class="`vst-popover-${placement}`"
          :style="contentStyle"
          @click.stop
        >
          <div class="vst-popover-inner">
            <slot name="content" />
          </div>
          <div class="vst-popover-arrow"></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  visible?: boolean
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
  trigger?: 'click' | 'hover'
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  placement: 'bottomLeft',
  trigger: 'click',
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
}>()

const popoverRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const contentStyle = ref<Record<string, string>>({})

const visible = ref(props.visible)

watch(
  () => props.visible,
  newVal => {
    visible.value = newVal
    if (newVal) {
      nextTick(() => {
        updatePosition()
      })
    }
  },
  { immediate: true }
)

watch(visible, newVal => {
  emit('update:visible', newVal)
})

function handleTriggerClick() {
  if (props.trigger === 'click') {
    visible.value = !visible.value
  }
}

function updatePosition() {
  if (!triggerRef.value || !contentRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const contentRect = contentRef.value.getBoundingClientRect()
  const scrollX = window.scrollX || window.pageXOffset
  const scrollY = window.scrollY || window.pageYOffset

  let top = 0
  let left = 0

  // 根据 placement 计算位置
  switch (props.placement) {
    case 'top':
    case 'topLeft':
    case 'topRight':
      top = triggerRect.top + scrollY - contentRect.height - 8
      left = triggerRect.left + scrollX
      if (props.placement === 'topLeft') {
        left = triggerRect.left + scrollX
      } else if (props.placement === 'topRight') {
        left = triggerRect.right + scrollX - contentRect.width
      } else {
        left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2
      }
      break
    case 'bottom':
    case 'bottomLeft':
    case 'bottomRight':
      top = triggerRect.bottom + scrollY + 8
      left = triggerRect.left + scrollX
      if (props.placement === 'bottomLeft') {
        left = triggerRect.left + scrollX
      } else if (props.placement === 'bottomRight') {
        left = triggerRect.right + scrollX - contentRect.width
      } else {
        left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2
      }
      break
    case 'left':
      top = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2
      left = triggerRect.left + scrollX - contentRect.width - 8
      break
    case 'right':
      top = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2
      left = triggerRect.right + scrollX + 8
      break
  }

  // 边界检查
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  if (left < 0) left = 8
  if (left + contentRect.width > viewportWidth) {
    left = viewportWidth - contentRect.width - 8
  }
  if (top < scrollY) top = scrollY + 8
  if (top + contentRect.height > scrollY + viewportHeight) {
    top = scrollY + viewportHeight - contentRect.height - 8
  }

  contentStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: '1050',
  }
}

function handleClickOutside(event: MouseEvent) {
  if (
    visible.value &&
    triggerRef.value &&
    contentRef.value &&
    !triggerRef.value.contains(event.target as Node) &&
    !contentRef.value.contains(event.target as Node)
  ) {
    visible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
})
</script>

<style scoped lang="scss">
.vst-popover-wrapper {
  display: inline-block;
}

.vst-popover-trigger {
  display: inline-block;
  cursor: pointer;
}

.vst-popover-content {
  position: fixed;
  background-color: var(--vst-popover-bg, #fff);
  border-radius: var(--vst-border-radius, 4px);
  box-shadow: 0 2px 8px var(--vst-shadow, rgba(0, 0, 0, 0.15));
  z-index: 1050;
}

.vst-popover-inner {
  padding: 0;
}

.vst-popover-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: var(--vst-popover-bg, #fff);
  border: 1px solid var(--vst-border-color, #d9d9d9);
  transform: rotate(45deg);
}

.vst-popover-bottomLeft .vst-popover-arrow,
.vst-popover-bottom .vst-popover-arrow,
.vst-popover-bottomRight .vst-popover-arrow {
  top: -5px;
  left: 16px;
  border-right: none;
  border-bottom: none;
}

.vst-popover-topLeft .vst-popover-arrow,
.vst-popover-top .vst-popover-arrow,
.vst-popover-topRight .vst-popover-arrow {
  bottom: -5px;
  left: 16px;
  border-left: none;
  border-top: none;
}

.vst-popover-fade-enter-active,
.vst-popover-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.vst-popover-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.vst-popover-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
