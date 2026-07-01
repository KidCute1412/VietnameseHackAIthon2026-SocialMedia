import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MetricCard from '../components/MetricCard'
import CriticalMentionsTable from '../components/CriticalMentionsTable'
import TrendingVerifyPane from '../components/TrendingVerifyPane'
import { apiRequest } from '../lib/api'

export default function VnSocialPage() {
  const [selectedMention, setSelectedMention] = useState(null)
  const navigate = useNavigate()

  const handleSelectMention = (item) => {
    apiRequest('/api/v1/verifications/from-trending', {
      method: 'POST',
      body: {
        post_id: item.id || item.username,
        source_url: item.source_url || null,
      },
    })
      .then((data) => {
        navigate(`/?id=${data.id}`)
      })
      .catch((err) => {
        console.error('Error saving mention verification:', err)
        let dashboardId = '1'
        if (item.username === '@crypto_phantom' || item.username === '@narrative_weaver') {
          dashboardId = '2'
        } else if (item.username === '@void_operator') {
          dashboardId = '3'
        }
        navigate(`/?id=${dashboardId}`)
      })
  }

  return (
    <main className="flex-1 ml-0 md:ml-[80px] mt-[72px] p-4 md:p-gutter-desktop pb-[80px] md:pb-4 h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Thông tin Trending</h1>
            <p className="text-on-surface-variant font-body-sm opacity-80">Theo dõi bài viết nổi bật và thái độ của dư luận trên mạng xã hội</p>
          </div>
        </div>


        {/* Content Layout - Split Screen if selected */}
        <div className="grid grid-cols-12 gap-6">
          <div className={selectedMention ? "col-span-12 lg:col-span-7 transition-all duration-300" : "col-span-12 transition-all duration-300"}>
            <CriticalMentionsTable
              onSelectMention={handleSelectMention}
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
