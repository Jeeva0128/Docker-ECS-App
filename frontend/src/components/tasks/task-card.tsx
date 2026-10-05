'use client'

import { Task, TaskStatus, TaskPriority } from '@/types'
import { motion } from 'framer-motion'
import { format, isPast, isToday } from 'date-fns'
import { Calendar, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
  onClick: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange, onClick }: TaskCardProps) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'completed'

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStatusChange(task, task.status === 'completed' ? 'pending' : 'completed')
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(task)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(task)
  }

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(task)}
      className={cn(
        "group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:bg-zinc-900",
        task.status === 'completed' && "opacity-75"
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleStatusToggle}
          className={cn(
            "mt-1 rounded-full text-zinc-500 transition-colors hover:text-emerald-500",
            task.status === 'completed' && "text-emerald-500"
          )}
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className={cn(
              "font-medium text-zinc-100 line-clamp-1",
              task.status === 'completed' && "line-through text-zinc-500"
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-emerald-400" onClick={handleEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-rose-400" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-zinc-400 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge variant={
              task.status === 'completed' ? 'default' :
              task.status === 'in-progress' ? 'secondary' : 'outline'
            } className="capitalize">
              {task.status.replace('-', ' ')}
            </Badge>

            <Badge variant={
              task.priority === 'high' ? 'destructive' :
              task.priority === 'medium' ? 'secondary' : 'outline'
            } className="capitalize">
              {task.priority} Priority
            </Badge>

            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-rose-500 font-medium" : "text-zinc-500"
              )}>
                <Calendar className="h-3.5 w-3.5" />
                {isOverdue ? 'Overdue' : format(new Date(task.dueDate), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
