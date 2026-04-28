import { ref, computed } from 'vue'

/**
 * useTaskManager — composable з бізнес-логікою менеджера завдань.
 * Виносимо логіку окремо від компонента для зручного Unit-тестування.
 */
export function useTaskManager() {
  const tasks = ref([])
  let nextId = 1

  /**
   * Додати нове завдання.
   * @param {string} text — текст завдання
   * @returns {boolean} true якщо додано, false якщо порожній рядок
   */
  function addTask(text) {
    const trimmed = text.trim()
    if (!trimmed) return false

    tasks.value.push({
      id: nextId++,
      text: trimmed,
      completed: false,
      createdAt: new Date(),
    })
    return true
  }

  /**
   * Видалити завдання за ID.
   * @param {number} id
   */
  function removeTask(id) {
    tasks.value = tasks.value.filter(task => task.id !== id)
  }

  /**
   * Перемкнути статус виконання завдання.
   * @param {number} id
   */
  function toggleTask(id) {
    const task = tasks.value.find(task => task.id === id)
    if (task) task.completed = !task.completed
  }

  /**
   * Отримати відфільтрований список.
   * @param {'all'|'active'|'completed'} filter
   * @returns {Array}
   */
  function filteredTasks(filter) {
    if (filter === 'active') return tasks.value.filter(t => !t.completed)
    if (filter === 'completed') return tasks.value.filter(t => t.completed)
    return tasks.value
  }

  /** Кількість незавершених завдань */
  const activeCount = computed(() => tasks.value.filter(t => !t.completed).length)

  return { tasks, addTask, removeTask, toggleTask, filteredTasks, activeCount }
}
