'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  ArrowRight, 
  LayoutDashboard, 
  Zap, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as any as any }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 overflow-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-1.5 rounded-lg">
              <CheckSquare className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white border-none text-sm h-9 px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            TaskFlow v2.0 is now live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
            Plan. Track. Ship.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The modern task management platform for teams that ship. Organize your work, track progress, and deliver results.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full text-base">
                Start for free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-zinc-700 hover:bg-zinc-800 text-zinc-200 rounded-full text-base bg-transparent">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden transform perspective-1000 rotateX-12 scale-95 hover:scale-100 transition-all duration-700 ease-out">
            {/* Window Header */}
            <div className="h-10 border-b border-white/5 bg-zinc-950/80 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            {/* Mockup Body */}
            <div className="flex h-[400px] md:h-[500px] bg-zinc-950">
              {/* Sidebar Mock */}
              <div className="w-64 border-r border-white/5 hidden md:block p-4">
                <div className="w-24 h-6 bg-white/10 rounded mb-8" />
                <div className="space-y-3">
                  <div className="w-full h-8 bg-emerald-500/20 rounded-md" />
                  <div className="w-full h-8 bg-white/5 rounded-md" />
                  <div className="w-full h-8 bg-white/5 rounded-md" />
                </div>
              </div>
              
              {/* Main Content Mock */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="w-48 h-8 bg-white/10 rounded-md" />
                  <div className="w-10 h-10 bg-white/10 rounded-full" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full" />
                    <div className="w-16 h-6 bg-white/10 rounded" />
                  </div>
                  <div className="h-24 bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full" />
                    <div className="w-16 h-6 bg-white/10 rounded" />
                  </div>
                  <div className="h-24 bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full" />
                    <div className="w-16 h-6 bg-white/10 rounded" />
                  </div>
                </div>

                <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="w-1/3 h-6 bg-white/10 rounded mb-4" />
                  <div className="w-full h-12 bg-white/5 rounded-lg flex items-center px-4 gap-4">
                     <div className="w-4 h-4 rounded-full border-2 border-emerald-500" />
                     <div className="w-1/2 h-4 bg-white/10 rounded" />
                  </div>
                  <div className="w-full h-12 bg-white/5 rounded-lg flex items-center px-4 gap-4">
                     <div className="w-4 h-4 rounded-full border-2 border-zinc-600" />
                     <div className="w-2/3 h-4 bg-white/10 rounded" />
                  </div>
                  <div className="w-full h-12 bg-white/5 rounded-lg flex items-center px-4 gap-4">
                     <div className="w-4 h-4 rounded-full border-2 border-zinc-600" />
                     <div className="w-1/3 h-4 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship faster</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Powerful features wrapped in a beautiful, intuitive interface designed to keep you in the flow.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: 'Smart Task Management',
                desc: 'Create, organize, and track tasks with powerful filtering and search capabilities.'
              },
              {
                icon: BarChart3,
                title: 'Real-time Statistics',
                desc: 'Get instant insights into your productivity with live dashboards and progress metrics.'
              },
              {
                icon: Zap,
                title: 'Priority-driven Workflow',
                desc: 'Focus on what matters most with priority levels, custom tags, and due date tracking.'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.07] transition-colors"
              >
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-8 text-zinc-300">Built with modern technologies</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Next.js 14', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'].map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-400">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-lg">TaskFlow</span>
          </div>
          <p className="text-zinc-500 text-sm">
            Built with <span className="text-red-500">❤️</span> for productivity
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>&copy; {new Date().getFullYear()} TaskFlow</span>
            <a href="#" className="hover:text-zinc-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
