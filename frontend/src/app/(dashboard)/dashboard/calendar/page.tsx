'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types'
import { taskService } from '@/lib/api/services'
import { useToast } from '@/hooks/use-toast'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function CalendarPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true)
        const data = await taskService.getTasks({ limit: 100 })
        setTasks(data.tasks.filter(t => t.dueDate))
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load calendar tasks', variant: 'destructive' })
      } finally {
        setIsLoading(false)
      }
    }
    loadTasks()
  }, [])

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDay = (date: Date) => {
    return tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date))
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Calendar</h1>
          <p className="text-zinc-400 mt-1">View your tasks by due date</p>
        </div>
        
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold w-48 text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-medium text-zinc-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[120px] divide-x divide-y divide-zinc-800">
          {isLoading ? (
            Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="p-2">
                <Skeleton className="h-full w-full rounded-md bg-zinc-900/50" />
              </div>
            ))
          ) : (
            <>
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-zinc-950/30 p-2" />
              ))}
              
              {days.map((day, i) => {
                const dayTasks = getTasksForDay(day)
                return (
                  <div 
                    key={day.toISOString()}
                    className={cn(
                      "p-2 transition-colors hover:bg-zinc-900/50 flex flex-col gap-1 overflow-hidden",
                      !isSameMonth(day, currentDate) && "text-zinc-600 bg-zinc-950/30"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1",
                      isToday(day) ? "bg-emerald-500 text-zinc-950" : "text-zinc-300"
                    )}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {dayTasks.map(task => (
                        <div 
                          key={task.id || (task as any)._id}
                          className={cn(
                            "text-xs px-2 py-1 rounded truncate",
                            task.status === 'completed' ? "bg-zinc-800 text-zinc-500 line-through" :
                            task.priority === 'high' ? "bg-rose-500/20 text-rose-400" :
                            task.priority === 'medium' ? "bg-amber-500/20 text-amber-400" :
                            "bg-blue-500/20 text-blue-400"
                          )}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
