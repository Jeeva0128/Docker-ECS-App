'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { taskService } from '@/lib/api/services'
import { Task, TaskStats } from '@/types'
import { StatCard } from '@/components/tasks/stat-card'
import { TaskCard } from '@/components/tasks/task-card'
import { DashboardSkeleton } from '@/components/loading-skeleton'
import { ErrorState } from '@/components/error-state'
import { EmptyState } from '@/components/empty-state'
import { AlertCircle, CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [statsData, tasksData] = await Promise.all([
        taskService.getTaskStats(),
        taskService.getTasks({ limit: 5 })
      ])
      setStats(statsData)
      setRecentTasks(tasksData.tasks)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard data'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) return <DashboardSkeleton />
  if (error) return <ErrorState message={error.message} onRetry={loadData} />
  if (!stats) return null

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">
          Welcome back, {user?.name || 'User'}
        </h1>
        <p className="text-zinc-400 mt-2">
          Here's what's happening with your tasks today, {format(new Date(), 'MMMM do, yyyy')}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ListTodo}
          label="Total Tasks"
          value={stats.total}
          color="zinc"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={stats.inProgress}
          color="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          color="emerald"
        />
        <StatCard
          icon={AlertCircle}
          label="Overdue"
          value={stats.overdue}
          color="rose"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100">Recent Tasks</h2>
          <div className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4" />
            <span>{stats.highPriority} High Priority Tasks</span>
          </div>
        </div>

        {recentTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {recentTasks.map(task => (
              <TaskCard
                key={task.id || task._id}
                task={task}
                onEdit={() => router.push('/dashboard/tasks')}
                onDelete={() => router.push('/dashboard/tasks')}
                onStatusChange={() => {}}
                onClick={() => router.push('/dashboard/tasks')}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ListTodo}
            title="No recent tasks"
            description="You don't have any tasks yet. Create one to get started."
          />
        )}
      </div>
    </div>
  )
}
