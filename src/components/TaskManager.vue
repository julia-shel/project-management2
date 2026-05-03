<script setup>
import { ref } from 'vue'
import { useTaskManager } from '../composables/useTaskManager'

const { tasks, addTask, removeTask, toggleTask, filteredTasks, activeCount } = useTaskManager()

const newTaskText = ref('')
const activeFilter = ref('all')

const filters = ['all', 'active', 'completed']
const filterLabels = { all: 'Всі', active: 'Активні', completed: 'Виконані' }

const appStatus = import.meta.env.VITE_APP_STATUS || 'Unknown Mode'

function handleAddTask() {
  if (addTask(newTaskText.value)) {
    newTaskText.value = ''
  }
}

function handleKeyDown(e) {
  if (e.key === 'Enter') handleAddTask()
}
</script>

<template>
  <div class="wrapper">
    <div class="card">
      <!-- Header -->
      <header class="card-header">
        <div class="header-left">
          <div class="logo">✅</div>
          <div>
            <h1 class="title">Менеджер завдань</h1>
            <p class="subtitle">
              <span class="count-badge">{{ activeCount }}</span>
              {{ activeCount === 1 ? 'завдання' : 'завдань' }} залишилось
            </p>
            <div class="env-status" style="margin-top: 5px; font-size: 0.75rem; color: #8b5cf6; border: 1px solid #8b5cf6; padding: 2px 6px; border-radius: 4px; display: inline-block;">
              {{ appStatus }}
            </div>
          </div>
        </div>
      </header>

      <!-- Input row -->
      <div class="input-row">
        <input
          data-testid="task-input"
          v-model="newTaskText"
          @keydown="handleKeyDown"
          placeholder="Додати нове завдання..."
          class="task-input"
          maxlength="120"
        />
        <button
          data-testid="add-task-btn"
          @click="handleAddTask"
          class="add-btn"
          title="Додати завдання (Enter)"
        >
          <span>+</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="filter-row">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          :class="['filter-btn', { 'filter-btn--active': activeFilter === filter }]"
        >
          {{ filterLabels[filter] }}
        </button>
      </div>

      <!-- Task List -->
      <ul data-testid="task-list" class="task-list">
        <transition-group name="task">
          <li
            v-for="task in filteredTasks(activeFilter)"
            :key="task.id"
            data-testid="task-item"
            :class="['task-item', { completed: task.completed }]"
          >
            <label class="task-label">
              <input
                data-testid="task-checkbox"
                type="checkbox"
                :checked="task.completed"
                @change="toggleTask(task.id)"
                class="task-checkbox"
              />
              <span class="checkmark"></span>
              <span
                data-testid="task-text"
                :class="['task-text', { done: task.completed }]"
              >
                {{ task.text }}
              </span>
            </label>
            <button
              @click="removeTask(task.id)"
              class="delete-btn"
              title="Видалити завдання"
            >
              🗑
            </button>
          </li>
        </transition-group>

        <!-- Empty state -->
        <li v-if="filteredTasks(activeFilter).length === 0" class="empty-state">
          <div class="empty-icon">
            {{ activeFilter === 'completed' ? '📋' : activeFilter === 'active' ? '🎉' : '📝' }}
          </div>
          <p>
            {{ activeFilter === 'completed'
              ? 'Ще немає виконаних завдань'
              : activeFilter === 'active'
              ? 'Всі завдання виконано!'
              : 'Список порожній. Додайте завдання!' }}
          </p>
        </li>
      </ul>

      <!-- Footer -->
      <footer class="card-footer">
        <span class="total-count">Всього: {{ tasks.length }}</span>
        <button
          v-if="filteredTasks('completed').length > 0"
          @click="filteredTasks('completed').forEach(t => removeTask(t.id))"
          class="clear-btn"
        >
          Очистити виконані
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* ─── Variables ─── */
:root {
  --clr-bg: #0f0f1a;
  --clr-card: #1a1a2e;
  --clr-border: rgba(139, 92, 246, 0.2);
  --clr-primary: #8b5cf6;
  --clr-primary-hover: #7c3aed;
  --clr-success: #10b981;
  --clr-danger: #ef4444;
  --clr-text: #e2e8f0;
  --clr-muted: #94a3b8;
  --radius: 16px;
  --shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

/* ─── Layout ─── */
.wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
}

.card {
  width: 100%;
  max-width: 560px;
  background: rgba(26, 26, 46, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow), 0 0 0 1px rgba(139, 92, 246, 0.05);
  overflow: hidden;
}

/* ─── Header ─── */
.card-header {
  padding: 2rem 2rem 1.5rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, transparent 100%);
  border-bottom: 1px solid var(--clr-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 12px rgba(139, 92, 246, 0.6));
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--clr-text);
  margin: 0 0 0.25rem;
  background: linear-gradient(135deg, #e2e8f0, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--clr-muted);
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.count-badge {
  background: var(--clr-primary);
  color: #fff;
  border-radius: 999px;
  padding: 0.1em 0.55em;
  font-size: 0.8rem;
  font-weight: 700;
}

/* ─── Input ─── */
.input-row {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem 2rem 0;
}

.task-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  color: var(--clr-text);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.task-input::placeholder {
  color: var(--clr-muted);
}

.task-input:focus {
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.add-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--clr-primary), #6d28d9);
  border: none;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
}

.add-btn:active {
  transform: translateY(0);
}

/* ─── Filters ─── */
.filter-row {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
}

.filter-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--clr-border);
  background: transparent;
  color: var(--clr-muted);
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--clr-primary);
  color: var(--clr-text);
}

.filter-btn--active {
  background: rgba(139, 92, 246, 0.2);
  border-color: var(--clr-primary);
  color: var(--clr-primary);
  font-weight: 600;
}

/* ─── Task List ─── */
.task-list {
  list-style: none;
  margin: 0;
  padding: 0 2rem;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.task-list::-webkit-scrollbar {
  width: 4px;
}
.task-list::-webkit-scrollbar-track { background: transparent; }
.task-list::-webkit-scrollbar-thumb {
  background: var(--clr-border);
  border-radius: 2px;
}

/* ─── Task Item ─── */
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--clr-border);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.25s;
}

.task-item:hover {
  border-color: rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.06);
}

.task-item.completed {
  border-color: rgba(16, 185, 129, 0.2);
  background: rgba(16, 185, 129, 0.04);
  opacity: 0.75;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  flex: 1;
}

/* Custom checkbox */
.task-checkbox {
  position: absolute;
  opacity: 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  z-index: 1;
}

.checkmark {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 6px;
  border: 2px solid var(--clr-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
}

.task-checkbox:checked + .checkmark {
  background: var(--clr-success);
  border-color: var(--clr-success);
}

.task-checkbox:checked + .checkmark::after {
  content: '✓';
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.task-text {
  color: var(--clr-text);
  font-size: 0.95rem;
  line-height: 1.4;
  transition: all 0.25s;
}

.task-text.done {
  text-decoration: line-through;
  color: var(--clr-muted);
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  padding: 0.25rem;
  border-radius: 6px;
  line-height: 1;
}

.task-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  transform: scale(1.2);
}

/* ─── Empty state ─── */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--clr-muted);
  font-size: 0.95rem;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

/* ─── Footer ─── */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem 1.5rem;
  border-top: 1px solid var(--clr-border);
  margin-top: 0.5rem;
}

.total-count {
  color: var(--clr-muted);
  font-size: 0.85rem;
}

.clear-btn {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: var(--clr-danger);
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* ─── Transition animations ─── */
.task-enter-active,
.task-leave-active {
  transition: all 0.3s ease;
}
.task-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.task-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
