import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  StatusBar,
  BackHandler,
  NativeEventEmitter,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PayUBizSdk from 'payu-non-seam-less-react';
import { sha512 } from 'js-sha512';

const PaymentPage = ({ route, navigation }) => {
  const { txn_id, user_id, form_id, service_data } = route.params;

  const [user, setUser] = useState({ name: '', email_id: '', mobile: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failureModalVisible, setFailureModalVisible] = useState(false);

  const amount = parseFloat(service_data.offer_price).toFixed(2);
  const key = 'XYOWAU';
  const merchantSalt = '3VBj9QFB59MzeKIXI11itF4zwTxVlA5Z';

  const urls = {
    ios_surl: 'https://success-nine.vercel.app',
    ios_furl: 'https://failure-kohl.vercel.app',
    android_surl: 'https://righten.in/api/services/check_status_payU',
    android_furl: 'https://righten.in/api/services/payU/failed_url',
  };

  useEffect(() => {
    const fetchUser = async () => {
      const id = user_id || await AsyncStorage.getItem('us_id');
      try {
        const res = await axios.get(`https://righten.in/api/users/profile?user_id=${id}`);
        if (res.data.status === 'success') setUser(res.data.data);
        else Toast.show({ type: 'error', text1: 'Failed to load user data' });
      } catch (err) {
        Toast.show({ type: 'error', text1: 'Network Error' });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const backHandler = () => {
      navigation.navigate('PaymentMode', { txn_id, user_id, form_id, service_data });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => BackHandler.removeEventListener('hardwareBackPress', backHandler);
  }, []);

  useEffect(() => {
    const emitter = new NativeEventEmitter(PayUBizSdk);
    const listeners = [
      emitter.addListener('onPaymentSuccess', handleSuccess),
      emitter.addListener('onPaymentFailure', handleFailure),
      emitter.addListener('onPaymentCancel', handleCancel),
      emitter.addListener('onError', handleError),
      emitter.addListener('generateHash', handleHash),
    ];
    return () => listeners.forEach(sub => sub.remove());
  }, []);

  const handleSuccess = () => {
    Toast.show({ type: 'success', text1: 'Payment Successful' });
    setSuccessModalVisible(true);
    setTimeout(() => navigation.navigate('main'), 1500);
  };

  const handleFailure = () => {
    Toast.show({ type: 'error', text1: 'Payment Failed' });
    setFailureModalVisible(true);
    setTimeout(() => navigation.navigate('main'), 1500);
  };

  const handleCancel = () => Toast.show({ type: 'info', text1: 'Payment Cancelled' });
  const handleError = () => Toast.show({ type: 'error', text1: 'Payment Error' });

  const handleHash = e => {
    const hash = sha512(e.hashString + merchantSalt);
    PayUBizSdk.hashGenerated({ [e.hashName]: hash });
  };

  const startPayment = () => {
    if (isProcessing) return;

    const payTime = paymentCount + 1;
    if (payTime > 3) return navigation.navigate('main');

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#009743" />
      <View style={styles.card}>
        <Text style={styles.title}>Service Payment</Text>
        <Text style={styles.label}>Amount Payable</Text>
        <Text style={styles.amount}>₹ {amount}</Text>
        <TouchableOpacity style={styles.payButton} onPress={startPayment}>
          <Text style={styles.payText}>Pay Now</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Success Modal */}
      <Modal transparent visible={successModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={require('../../assets/success.gif')} style={styles.gif} />
            <Text style={styles.modalText}>Payment Successful</Text>
          </View>
        </View>
      </Modal>

      {/* ❌ Failure Modal */}
      <Modal transparent visible={failureModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={require('../../assets/error.gif')} style={styles.gif} />
            <Text style={styles.modalText}>Payment Failed</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#f5f5f5',
    width: '90%',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  label: { fontSize: 16, color: '#666' },
  amount: { fontSize: 30, fontWeight: 'bold', color: '#009743', marginVertical: 10 },
  payButton: {
    marginTop: 20,
    backgroundColor: '#009743',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  payText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginTop: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  gif: { width: 120, height: 120 },
});
