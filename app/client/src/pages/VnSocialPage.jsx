import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MetricCard from '../components/MetricCard'
import CriticalMentionsTable from '../components/CriticalMentionsTable'
import TrendingVerifyPane from '../components/TrendingVerifyPane'

export default function VnSocialPage() {
  const [selectedMention, setSelectedMention] = useState(null)
  const navigate = useNavigate()

  const handleSelectMention = (item) => {
    fetch('/api/verify-mention', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: item.username,
        content: item.content,
        avatar: item.avatar,
        followers: item.followers,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to verify mention')
        return res.json()
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
    <main className="flex-1 ml-[80px] mt-[72px] p-gutter-desktop h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Giám sát Mạng xã hội</h1>
            <p className="text-on-surface-variant font-body-sm opacity-80">Theo dõi bài viết và thái độ của dư luận trên mạng xã hội</p>
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
