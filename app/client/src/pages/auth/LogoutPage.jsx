import { Link } from 'react-router-dom'
import AuthCard from '../../components/auth/AuthCard'
import AuthLayout from '../../components/auth/AuthLayout'

export default function LogoutPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Đăng xuất"
        subtitle="Phiên làm việc của bạn đã được kết thúc an toàn."
        footer={
          <>
            Bạn muốn quay lại?{' '}
            <Link className="font-bold text-[#1d4ed8]" to="/auth/login">
              Đăng nhập lại
            </Link>
          </>
        }
      >
        <div className="space-y-6 my-4">
          <div className="p-4 bg-white/5 rounded border border-[#3d2f2b]/15 font-data-mono text-sm space-y-2 text-[#5c4a43]">
            <div className="flex justify-between border-b border-[#3d2f2b]/10 pb-1.5 mb-1.5">
              <span className="font-bold text-[#3d2f2b]">THÔNG TIN PHIÊN</span>
              <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded text-[10px]">
                ĐÃ ĐÓNG
              </span>
            </div>
            <p className="flex justify-between">
              <span>Trạng thái:</span>
              <span className="font-bold text-green-700">Thành công</span>
            </p>
            <p className="flex justify-between">
              <span>Kết nối Node:</span>
              <span>HypeRoom Node #12</span>
            </p>
            <p className="flex justify-between">
              <span>Bảo mật:</span>
              <span>Cache đã dọn dẹp</span>
            </p>
          </div>
          
          <div className="text-center font-handwriting text-[#5c4a43] text-base italic py-2">
            "Cảm ơn biên tập viên đã đồng hành cùng HypeRoom hôm nay."
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
