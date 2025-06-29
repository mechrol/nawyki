import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { TrendingUp, Calendar, BarChart3, PieChart } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const AnalyticsDashboard = ({ habits }) => {
  const chartData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    })

    // Daily completion data
    const dailyCompletions = last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const completedCount = habits.filter(habit => 
        habit.completedDates.includes(dateStr)
      ).length
      return {
        date: format(date, 'MMM d'),
        completed: completedCount,
        total: habits.length
      }
    })

    // Weekly completion data
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    
    const weeklyData = weekDays.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const completedCount = habits.filter(habit => 
        habit.completedDates.includes(dateStr)
      ).length
      return {
        day: format(date, 'EEE'),
        completed: completedCount,
        total: habits.length
      }
    })

    // Category distribution
    const categoryData = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1
      return acc
    }, {})

    // Difficulty distribution
    const difficultyData = habits.reduce((acc, habit) => {
      acc[habit.difficulty] = (acc[habit.difficulty] || 0) + 1
      return acc
    }, {})

    return {
      daily: dailyCompletions,
      weekly: weeklyData,
      categories: categoryData,
      difficulties: difficultyData
    }
  }, [habits])

  const lineChartData = {
    labels: chartData.daily.map(d => d.date),
    datasets: [
      {
        label: 'Habits Completed',
        data: chartData.daily.map(d => d.completed),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Total Habits',
        data: chartData.daily.map(d => d.total),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
      }
    ]
  }

  const barChartData = {
    labels: chartData.weekly.map(d => d.day),
    datasets: [
      {
        label: 'Completed',
        data: chartData.weekly.map(d => d.completed),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Total',
        data: chartData.weekly.map(d => d.total),
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
      }
    ]
  }

  const categoryChartData = {
    labels: Object.keys(chartData.categories),
    datasets: [
      {
        data: Object.values(chartData.categories),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.8)',
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        }
      },
      y: {
        ticks: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(107, 114, 128)',
          font: {
            size: 12
          },
          padding: 20
        }
      },
    }
  }

  const stats = [
    {
      icon: TrendingUp,
      label: 'Avg. Daily Completion',
      value: `${Math.round(chartData.daily.reduce((acc, d) => acc + (d.completed / Math.max(d.total, 1) * 100), 0) / chartData.daily.length)}%`,
      color: 'text-green-500'
    },
    {
      icon: Calendar,
      label: 'Best Day This Week',
      value: chartData.weekly.reduce((best, day) => 
        day.completed > best.completed ? day : best, 
        chartData.weekly[0] || { day: 'N/A', completed: 0 }
      ).day,
      color: 'text-blue-500'
    },
    {
      icon: BarChart3,
      label: 'Most Active Category',
      value: Object.keys(chartData.categories).reduce((a, b) => 
        chartData.categories[a] > chartData.categories[b] ? a : b, 
        Object.keys(chartData.categories)[0] || 'None'
      ),
      color: 'text-purple-500'
    },
    {
      icon: PieChart,
      label: 'Total Completions',
      value: habits.reduce((total, habit) => total + habit.completedDates.length, 0),
      color: 'text-orange-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            30-Day Progress
          </h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Weekly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            This Week's Performance
          </h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Habits by Category
          </h3>
          <div className="h-64">
            {Object.keys(chartData.categories).length > 0 ? (
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No habits to display
              </div>
            )}
          </div>
        </motion.div>

        {/* Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Insights & Tips
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                💡 Consistency Tip
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Try to complete habits at the same time each day to build stronger neural pathways.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                🎯 Progress Update
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                You've completed {habits.reduce((total, habit) => total + habit.completedDates.length, 0)} habits total. 
                Keep up the great work!
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                🚀 Challenge
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Try to maintain a 7-day streak on your most important habit this week!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
