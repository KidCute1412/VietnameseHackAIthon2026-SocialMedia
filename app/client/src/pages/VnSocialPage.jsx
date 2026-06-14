import { useState } from 'react'
import MetricCard from '../components/MetricCard'
import CriticalMentionsTable from '../components/CriticalMentionsTable'
import TrendingVerifyPane from '../components/TrendingVerifyPane'

export default function VnSocialPage() {
  const [selectedMention, setSelectedMention] = useState(null)

  return (
    <main className="flex-1 ml-[80px] mt-[72px] p-gutter-desktop h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar relative z-10 bg-surface-container">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Giám sát Mạng xã hội</h1>
            <p className="text-on-surface-variant font-body-sm opacity-80">Theo dõi bài viết và thái độ của dư luận trên mạng xã hội</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-surface-container text-label-caps text-on-surface-variant border border-outline-variant/30 px-3 py-1.5 rounded flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              TRỰC TIẾP
            </div>
          </div>
        </div>


        {/* Content Layout - Split Screen if selected */}
        <div className="grid grid-cols-12 gap-6">
          <div className={selectedMention ? "col-span-12 lg:col-span-7 transition-all duration-300" : "col-span-12 transition-all duration-300"}>
            <CriticalMentionsTable
              onSelectMention={(item) => setSelectedMention(item)}
              selectedId={selectedMention?.id}
            />
          </div>
          {selectedMention && (
            <div className="col-span-12 lg:col-span-5 h-auto transition-all duration-300">
              <TrendingVerifyPane
                mention={selectedMention}
                onClose={() => setSelectedMention(null)}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
