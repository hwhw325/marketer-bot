// pages/login.tsx
import { getProviders, signIn } from 'next-auth/react'

export default function Login({ providers }) {
  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl mb-4">로그인</h1>
      {Object.values(providers).map((prov: any) => (
        <div key={prov.name}>
          <button
            onClick={() => signIn(prov.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {prov.name}로 로그인
          </button>
        </div>
      ))}
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  return { props: { providers } }
}
