export default function SmartReaderPane({ data }) {
  const getStatusLabel = (status) => {
    switch (status) {
      case 'verified': return 'ĐÃ XÁC MINH'
      case 'warning': return 'CẢNH BÁO'
      case 'processing': return 'ĐANG XỬ LÝ'
      default: return 'ĐANG PHÂN TÍCH...'
    }
  }

  return (
    <section className="w-1/2 h-full relative border-r border-outline-variant/20 p-8 overflow-hidden bg-[#061226]">
      {/* Section Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">center_focus_strong</span>
            Bản quét &amp; Phân tích Văn bản
          </h2>
          <p className="text-on-surface-variant font-body-sm">
            Quét sâu: {data.fileName}
          </p>
        </div>
        <div className="bg-surface-variant/30 px-3 py-1 rounded border border-outline-variant/20 text-primary font-data-mono text-[10px]">
          TRẠNG THÁI: {getStatusLabel(data.status)}
        </div>
      </div>

      {/* Document Viewer with Grid & OCR Overlays */}
      <div className="relative w-full aspect-[4/5] max-h-[70vh] bg-surface-container-lowest rounded-xl border border-secondary/20 overflow-hidden group p-6 flex flex-col">
        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#BDE8F5 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* The Document OCR Text */}
        <div className="flex-1 overflow-y-auto custom-scrollbar font-data-mono text-xs leading-relaxed p-4 z-10 bg-black/40 border border-white/5 rounded-lg whitespace-pre-wrap select-text text-glow-highlight/90 shadow-[inner_0_0_10px_rgba(0,0,0,0.5)]">
          {data.ocrText}
        </div>

        {/* Scan Line Effect */}
        <div className="scan-effect absolute w-full top-0 left-0 z-20 pointer-events-none" />
      </div>

      {/* Footer Metadata */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">speed</span>
          <span className="font-data-mono text-body-sm">Thời gian xử lý: 0.8 giây</span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">fingerprint</span>
          <span className="font-data-mono text-body-sm">
            Mã định danh: {data.id === '1' ? 'af92...c3d1' : `hash_${data.id}...`}
          </span>
        </div>
      </div>
    </section>
  )
}

