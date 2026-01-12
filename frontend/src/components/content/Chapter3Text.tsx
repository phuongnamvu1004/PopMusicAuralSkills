import { Lock } from 'lucide-react';

export function Chapter3Text() {
  return (
    <div className="max-w-4xl">
      <h2 className="mb-6">Level 1C</h2>
      
      <div className="max-w-prose">
        <div className="bg-white rounded-xl shadow-xl p-12 border border-gray-200 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mb-3">Content Coming Soon</h3>
          <p className="text-gray-500">
            This level is currently being developed. Check back soon for new ear training content!
          </p>
        </div>
      </div>
    </div>
  );
}
