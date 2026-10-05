'use client'

import { useEffect, useState } from 'react'
import { Task, TaskFilters as TaskFiltersType, CreateTaskInput, TaskStatus } from '@/types'
import { taskService } from '@/lib/api/services'
import { useToast } from '@/hooks/use-toast'
import { TaskFilters } from '@/components/tasks/task-filters'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskForm } from '@/components/tasks/task-form'
import { TaskDetails } from '@/components/tasks/task-details'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ListTodo, Plus } from 'lucide-react'

export default function TasksPage() {
  const { toast } = useToast()
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [filters, setFilters] = useState<TaskFiltersType>({ page: 1, limit: 12 })
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0, limit: 12 })
  const [isLoading, setIsLoading] = useState(true)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const data = await taskService.getTasks(filters)
      setTasks(data.tasks)
      setPagination(data.pagination)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load tasks', variant: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [filters])

  const handleCreateTask = async (data: CreateTaskInput | Partial<Task>) => {
    try {
      setIsSubmitting(true)
      await taskService.createTask(data as CreateTaskInput)
      toast({ title: 'Success', description: 'Task created successfully' })
      setIsFormOpen(false)
      loadTasks()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create task', variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!selectedTask) return
    try {
      setIsSubmitting(true)
      const taskId = selectedTask._id || (selectedTask as any)._id
      await taskService.updateTask(taskId, data)
      toast({ title: 'Success', description: 'Task updated successfully' })
      setIsFormOpen(false)
      if (isDetailsOpen) loadTaskDetails(taskId)
      loadTasks()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update task', variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      const taskId = task._id || (task as any)._id
      await taskService.deleteTask(taskId)
      toast({ title: 'Success', description: 'Task deleted successfully' })
      setIsDetailsOpen(false)
      loadTasks()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete task', variant: "error" })
    }
  }

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      const taskId = task._id || (task as any)._id
      await taskService.updateTask(taskId, { status })
      toast({ title: 'Success', description: 'Task status updated' })
      if (isDetailsOpen && (selectedTask?._id === taskId || (selectedTask as any)?._id === taskId)) {
        setSelectedTask({ ...task, status })
      }
      loadTasks()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: "error" })
    }
  }

  const loadTaskDetails = async (id: string) => {
    try {
      const task = await taskService.getTask(id)
      setSelectedTask(task)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load task details', variant: "error" })
    }
  }

  const openNewTask = () => {
    setSelectedTask(null)
    setIsFormOpen(true)
  }

  const openEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsFormOpen(true)
  }

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">My Tasks</h1>
          <p className="text-zinc-400 mt-1">Manage and track your tasks</p>
        </div>
        <Button onClick={openNewTask} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <TaskFilters
        filters={filters}
        onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters, page: 1 })}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] w-full rounded-xl bg-zinc-900/50" />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {tasks.map(task => (
              <TaskCard
                key={task._id || (task as any)._id}
                task={task}
                onEdit={openEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                onClick={openTaskDetails}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                disabled={pagination.current === 1}
                onClick={() => setFilters({ ...filters, page: pagination.current - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={pagination.current === pagination.pages}
                onClick={() => setFilters({ ...filters, page: pagination.current + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="Try adjusting your filters or create a new task."
          action={<Button onClick={() => setFilters({ page: 1, limit: 12 })}>Clear Filters</Button>}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
            <DialogDescription>
              {selectedTask ? 'Make changes to your task here.' : 'Add a new task to your list.'}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            initialData={selectedTask || undefined}
            onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <TaskDetails
        task={selectedTask}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={(task) => { setIsDetailsOpen(false); openEditTask(task); }}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
