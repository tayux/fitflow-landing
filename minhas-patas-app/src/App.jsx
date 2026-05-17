import { useState, useCallback } from 'react';
import { NavCtx } from './components/NavContext.jsx';
import { PhoneShell } from './components/Shared.jsx';
import { T } from './theme.js';

import Onboarding from './screens/Onboarding.jsx';
import Home       from './screens/Home.jsx';
import Meds       from './screens/Meds.jsx';
import AIReader   from './screens/AIReader.jsx';
import Today      from './screens/Today.jsx';
import Pet        from './screens/Pet.jsx';
import Finance    from './screens/Finance.jsx';
import LockNotif  from './screens/LockNotif.jsx';

const SCREENS = {
  onboarding: { component: Onboarding, dark: false },
  home:       { component: Home,       dark: false },
  meds:       { component: Meds,       dark: false },
  ai:         { component: AIReader,   dark: false },
  today:      { component: Today,      dark: false },
  pet:        { component: Pet,        dark: false },
  finance:    { component: Finance,    dark: false },
  lock:       { component: LockNotif,  dark: true  },
};

export default function App() {
  const [screen, setScreen]   = useState('onboarding');
  const [history, setHistory] = useState([]);

  const nav = useCallback((id) => {
    if (!SCREENS[id]) return;
    setHistory(h => [...h, screen]);
    setScreen(id);
  }, [screen]);

  const back = useCallback(() => {
    setHistory(h => {
      const prev = h[h.length - 1] || 'home';
      setScreen(prev);
      return h.slice(0, -1);
    });
  }, []);

  const { component: Screen, dark } = SCREENS[screen] || SCREENS.home;

  return (
    <NavCtx.Provider value={{ nav, back, screen }}>
      {/* Full-screen mobile wrapper */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', minHeight:'100vh', background:T.bgWash, padding:'0' }}>

        {/* Phone frame on desktop, full screen on mobile */}
        <div style={{
          width:'100%', maxWidth:430,
          height:'100dvh', maxHeight:930,
          position:'relative', overflow:'hidden',
          boxShadow:'0 30px 80px rgba(0,0,0,0.18)',
        }}>
          <PhoneShell dark={dark}>
            <Screen />
          </PhoneShell>
        </div>
      </div>
    </NavCtx.Provider>
  );
}
