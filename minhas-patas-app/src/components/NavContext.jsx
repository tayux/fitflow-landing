import { createContext, useContext } from 'react';

export const NavCtx = createContext({ nav: () => {}, back: () => {}, screen: 'onboarding' });
export const useNav = () => useContext(NavCtx);
