export default function ActionButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      className="w-40 h-12 bg-white rounded-full flex justify-center items-center text-black my-5 border-4 border-[rgb(155,244,236)] cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      {children}
    </div>
  )
}