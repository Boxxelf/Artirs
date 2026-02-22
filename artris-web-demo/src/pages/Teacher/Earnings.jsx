import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

export default function Earnings() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({
    total: 5000,
    thisMonth: 1200,
    lastMonth: 980,
  });
  const [chartData, setChartData] = useState([
    { month: 'Jan', amount: 850 },
    { month: 'Feb', amount: 920 },
    { month: 'Mar', amount: 980 },
    { month: 'Apr', amount: 1100 },
    { month: 'May', amount: 1200 },
    { month: 'Jun', amount: 1200 },
  ]);
  const [transactions, setTransactions] = useState([
    {
      id: 'txn-001',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      student: 'Alex Zhang',
      duration: 1,
      amount: 85,
    },
    {
      id: 'txn-002',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      student: 'Sophie Lee',
      duration: 2,
      amount: 190,
    },
    {
      id: 'txn-003',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      student: 'Emma Brown',
      duration: 1,
      amount: 80,
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('teacher.earnings.title')}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('teacher.earnings.total')}</p>
              <p className="text-3xl font-bold">${stats.total}</p>
            </div>
            <DollarSign className="w-12 h-12 text-primary-600 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('teacher.earnings.thisMonth')}</p>
              <p className="text-3xl font-bold">${stats.thisMonth}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('teacher.earnings.lastMonth')}</p>
              <p className="text-3xl font-bold">${stats.lastMonth}</p>
            </div>
            <DollarSign className="w-12 h-12 text-gray-600 opacity-20" />
          </div>
        </motion.div>
      </div>

      {/* Earnings Chart */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>{i18n.language === 'en' ? 'Earnings Trend' : '收入趋势'}</span>
        </h2>
        <div className="card">
          <div className="p-6">
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData.map((data, index) => {
                const maxAmount = Math.max(...chartData.map(d => d.amount));
                const height = (data.amount / maxAmount) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end justify-center h-48">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg hover:from-primary-700 hover:to-primary-500 transition-colors cursor-pointer relative group"
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          ${data.amount}
                        </div>
                      </motion.div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 font-medium">
                      {data.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t('teacher.earnings.transactions')}</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('teacher.earnings.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('teacher.earnings.student')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('teacher.earnings.duration')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('teacher.earnings.amount')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn, index) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(txn.date, 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {txn.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.duration} {i18n.language === 'en' 
                        ? (txn.duration === 1 ? 'hour' : 'hours')
                        : '小时'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${txn.amount}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
