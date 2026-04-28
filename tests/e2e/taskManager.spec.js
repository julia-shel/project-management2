import { test, expect } from '@playwright/test'

/**
 * ============================================================
 * E2E тести для Task Manager
 * Лабораторна робота — Крок 4: Наскрізне тестування
 * ============================================================
 */

test.describe('Task Manager — Критичний шлях користувача', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Очікуємо, що додаток завантажився
    await expect(page.getByTestId('task-input')).toBeVisible()
  })

  // -----------------------------------------------------------
  // СЦЕНАРІЙ 1: Додавання завдання
  // Критичний шлях: Користувач вводить текст → натискає кнопку → бачить завдання
  // -----------------------------------------------------------
  test('Сценарій 1: Успішне додавання нового завдання до списку', async ({ page }) => {
    // 1. Перевіряємо початковий стан — список порожній
    const taskList = page.getByTestId('task-list')
    await expect(page.getByTestId('task-item')).toHaveCount(0)

    // 2. Вводимо текст завдання
    await page.getByTestId('task-input').fill('Пройти лабораторну роботу')

    // 3. Натискаємо кнопку додавання
    await page.getByTestId('add-task-btn').click()

    // 4. Перевіряємо, що завдання з'явилося у списку
    await expect(page.getByTestId('task-item')).toHaveCount(1)
    await expect(taskList).toContainText('Пройти лабораторну роботу')

    // 5. Перевіряємо, що поле вводу очистилося
    await expect(page.getByTestId('task-input')).toHaveValue('')
  })

  // -----------------------------------------------------------
  // СЦЕНАРІЙ 2: Виконання завдання
  // Критичний шлях: Відмітити завдання → перевірити зміну відображення
  // -----------------------------------------------------------
  test('Сценарій 2: Відмічання завдання як виконаного змінює відображення', async ({ page }) => {
    // 1. Додаємо завдання
    await page.getByTestId('task-input').fill('Навчитися Playwright')
    await page.getByTestId('add-task-btn').click()

    // 2. Перевіряємо що завдання НЕ виконане
    const taskItem = page.getByTestId('task-item').first()
    const taskText = page.getByTestId('task-text').first()
    await expect(taskItem).not.toHaveClass(/completed/)

    // 3. Клікаємо чекбокс
    await page.getByTestId('task-checkbox').first().click()

    // 4. Перевіряємо, що клас 'completed' додався до елемента
    await expect(taskItem).toHaveClass(/completed/)

    // 5. Перевіряємо, що текст має стиль "закреслений" (line-through)
    await expect(taskText).toHaveClass(/done/)
  })
})
