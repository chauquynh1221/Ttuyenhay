import Mascot from './Mascot'

// Trạng thái trống có linh vật Bongmeow — dùng chung cho search/tủ sách/danh sách...
export default function EmptyState({
  title = 'Meo~ chưa có gì ở đây',
  hint,
  action,
}: {
  title?: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4">
      <Mascot pose="sleep" className="w-28 h-28" />
      <p className="text-foreground font-bold text-base mt-4">{title}</p>
      {hint && <p className="text-muted text-sm mt-1 max-w-xs">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
