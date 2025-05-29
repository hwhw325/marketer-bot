// pages/terms.tsx
import { NextPage } from 'next'

const Terms: NextPage = () => {
  return (
      <main className="pt-14 bg-white dark:bg-gray-800 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            이용약관
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            서비스 이용에 앞서 아래 약관을 확인하시고 동의해 주세요.
          </p>
          <div className="prose dark:prose-dark max-w-none">
            {/* 실제 약관 텍스트를 여기에 넣으시면 됩니다. */}
            <h2>제1조 목적</h2>
            <p>이 약관은 …</p>
            <h2>제2조 정의</h2>
            <p>“회사”란 …</p>
            {/* … */}
          </div>
        </div>
      </main>
  )
}

export default Terms
