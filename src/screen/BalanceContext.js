import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState('0');

  const fetchBalance = async () => {
    const user_id = await AsyncStorage.getItem('us_id');
    if (!user_id) return;

    try {
      const res = await axios.post(
        'https://righten.in/api/users/get_balance',
        new URLSearchParams({ user_id }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (res.data.status) {
        setBalance(res.data.balance.toString());
        await AsyncStorage.setItem('balance', res.data.balance.toString());
      }
    } catch (err) {
      console.log('Balance fetch error:', err.message);
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};