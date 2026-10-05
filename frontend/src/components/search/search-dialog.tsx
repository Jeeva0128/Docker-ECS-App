'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@/types'
import { taskService } from '@/lib/api/services'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, Loader2, ListTodo, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const searchTasks = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    try {
      setIsLoading(true)
      const data = await taskService.getTasks({ search: searchQuery, limit: 10 })
      setResults(data.tasks)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchTasks(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchTasks])

  const handleSelect = (taskId: string) => {
    setIsOpen(false)
    setQuery('')
    router.push('/dashboard/tasks')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-md hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search tasks...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-zinc-950/90 backdrop-blur-xl border-zinc-800 shadow-2xl">
          <div className="flex items-center border-b border-zinc-800 px-4 py-3">
            <Search className="h-5 w-5 text-zinc-500 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search tasks..."
              className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              autoFocus
            />
            {isLoading && <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query.trim() ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                Start typing to search tasks...
              </div>
            ) : results.length === 0 && !isLoading ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                No tasks found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((task) => (
                  <button
                    key={task.id || (task as any)._id}
                    onClick={() => handleSelect(task.id || (task as any)._id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg hover:bg-zinc-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ListTodo className="h-5 w-5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                      )}
                      <span className={cn(
                        "text-zinc-100 text-left font-medium line-clamp-1",
                        task.status === 'completed' && "line-through text-zinc-500"
                      )}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full capitalize",
                        task.priority === 'high' ? "bg-rose-500/10 text-rose-500" :
                        task.priority === 'medium' ? "bg-amber-500/10 text-amber-500" :
                        "bg-zinc-800 text-zinc-400"
                      )}>
                        {task.priority}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
