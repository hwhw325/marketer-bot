import { FC } from 'react'
import { HiX } from 'react-icons/hi'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out z-50`}
    >
      <button
        onClick={onClose}
        className="p-4 focus:outline-none"
        aria-label="Close menu"
      >
        <HiX size={24} />
      </button>
      <nav className="flex flex-col p-4 space-y-2">
        <a href="/" className="hover:text-blue-600">Home</a>
        <a href="/how-to" className="hover:text-blue-600">How-to</a>
        <a href="/contact" className="hover:text-blue-600">Contact</a>
        {/* 원하는 링크 추가 */}
      </nav>
    </div>
  )
}
