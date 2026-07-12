import { Sparkles } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
        <Sparkles className="h-10 w-10 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 text-center max-w-md">
        This section is currently under development. 
        <br />
        We're working hard to bring it to you soon!
      </p>
      <div className="mt-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm text-gray-400">Coming soon</span>
      </div>
    </div>
  );
}