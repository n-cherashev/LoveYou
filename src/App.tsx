import HeartScene from './components/HeartScene';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <HeartScene onHeartCountChange={() => {}} />
    </Layout>
  );
}

export default App;
