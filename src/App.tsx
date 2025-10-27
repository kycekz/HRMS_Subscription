import { Routes, Route, useLocation } from 'react-router-dom';
import SubscriptionSignup from './pages/Public/Subscription';
import SubscriptionComplete from './pages/Public/SubscriptionComplete';
import LandingPage from './pages/Public/LandingPage';
import TermsOfService from './pages/Public/TermsOfService';
import PrivacyPolicy from './pages/Public/PrivacyPolicy';
import mainHtml from './pages/Public/Main.html?raw';
import Maintsx from './pages/Public/Maintsx';
import Wip from './pages/Public/wip';

function MainPage() {
  return <div dangerouslySetInnerHTML={{ __html: mainHtml }} />;
}


function App() {
  const location = useLocation();
  return (
    <Routes>
      {/*<Route path="/" element={<MainPage />} />*/}
      <Route path="/" element={<Maintsx />} />
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/maintsx" element={<Maintsx />} />
      <Route path="/wip" element={<Wip />} />
      <Route path="/subscription" element={<SubscriptionSignup />} />
      <Route path="/subscription-complete" element={
        <SubscriptionComplete 
          subscriptionInfo={location.state?.subscriptionInfo}
          paymentInfo={location.state?.paymentInfo}
        />
      } />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
}

export default App;
