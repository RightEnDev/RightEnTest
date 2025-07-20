import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { BalanceProvider } from '../screen/BalanceContext';
import linking from '../linking';

const AppNav = () => {
  return (
    <BalanceProvider>
      <NavigationContainer linking={linking}>
        <StackNavigator />
      </NavigationContainer>
    </BalanceProvider>
  );
};

export default AppNav;