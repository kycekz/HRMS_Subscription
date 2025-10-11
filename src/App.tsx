import { Routes, Route, useLocation } from 'react-router-dom';
import SubscriptionSignup from './pages/Public/Subscription';
import SubscriptionComplete from './pages/Public/SubscriptionComplete';
import LandingPage from './pages/Public/LandingPage';
import mainHtml from './pages/Public/Main.html?raw';

function MainPage() {
  return <div dangerouslySetInnerHTML={{ __html: mainHtml }} />;
}


function App() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/subscription" element={<SubscriptionSignup />} />
      <Route path="/subscription-complete" element={
        <SubscriptionComplete 
          subscriptionInfo={location.state?.subscriptionInfo}
          paymentInfo={location.state?.paymentInfo}
        />
      } />
    </Routes>
  );
}

export default App;
