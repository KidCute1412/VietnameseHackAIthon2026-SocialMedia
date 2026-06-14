import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import TiltContainer from './TiltContainer'

const mentions = [
  {
    id: 1,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHsB1RA8beSaAIshXPJeuN1BB-yBg68DOCQPwvtzqmgdXK8fzLe3aF05ftAHCYxFOBU1z1Ki3aKl1LNHHWKBvjeKUYNzpetP4KQSOGTaw_uabMyvovP2BqbmOUpGZVUSIzmbd6dv5Ye5C916cqoDJmD33ajS-3OLRz2LNb2MHAjc2V5CkEQE57AxMqQF8JXOOQg0Iaxx4u6Xm4nWTzDBonQyGmVYwLQUV_45pjqP2xuwXfZQiDZX8T3Ui2S4NkMZx1LNTOmsl7_e0',
    username: '@crypto_phantom',
    followers: '32.4K Người theo dõi',
    status: 'negative',
    statusLabel: 'Ý kiến tiêu cực',
    content: '"Rò rỉ chưa xác thực cho thấy kiến trúc lõi HypeRoom V3.4 gặp lỗi rò rỉ entropy lớn..."',
  },
  {
    id: 2,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAflKHEN1jqjamQe9VLz8txfOQ_jWwkaQQnvU9eOfLs8zhk0AYup-HlmevtbH204QmLtJG7zXt1X4ZEBWatY_w0TTfPh0mjV9Rc79rwKSFCYHkD5w9TMrsZK6KoTlOQIrFpqLLpEZOEOBJVYsshN6L5jqbkUYrPM8gS6u0AY-G5-HMfjGI94jxJwWoVJvzdA1SjkkYSf7NG79EIgzQBqN8bsZdk3J8rNrxDfyg5yUNO-9OV6N9aIOoAXRVWjPFmmM6ncyz0laupbro',
    username: '@narrative_weaver',
    followers: '15.8K Người theo dõi',
    status: 'controversial',
    statusLabel: 'Tranh cãi',
    content: '"Bản phát hành Alpha mới nhất của HypeRoom dường như ưu tiên các nút tần suất cao hơn người dùng lẻ. Đính kèm dữ liệu."',
  },
  {
    id: 3,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSJ6IGzypyJAjV1FGonekegiXeQ-ts1FIFEUorK5wSlI6rCKuB6NhWiS-lrn1FuBRLTXQb4_UP1yvxU9nqelG8EwjILzUMaR54xcv9Zr8AMhF9yYXl_Eow5nPiyVXHJXTqwk9XZfv0w61ob_k7_l9FLK0WD_Vn3bV7czINBa2bNvUPgSXB0rPUhFWRlY5YCc9AOWuZtvgBxS_k5Dm6qVBAl2lirbuC4xd56GcE59JyAnWz4d32XLnhMDM9QOD8658vfJzZb6QLXv0',
    username: '@void_operator',
    followers: '8.2K Người theo dõi',
    status: 'negative',
    statusLabel: 'Ý kiến tiêu cực',
    content: '"Có ai xác nhận được độ trễ máy chủ ở Vùng 4 không? Trạng thái hệ thống báo OK nhưng log của tôi báo LỖI."',
  },
]

export default function CriticalMentionsTable({ onSelectMention, selectedId }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current.querySelectorAll('.paper-slip'), { opacity: 0, duration: 0 })
      animate(containerRef.current.querySelectorAll('.paper-slip'), {
        translateY: ['50px', '0px'],
        opacity: [0, 1],
        delay: stagger(100),
        duration: 900,
        ease: 'outBack'
      })
    }
  }, [])

  const getStatusClasses = (status) => {
    if (status === 'negative') {
      return 'stamp-warning px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-sm'
    }
    return 'stamp-processing px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-sm'
  }

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Title Badge Pinned to Corkboard */}
      <div className="relative self-start rotate-[-1.5deg] mb-2">
        <div className="paper-tape tape-top-left" style={{ width: '60px', top: '-12px' }} />
        <div className="bg-[#ebd9bc] border border-[#8c7a65] p-3 px-6 rounded shadow-[2px_3px_5px_rgba(0,0,0,0.1)] font-headline-md text-sm text-[#3d2f2b] uppercase tracking-widest font-extrabold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">terminal</span>
          BÀI VIẾT DƯ LUẬN CẦN LƯU Ý
        </div>
      </div>

      {/* Stack of Scrapbook Paper Slips */}
      <div ref={containerRef} className="grid grid-cols-1 gap-6">
        {mentions.map((mention, index) => {
          const isSelected = selectedId === mention.id
          const rotateDeg = (index % 3 - 1) * 1.5
          return (
            <div
              key={mention.id}
              onClick={() => onSelectMention && onSelectMention(mention)}
              style={{ transform: `rotate(${isSelected ? 0 : rotateDeg}deg)` }}
              className={`paper-slip p-5 bg-[#fbfaf4] border border-[#5c4a43]/20 shadow-[3px_5px_12px_rgba(42,32,21,0.06)] hover:shadow-[5px_8px_18px_rgba(42,32,21,0.12)] rounded-md relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
                isSelected ? 'ring-2 ring-[#3f6771] shadow-xl scale-[1.01] z-20' : 'z-10'
              }`}
            >
              <TiltContainer className="w-full h-full">
                {/* Scotch tape overlay */}
                <div className="paper-tape tape-center-top" style={{ top: '-11px', width: '80px' }} />

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded overflow-hidden border border-[#5c4a43]/15 bg-stone-100 shrink-0">
                      <img alt={mention.username} className="w-full h-full object-cover" src={mention.avatar} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1e1613] text-sm leading-tight">{mention.username}</h4>
                      <p className="text-[10px] text-[#5c4a43]/60 font-data-mono mt-0.5">{mention.followers}</p>
                    </div>
                  </div>
                  <div>
                    <span className={getStatusClasses(mention.status)}>{mention.statusLabel}</span>
                  </div>
                </div>

                <p className="text-body-sm text-[#1e1613] italic leading-relaxed border-l-2 border-[#5c4a43]/20 pl-3 py-2 bg-[#5c4a43]/5 rounded-r">
                  {mention.content}
                </p>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-dashed border-[#5c4a43]/15">
                  <span className="text-[10px] text-[#5c4a43]/50 font-data-mono">
                    {isSelected ? '● Đang chọn kiểm chứng' : '○ Nhấn để xem kiểm chứng'}
                  </span>
                  <span className="text-xs text-[#3f6771] font-bold flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-[14px]">fact_check</span>
                    Kiểm chứng ngay &rarr;
                  </span>
                </div>
              </TiltContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}
