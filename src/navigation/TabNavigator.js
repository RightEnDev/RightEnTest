import React, { useEffect, useState,useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { BalanceContext } from '../screen/BalanceContext';

import HomeScreen from '../screen/HomeScreen';
import Profile from '../screen/Profile';
import PriceChart from '../screen/PriceChart';
import History from '../screen/History';
import Settings from '../screen/Settings';
import ServiceForm from '../screen/ServiceForm';
import ImagePicker from '../screen/ImagePicker';
import PaymentPage from '../screen/PaymentPage';
import ShowDetails from '../screen/ShowDetails';
import PrivacyPolicy from '../screen/PrivacyPolicy';
import RefundPolicy from '../screen/RefundPolicy';
import TermsAndConditions from '../screen/TermsAndConditions';
import DetailsScreen from '../screen/DetailsScreen';
import PaymentMode from '../screen/PaymentMode';
import WalletHistory from '../screen/WalletHistory';
import PaymentHistory from '../screen/PaymentHistory';
import ServiceHistory from '../screen/ServiceHistory';
import Type1 from '../ServiceForm/Type1';

import {
  profileSVG,
  historySVG,
  settingsSVG,
  reportSVG,
} from '../../assets/ALLSVG';

const screenWidth = Dimensions.get('window').width;
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { balance, fetchBalance } = useContext(BalanceContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchBalance();
    }, [])
  );

  function MyTabBar({ state, descriptors, navigation }) {
    return (
      <View style={styles.tabWrapper}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          let icon;
          let label_text_value;

          switch (route.name) {
            case 'main':
              icon = require('../../assets/images/logo.png');
              label_text_value = 'Home';
              break;
            case 'Example1_1':
              icon = profileSVG;
              label_text_value = 'Profile';
              break;
            case 'Example1_2':
              icon = reportSVG;
              label_text_value = 'Price Chart';
              break;
            case 'Example2_1':
              icon = historySVG;
              label_text_value = 'History';
              break;
            case 'Example2_2':
              icon = settingsSVG;
              label_text_value = 'Settings';
              break;
            default:
              return null;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View style={{ alignItems: 'center' }}>
                {route.name === 'main' ? (
                  <View style={styles.centerTabIconWrapper}>
                    <Image source={icon} style={styles.centerIcon} />
                  </View>
                ) : (
                  <SvgXml xml={icon} width={30} height={30} />
                )}
                <Text style={styles.label}>{label_text_value}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: '#CFF7FF',
  },
  headerTintColor: '#fff',
  headerTitleAlign: 'center', // ✅ This ensures title stays center
  headerTitle: () => (
    <Image
      source={require('../../assets/images/bn_logo.png')}
      style={{
        width: 100,
        height: 100,
        resizeMode: 'contain',
      }}
    />
  ),
  headerLeft: () => (
    <Image
      source={require('../../assets/images/logo.png')}
      style={{
        width: 50,
        height: 50,
        marginLeft: 15,
        resizeMode: 'contain',
      }}
    />
  ),
  headerRight: () => (
    <View
      style={{
        marginRight: 15,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 12, color: '#000' }}>Your Balance</Text>
      <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>
        ₹ {balance}
      </Text>
    </View>
  ),
};


  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />} initialRouteName="main">
      <Tab.Screen name="Example1_1" component={Profile} options={defaultScreenOptions} />
      <Tab.Screen name="Example1_2" component={PriceChart} options={defaultScreenOptions} />
      <Tab.Screen name="main" component={HomeScreen} options={defaultScreenOptions} />
      <Tab.Screen name="Example2_1" component={History} options={defaultScreenOptions} />
      <Tab.Screen name="Example2_2" component={Settings} options={defaultScreenOptions} />
      <Tab.Screen name="Details" component={DetailsScreen} options={defaultScreenOptions} />
      <Tab.Screen name="PaymentMode" component={PaymentMode} options={defaultScreenOptions} />
      <Tab.Screen name="ServiceForm" component={ServiceForm} options={defaultScreenOptions} />
      <Tab.Screen name="ShowDetails" component={ShowDetails} options={defaultScreenOptions} />
      <Tab.Screen name="Type1" component={Type1} options={defaultScreenOptions} />
      <Tab.Screen name="Payment" component={PaymentPage} options={defaultScreenOptions} />
      <Tab.Screen name="ImagePicker" component={ImagePicker} options={defaultScreenOptions} />
      <Tab.Screen name="TermsAndConditions" component={TermsAndConditions} options={defaultScreenOptions} />
      <Tab.Screen name="RefundPolicy" component={RefundPolicy} options={defaultScreenOptions} />
      <Tab.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={defaultScreenOptions} />
      <Tab.Screen name="WalletHistory" component={WalletHistory} options={defaultScreenOptions} />
      <Tab.Screen name="PaymentHistory" component={PaymentHistory} options={defaultScreenOptions} />
      <Tab.Screen name="ServiceHistory" component={ServiceHistory} options={defaultScreenOptions} />
    </Tab.Navigator>
  );
}

export default TabNavigator;

const styles = StyleSheet.create({
  tabWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#CFF7FF',
    paddingBottom: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 5,
  },
  label: {
    color: '#000',
    fontSize: 13,
    marginTop: 2,
  },
  centerTabIconWrapper: {
    borderWidth: 2,
    borderColor: '#FFCB0A',
    borderRadius: 40,
    padding: 0,
  },
  centerIcon: {
    width: 50,
    height: 50,
  },
  noticeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF3D00',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 61, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
