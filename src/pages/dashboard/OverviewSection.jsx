import { useState } from 'react';
import {
  BedDouble, BarChart3, Users, Star, TrendingUp, TrendingDown,
  Search, Plus, MoreHorizontal, ChevronRight, CheckCircle2, Clock, XCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useContent } from '../../contexts/ContentContext';
import { suites as staticSuites } from '../../data/suites';
import { site } from '../../data/site';

const stats = [
  { id: 'occupancy', label: 'Occupancy Rate', value: '78%', change: +4.2, icon: BedDouble, bg: 'bg-forest-700/10', iconColor: 'text-forest-600' },
  { id: 'revenue', label: 'Monthly Revenue', value: 'RWF 4.2M', change: +12.8, icon: BarChart3, bg: 'bg-amber-500/10', iconColor: 'text-amber-600' },
  { id: 'guests', label: 'Total Guests', value: '143', change: +8.1, icon: Users, bg: 'bg-blue-500/10', iconColor: 'text-blue-600' },
  { id: 'rating', label: 'Avg. Rating', value: '4.9', change: +0.2, icon: Star, bg: 'bg-amber-400/15', iconColor: 'text-amber-500' },
];

const bookings = [
  { id: 'BK-2501', guest: 'Marie Uwimana', room: 'Twin Room', checkIn: '30 Jun', checkOut: '3 Jul', amount: 'RWF 450,000', status: 'confirmed' },
  { id: 'BK-2502', guest: 'James Nkurunziza', room: 'Double Room', checkIn: '1 Jul', checkOut: '4 Jul', amount: 'RWF 450,000', status: 'pending' },
  { id: 'BK-2503', guest: 'Sarah Mukamana', room: 'Twin Room', checkIn: '2 Jul', checkOut: '5 Jul', amount: 'RWF 450,000', status: 'confirmed' },
  { id: 'BK-2504', guest: 'Pierre Habimana', room: 'Double Room', checkIn: '5 Jul', checkOut: '7 Jul', amount: 'RWF 300,000', status: 'cancelled' },
  { id: 'BK-2505', guest: 'Amina Kagame', room: 'Twin Room', checkIn: '7 Jul', checkOut: '10 Jul', amount: 'RWF 450,000', status: 'confirmed' },
];

const activity = [
  { icon: CheckCircle2, color: 'text-forest-500', text: 'Booking BK-2503 confirmed', time: '2m ago' },
  { icon: Clock, color: 'text-amber-500', text: 'New inquiry from James via website', time: '18m ago' },
  { icon: Star, color: 'text-yellow-500', text: 'New 5-star review received', time: '1h ago' },
  { icon: BedDouble, color: 'text-blue-500', text: 'Room 7 (Double) checked out', time: '2h ago' },
  { icon: XCircle, color: 'text-red-500', text: 'Booking BK-2504 cancelled', time: '3h ago' },
];

const weeklyData = [62, 70, 58, 85, 78, 90, 76];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const statusMap = {
  confirmed: 'bg-forest-50 text-forest-700 border-forest-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

export default function OverviewSection() {
  const { user } = useAuth();
  const { content } = useContent();
  const [search, setSearch] = useState('');

  const filtered = bookings.filter(b =>
    !search || [b.guest, b.id, b.room].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  const max = Math.max(...weeklyData);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-forest-600 mb-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-forest-950">
            Good afternoon, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-forest-700/60">
            Here's what's happening at <strong>{content.site?.name || site.name}</strong> today.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {stats.map((s, i) => (
          <div
            key={s.id}
            className="rounded-2xl border border-forest-900/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(18,29,17,0.1)]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${s.change >= 0 ? 'bg-forest-50 text-forest-700 border-forest-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                {s.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(s.change)}%
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-forest-950">{s.value}</p>
            <p className="mt-1 text-xs text-forest-700/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        {/* Occupancy chart */}
        <div className="lg:col-span-2 rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-base font-semibold text-forest-950">Weekly Occupancy</h2>
              <p className="text-xs text-forest-700/50 mt-0.5">This week's room occupancy by day</p>
            </div>
            <span className="text-xs text-forest-700/50 border border-forest-900/10 rounded-lg px-2.5 py-1 bg-forest-50">Jun 2025</span>
          </div>
          <div className="flex items-end gap-1.5 h-20">
            {weeklyData.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg transition-all duration-700"
                  style={{
                    height: `${(v / max) * 72}px`,
                    background: i === weeklyData.length - 1 ? 'linear-gradient(180deg,#62a862,#235825)' : 'rgba(35,88,37,0.15)',
                  }}
                />
                <span className="text-[10px] text-forest-700/50">{weekDays[i]}</span>
              </div>
            ))}
          </div>
          {/* Room cards */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {staticSuites.map(suite => (
              <div key={suite.slug} className="flex items-center gap-3 rounded-xl border border-forest-900/10 bg-forest-50/50 p-3">
                <div className="h-10 w-12 shrink-0 overflow-hidden rounded-lg">
                  <img src={suite.image} alt={suite.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest-950 truncate">{suite.name}</p>
                  <p className="text-xs text-forest-700/50">{suite.size} · {suite.view} view</p>
                </div>
                <span className="ml-auto shrink-0 rounded-full bg-forest-50 border border-forest-200 px-2 py-0.5 text-xs text-forest-700">
                  Available
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-2xl border border-forest-900/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-base font-semibold text-forest-950">Recent Activity</h2>
            <button className="text-xs text-forest-600 hover:text-forest-700 font-medium transition-colors">View all</button>
          </div>
          <ul className="space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 ${a.color}`}><a.icon className="h-4 w-4" /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-forest-900 leading-snug">{a.text}</p>
                  <p className="text-xs text-forest-700/50 mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

   
    </div>
  );
}
