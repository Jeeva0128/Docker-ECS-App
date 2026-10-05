'use client'

import { Task, TaskStatus } from '@/types'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Pencil, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TaskDetailsProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
}

export function TaskDetails({ task, isOpen, onClose, onEdit, onDelete, onStatusChange }: TaskDetailsProps) {
  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400">
            Created on {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-wrap gap-2">
            <Select 
              value={task.status} 
              onValueChange={(val: TaskStatus) => onStatusChange(task, val)}
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant={
              task.priority === 'high' ? 'destructive' :
              task.priority === 'medium' ? 'secondary' : 'outline'
            } className="capitalize">
              {task.priority} Priority
            </Badge>

            {task.dueDate && (
              <Badge variant="outline" className="gap-1.5">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </Badge>
            )}
          </div>

          <Separator className="bg-zinc-800" />

          {task.description ? (
            <div className="text-sm text-zinc-300 whitespace-pre-wrap">
              {task.description}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">No description provided.</p>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock className="h-3 w-3" />
            Last updated {format(new Date(task.updatedAt), 'MMM d, yyyy h:mm a')}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => { onClose(); onEdit(task); }}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => { onClose(); onDelete(task); }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
