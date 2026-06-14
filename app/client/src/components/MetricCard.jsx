export default function MetricCard({ type }) {
  if (type === 'mentions') {
    return (
      <div className="glass-panel p-panel-padding rounded-xl flex flex-col justify-between">
        <div>
          <span className="text-label-caps text-on-surface-variant">TỔNG LƯỢT ĐỀ CẬP</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-1">254.3K</h2>
        </div>
        <div className="h-12 w-full mt-4">
          <svg className="w-full h-full" viewBox="0 0 200 40">
            <polyline fill="none" points="0,35 20,38 40,30 60,34 80,10 100,25 120,5 140,28 160,32 180,15 200,20" stroke="#4988C4" strokeWidth="2" />
            <path d="M0,35 20,38 40,30 60,34 80,10 100,25 120,5 140,28 160,32 180,15 200,20 V40 H0 Z" fill="#4988C4" fillOpacity="0.1" />
          </svg>
        </div>
      </div>
    )
  }

  if (type === 'virality') {
    return (
      <div className="glass-panel p-panel-padding rounded-xl flex flex-col justify-between">
        <div>
          <span className="text-label-caps text-on-surface-variant">TỐC ĐỘ LAN TRUYỀN</span>
          <div className="font-headline-md text-headline-md mt-1 pulse-light-blue">NGUY CẤP</div>
        </div>
      </div>
    )
  }

  if (type === 'sentiment') {
    return (
      <div className="glass-panel p-panel-padding rounded-xl flex flex-col justify-between">
        <div>
          <span className="text-label-caps text-on-surface-variant">Ý KIẾN DƯ LUẬN</span>
          <div className="flex justify-between mt-1 items-baseline">
            <span className="font-headline-md text-headline-md text-[#F43F5E]">70%</span>
            <span className="text-body-sm text-on-surface-variant">Ý kiến tiêu cực</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex h-3 w-full rounded-full overflow-hidden bg-surface-container">
            <div className="h-full bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]" style={{ width: '70%' }} />
            <div className="h-full bg-[#4988C4]" style={{ width: '18%' }} />
            <div className="h-full bg-[#10B981]" style={{ width: '12%' }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <span>Tiêu cực</span>
            <span>Trung lập</span>
            <span>Tích cực</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}
