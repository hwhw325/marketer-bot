// pages/saved.tsx
import Layout from '../components/Layout';

export default function SavedPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">❤️ 저장된 문구 모아보기</h1>
        {/* TODO: 여기에 saved 로직(로컬스토리지 불러오기 등)을 넣으시면 됩니다 */}
        <p>아직 저장된 문구가 없어요.</p>
      </div>
    </Layout>
  );
}
