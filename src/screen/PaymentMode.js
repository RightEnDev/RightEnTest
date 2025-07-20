import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  BackHandler,
  NativeEventEmitter
} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import PayUBizSdk from 'payu-non-seam-less-react';
import { sha512 } from 'js-sha512';

const PaymentMode = ({ route, navigation }) => {
  const { txn_id, user_id, form_id, service_data } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const amount = parseFloat(service_data.offer_price).toFixed(2);
  const [user, setUser] = useState({ name: '', email_id: '', mobile: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);

  const key = 'XYOWAU';
  const merchantSalt = '3VBj9QFB59MzeKIXI11itF4zwTxVlA5Z';

  const urls = {
    ios_surl: 'https://success-nine.vercel.app',
    ios_furl: 'https://failure-kohl.vercel.app',
    android_surl: 'https://righten.in/api/services/check_status_payU',
    android_furl: 'https://righten.in/api/services/payU/failed_url',
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('ImagePicker', {
          form_id,
          txn_id,
          service_data,
        });
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = user_id || await AsyncStorage.getItem('us_id');
        const res = await axios.get(`https://righten.in/api/users/profile?user_id=${id}`);
        if (res.data.status === 'success') {
          const u = res.data.data;
          setUser({
            name: u.name || '',
            email_id: u.email_id || '',
            mobile: u.mobile || '',
          });
        } else {
          Toast.show({ type: 'error', text1: 'User Error', text2: 'Failed to load user data' });
        }
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Network Error', text2: 'Unable to fetch user info' });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedMethod !== 'online') return;

    const emitter = new NativeEventEmitter(PayUBizSdk);
    const listeners = [
      emitter.addListener('onPaymentSuccess', handleSuccess),
      emitter.addListener('onPaymentFailure', handleFailure),
      emitter.addListener('onPaymentCancel', handleCancel),
      emitter.addListener('onError', handleError),
      emitter.addListener('generateHash', handleHash),
    ];
    return () => listeners.forEach(sub => sub.remove());
  }, [selectedMethod]);

  const handleSuccess = () => {
    Toast.show({ type: 'success', text1: '✅ Payment Successful' });
    setTimeout(() => navigation.navigate('main'), 1500);
  };

  const handleFailure = () => {
    Toast.show({ type: 'error', text1: '❌ Payment Failed' });
    setTimeout(() => navigation.navigate('main'), 1500);
  };

  const handleCancel = () => {
    Toast.show({ type: 'info', text1: 'Payment Cancelled' });
  };

  const handleError = () => {
    Toast.show({ type: 'error', text1: 'Payment Error' });
  };

  const handleHash = (e) => {
    const hash = sha512(e.hashString + merchantSalt);
    PayUBizSdk.hashGenerated({ [e.hashName]: hash });
  };

  const WALLET_PAYMENT_URL = 'https://righten.in/api/payment/wallet';

  const handleWalletPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        WALLET_PAYMENT_URL,
        qs.stringify({
          service_id: service_data.service_id,
          form_id: form_id,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const res = response.data;

      if (res.status === true) {
        Toast.show({
          type: 'success',
          text1: '✅ Payment Successful',
          text2: res.message || 'Wallet payment completed.',
        });

        setTimeout(() => {
          navigation.navigate('main');
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: '❌ Payment Failed',
          text2: res.message || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '❌ Server Error',
        text2: 'Could not process wallet payment. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const startPayUPayment = () => {
    if (isProcessing) return;

    const payTime = paymentCount + 1;
    if (payTime > 3) {
      Toast.show({ type: 'error', text1: 'Max retry limit reached' });
      return navigation.navigate('main');
    }

    setPaymentCount(payTime);
    setIsProcessing(true);

    const newTxnId = `${txn_id}R${payTime}`;

    const paymentParams = {
      key,
      transactionId: newTxnId,
      amount,
      productInfo: 'Service Payment',
      firstName: user.name,
      email: user.email_id,
      phone: user.mobile,
      ...urls,
      environment: '0',
      userCredential: '',
      additionalParam: {
        payment: 'Payment Hash',
      },
    };

    const config = {
      primaryColor: '#009743',
      merchantName: 'RIGHTEN SUPERVISION PVT. LTD.',
      cartDetails: [{ Order: 'Service' }],
    };

    PayUBizSdk.openCheckoutScreen({
      payUPaymentParams: paymentParams,
      payUCheckoutProConfig: config,
    });

    setIsProcessing(false);
  };

  const handleProceed = () => {
    if (!selectedMethod) {
      Toast.show({
        type: 'info',
        text1: '⚠️ Please select a payment method',
      });
      return;
    }

    if (selectedMethod === 'wallet') {
      handleWalletPayment();
    } else {
      startPayUPayment();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Choose Payment Method</Text>
        <Text style={styles.amount}>₹ {amount}</Text>

        <TouchableOpacity
          style={[
            styles.methodButton,
            selectedMethod === 'wallet' && styles.selected
          ]}
          onPress={() => setSelectedMethod('wallet')}
          disabled={loading}
        >
          <Image source={require('../../assets/icon/wallet.png')} style={styles.icon} />
          <Text style={styles.methodText}>Wallet Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodButton,
            selectedMethod === 'online' && styles.selected
          ]}
          onPress={() => setSelectedMethod('online')}
          disabled={loading}
        >
          <Image source={require('../../assets/icon/online.png')} style={styles.icon} />
          <Text style={styles.methodText}>Online Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.proceedBtn}
          onPress={handleProceed}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.proceedText}>Proceed</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

export default PaymentMode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  selected: {
    borderColor: '#28a745',
    backgroundColor: '#eafaf1',
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  proceedBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  proceedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#009743',
    marginVertical: 10,
    textAlign: 'center',
  },
});
