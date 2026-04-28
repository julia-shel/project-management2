import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTaskManager } from './useTaskManager'

/**
 * ============================================================
 * Unit-тести для useTaskManager composable
 * Лабораторна робота — Крок 2: Модульні тести
 * ============================================================
 */
describe('useTaskManager — бізнес-логіка менеджера завдань', () => {
  let tm // скорочення для taskManager

  // Перед кожним тестом створюємо чистий екземпляр
  beforeEach(() => {
    tm = useTaskManager()
  })

  // -----------------------------------------------------------
  // ТЕСТ 1: Початковий стан
  // -----------------------------------------------------------
  it('Тест 1: початковий список завдань має бути порожнім', () => {
    expect(tm.tasks.value).toHaveLength(0)
    expect(tm.activeCount.value).toBe(0)
  })

  // -----------------------------------------------------------
  // ТЕСТ 2: Додавання завдання
  // -----------------------------------------------------------
  it('Тест 2: addTask() додає завдання з правильними властивостями', () => {
    const result = tm.addTask('Купити молоко')

    expect(result).toBe(true)
    expect(tm.tasks.value).toHaveLength(1)
    expect(tm.tasks.value[0].text).toBe('Купити молоко')
    expect(tm.tasks.value[0].completed).toBe(false)
    expect(tm.tasks.value[0].id).toBeDefined()
    expect(tm.tasks.value[0].createdAt).toBeInstanceOf(Date)
  })

  // -----------------------------------------------------------
  // ТЕСТ 3: Пусте завдання не додається (перевірка валідації)
  // -----------------------------------------------------------
  it('Тест 3: addTask() НЕ додає порожнє або пробільне завдання', () => {
    const result1 = tm.addTask('')
    const result2 = tm.addTask('   ')
    const result3 = tm.addTask('\t\n')

    expect(result1).toBe(false)
    expect(result2).toBe(false)
    expect(result3).toBe(false)
    expect(tm.tasks.value).toHaveLength(0)
  })

  // -----------------------------------------------------------
  // ТЕСТ 4: Перемикання статусу завдання (toggle)
  // -----------------------------------------------------------
  it('Тест 4: toggleTask() перемикає статус completed туди й назад', () => {
    tm.addTask('Написати тести')
    const id = tm.tasks.value[0].id

    expect(tm.tasks.value[0].completed).toBe(false)

    tm.toggleTask(id)
    expect(tm.tasks.value[0].completed).toBe(true)

    tm.toggleTask(id)
    expect(tm.tasks.value[0].completed).toBe(false)
  })

  // -----------------------------------------------------------
  // ТЕСТ 5: Видалення завдання
  // -----------------------------------------------------------
  it('Тест 5: removeTask() видаляє завдання за id, не чіпаючи інші', () => {
    tm.addTask('Завдання для видалення')
    tm.addTask('Завдання для збереження')

    const idToRemove = tm.tasks.value[0].id
    tm.removeTask(idToRemove)

    expect(tm.tasks.value).toHaveLength(1)
    expect(tm.tasks.value[0].text).toBe('Завдання для збереження')
  })

  // -----------------------------------------------------------
  // ТЕСТ 6: Фільтр "active" (активні)
  // -----------------------------------------------------------
  it('Тест 6: filteredTasks("active") повертає лише невиконані завдання', () => {
    tm.addTask('Активне завдання')
    tm.addTask('Виконане завдання')
    tm.toggleTask(tm.tasks.value[1].id) // завершуємо друге

    const active = tm.filteredTasks('active')

    expect(active).toHaveLength(1)
    expect(active[0].text).toBe('Активне завдання')
  })

  // -----------------------------------------------------------
  // ТЕСТ 7: Фільтр "completed" (виконані)
  // -----------------------------------------------------------
  it('Тест 7: filteredTasks("completed") повертає лише виконані завдання', () => {
    tm.addTask('Активне завдання')
    tm.addTask('Виконане завдання')
    tm.toggleTask(tm.tasks.value[1].id)

    const completed = tm.filteredTasks('completed')

    expect(completed).toHaveLength(1)
    expect(completed[0].text).toBe('Виконане завдання')
    expect(completed[0].completed).toBe(true)
  })

  // -----------------------------------------------------------
  // ТЕСТ 8: Computed activeCount
  // -----------------------------------------------------------
  it('Тест 8: activeCount computed правильно рахує невиконані завдання', () => {
    tm.addTask('Завдання 1')
    tm.addTask('Завдання 2')
    tm.addTask('Завдання 3')

    expect(tm.activeCount.value).toBe(3)

    tm.toggleTask(tm.tasks.value[0].id)
    tm.toggleTask(tm.tasks.value[1].id)

    expect(tm.activeCount.value).toBe(1)
  })

  // -----------------------------------------------------------
  // ТЕСТ 9: Mock-об'єкт — демонстрація ізоляції з vi.fn()
  // -----------------------------------------------------------
  it('Тест 9 (Mock): mock-функція сповіщення викликається при додаванні', () => {
    // Створюємо mock-функцію (замінює реальний сервіс сповіщень)
    const mockNotificationService = {
      notify: vi.fn(),
    }

    // Симулюємо логіку: після addTask викликаємо notify
    const success = tm.addTask('Тестове завдання з mock')
    if (success) {
      mockNotificationService.notify(`Додано: ${tm.tasks.value[0].text}`)
    }

    // Перевірки mock-об'єкта
    expect(mockNotificationService.notify).toHaveBeenCalledOnce()
    expect(mockNotificationService.notify).toHaveBeenCalledWith('Додано: Тестове завдання з mock')
  })
})
