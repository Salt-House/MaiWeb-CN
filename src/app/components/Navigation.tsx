import Link from 'next/link';

export default function Navigation() {
  return (
    <div
      className="relative z-[10] w-[90%] max-w-[800px] bg-white/30 backdrop-blur-md shadow-lg rounded-lg p-6 mx-auto mt-10 flex items-center space-x-4 justify-center text-2xl text-white font-bold">
      <Link href={"/music"} className="hover:scale-125 transition-all duration-300 ease-in-out">音乐</Link>
      <div>|</div>
      <Link href={"/region"} className="hover:scale-125 transition-all duration-300 ease-in-out">区域</Link>
      <div>|</div>
      <Link href="/" className="hover:scale-125 transition-all duration-300 ease-in-out">工具</Link>
      <div>|</div>
      <Link href="/" className="hover:scale-125 transition-all duration-300 ease-in-out">教学</Link>
    </div>
  );
}