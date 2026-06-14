import DropZone from '../components/DropZone'
import VerificationHistory from '../components/VerificationHistory'

export default function DashboardPage() {
  return (
    <main className="flex-1 ml-[80px] mt-[72px] p-gutter-desktop h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar bg-surface-container">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Central Input Gateway (8 cols) */}
        <div className="col-span-12 lg:col-span-8 paper-sheet p-8 flex flex-col relative min-h-[600px] h-auto lg:h-full rotate-[-0.6deg] transition-all hover:rotate-[0deg] hover:scale-[1.01] duration-300">
          {/* Scrapbook Tape & Pins */}
          <div className="paper-tape tape-top-left" />
          <div className="paper-tape tape-bottom-right" style={{ bottom: '-10px', right: '30px' }} />
          <div className="paper-pin pin-red pin-center-top" style={{ top: '-6px' }} />
          
          <div className="flex items-center justify-between mb-8 relative z-10 border-b-2 border-dashed border-[#5c4a43]/20 pb-4">
            <h2 className="font-headline-lg text-[26px] text-[#1e1613] font-extrabold flex items-center gap-3">
              <span className="material-symbols-outlined text-[#3f6771] text-[32px]">document_scanner</span>
              Kiểm tra tính xác thực của Công văn & Tài liệu
            </h2>
          </div>
          <DropZone />
        </div>

        {/* Verification History (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col relative rotate-[0.8deg] transition-all hover:rotate-[0deg] hover:scale-[1.01] duration-300">
          <div className="paper-tape tape-top-right" style={{ top: '-14px', right: '20px' }} />
          <div className="paper-pin pin-blue" style={{ top: '-5px', left: '30px' }} />
          <VerificationHistory />
        </div>
      </div>
    </main>
  )
}
