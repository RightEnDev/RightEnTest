import { Alert, Button, BackHandler, NativeEventEmitter, NativeModules, SafeAreaView, TouchableOpacity, Modal, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState,useCallback} from 'react'
import axios from 'axios';
import qs from 'qs';
import { useFocusEffect } from '@react-navigation/native';
import logo from '../../assets/images/vertical_righten_without_logo.png'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PayUBizSdk from 'payu-non-seam-less-react';
import { sha512 } from 'js-sha512';

const PaymentPage = ({ route, navigation }) => {
  const { txn_id, user_id, service_data } = route.params;
  const [userData, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [merchantTransactionId, setMerchantTransactionId] = useState('');

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failureModalVisible, setFailureModalVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentCount, setPaymentCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);


  const amount = parseFloat(service_data.offer_price).toFixed(2);
  const productInfo = service_data.name;

  const key = "XYOWAU"; // PayU Key
  const merchantSalt = "3VBj9QFB59MzeKIXI11itF4zwTxVlA5Z"; // Salt Key

  const [ios_surl, setIosSurl] = useState('https://success-nine.vercel.app');
  const [ios_furl, setIosFurl] = useState('https://failure-kohl.vercel.app');
  const [android_surl, setAndroidSurl] = useState('https://righten.in/api/services/check_status_payU');
  const [android_furl, setAndroidFurl] = useState('https://righten.in/api/services/payU/failed_url');
  const [environment, setEnvironment] = useState('0');

  const [userCredential, setUserCredential] = useState('');


    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          setPaymentCount(0);
          navigation.navigate('main');
          return true;
        };
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [navigation])
    );
  
    const showErrorToast = () => {
      Toast.show({
        type: 'error',
        text1: 'Oops! 😔',
        text2: 'Something went wrong. Please try again.',
        // position: 'top', // or 'bottom'
      });
    };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user_id || await AsyncStorage.getItem('us_id');
        if (!userId) {
          setError('User ID is missing');
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://righten.in/api/users/profile?user_id=${userId}`);
        if (response.data.status === 'success') {
          const userData = response.data.data;
          console.log('User Data: ', userData);
          setFirstName(userData.name || '');
          setEmail(userData.email_id || '');
          setPhone(userData.mobile || '');
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  
  }, []);




  const createPaymentParams=()=>{

    const payTime = paymentCount + 1;
    if (payTime > 3) {
      setPaymentCount(0);
      navigation.navigate('main');
      return;
    }

    setPaymentCount(payTime);
    const newTransactionId = `${txn_id}R${payTime}`;
    setMerchantTransactionId(newTransactionId);



    var payUPaymentParams = {
      key: key,
      //transactionId: newTransactionId,
      transactionId: txn_id,
      amount: amount,
      productInfo: "Service Payment",
      firstName: firstName,
      email: email,
      phone: phone,
      ios_surl: ios_surl,
      ios_furl: ios_furl,
      android_surl: android_surl,
      android_furl: android_furl,
      environment: environment,
      userCredential: userCredential,
      additionalParam: {
        payment_related_details_for_mobile_sdk: "payment_related_details_for_mobile_sdk hash",
        vas_for_mobile_sdk: "vas_for_mobile_sdk hash",
        payment: "Payment Hash",
        udf1: 'udf1s',
        udf2: 'udf2',
        udf3: 'udf3',
        udf4: 'udf4',
        udf5: 'udf5',
        walletUrn: '100000',
      },
    };
    var payUCheckoutProConfig = {
      primaryColor: '#4c31ae',
      secondaryColor: '#022daf',
      merchantName: 'RIGHTEN SUPERVISION PRIVATE LIMITED',
      merchantLogo: "<Image source={logo} style={{ width: 300, height: undefined, aspectRatio: 5 }} />",
      showExitConfirmationOnCheckoutScreen: true,
      showExitConfirmationOnPaymentScreen: true,
      cartDetails: [{ Order: 'Food Order' }, { 'order Id': '123456' }, { 'Shop name': 'Food Shop' }],
      paymentModesOrder: [{ UPI: 'TEZ' }, { Wallets: 'PAYTM' }, { EMI: '' }, { Wallets: 'PHONEPE' }],
      surePayCount: 1,
      merchantResponseTimeout: 10000,
      autoSelectOtp: true,
      autoApprove: false,
      merchantSMSPermission: false,
      showCbToolbar: true,
    };

    return {
      payUPaymentParams: payUPaymentParams,
      payUCheckoutProConfig: payUCheckoutProConfig,
    };
  }


const lunchPayUPayment=()=>{
    PayUBizSdk.openCheckoutScreen(createPaymentParams());

}




  const displayAlert = (title, value) => {
    Alert.alert(title, value);
  };


  // onPaymentSuccess = e => {
  //    console.log(e.payuResponse);
  //    //displayAlert('Success', 'Payment Success');
  //    setSuccessModalVisible(true);

  //    // Navigate to the main screen after 1 second
  //    setTimeout(() => {
  //      navigation.navigate('main');
  //      setSuccessModalVisible(false); // Close the modal after navigation
  //    }, 2000);
  //  };

  const onPaymentSuccess = async (e) => {
    //const transactionId = merchantTransactionId;
    //console.log('check status txn_id in payment id: ', txn_id);
    //console.log('check status txn_id in payment id: ', merchantTransactionId);
    //console.log('Payment Success Response:', e.payuResponse);
    //console.log('PayU Response Txnid: ', payuResponse.txnid);
    //console.log('Check Status Txn Id: ', txn_id);

    if (!txn_id) {
      console.error('Transaction ID is missing');
      setTimeout(() => navigation.navigate('main'), 1000);
      return;
    }

    try {
      const response = await axios.post(
        'https://righten.in/api/services/check_status_payU',
        qs.stringify({ txnid: txn_id }), // Pass correct transaction ID
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      console.log('Payment Status Response:', response.data);

      if (response.data.status === true) {
        setSuccessModalVisible(true);
        setTimeout(() => navigation.navigate('main'), 1000);
      } else {
        console.error('Payment verification failed:', response.data.message);
        setTimeout(() => navigation.navigate('main'), 1000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error.message);
      console.log(e);
      setTimeout(() => navigation.navigate('main'), 1000);
    }
  };


  
  const onPaymentFailure = e => {
    console.error('Payment Failure Response:', e.payuResponse);
    setTimeout(() => navigation.navigate('main'), 1000);
    setFailureModalVisible(true);
  };

  const onPaymentCancel = e => {
    console.log('Payment Cancelled:', e);
    Alert.alert('Payment Cancelled', 'You have cancelled the payment.');
  };

  const onError = e => {
    console.error('Payment Error:', e);
    Alert.alert('Error', 'An error occurred during the payment process.');
  };

  const calculateHash = data => {
    const result = sha512(data);
    return result;
  };

  const sendBackHash = (hashName, hashData) => {
    const hashValue = calculateHash(hashData);
    PayUBizSdk.hashGenerated({ [hashName]: hashValue });
  };

  const generateHash = e => {
    sendBackHash(e.hashName, e.hashString + merchantSalt);
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(PayUBizSdk);
    const payUOnPaymentSuccess = eventEmitter.addListener('onPaymentSuccess', onPaymentSuccess);
    const payUOnPaymentFailure = eventEmitter.addListener('onPaymentFailure', onPaymentFailure);
    const payUOnPaymentCancel = eventEmitter.addListener('onPaymentCancel', onPaymentCancel);
    const payUOnError = eventEmitter.addListener('onError', onError);
    const payUGenerateHash = eventEmitter.addListener('generateHash', generateHash);

    return () => {
      payUOnPaymentSuccess.remove();
      payUOnPaymentFailure.remove();
      payUOnPaymentCancel.remove();
      payUOnError.remove();
      payUGenerateHash.remove();
    };
  }, [merchantSalt]);




  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={logo} style={{ width: 300, height: undefined, aspectRatio: 5 }} />
        <Text style={styles.amount}>Amount: ₹{amount}</Text>
        <TouchableOpacity style={styles.button} onPress={lunchPayUPayment}>
          <Text style={styles.buttonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Payment Success */}
      <Modal transparent visible={successModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Lottie Animation (Success GIF) */}
            <Image
              source={require('../../assets/success.gif')} // Replace with your own JSON animation file
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.modalText}>Payment Successful!</Text>

            {/* Go to Main Page button */}
            <Button title="Ok" onPress={() => navigation.navigate('main')} />
          </View>
        </View>
      </Modal>

      {/* Modal for Payment Failed */}

      <Modal transparent visible={failureModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Lottie Animation (Success GIF) */}
            <Image
              source={require('../../assets/error.gif')} // Replace with your own JSON animation file
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.modalText}>Payment Failed!</Text>

            {/* Go to Main Page button */}
            <Button title="Ok" onPress={() => navigation.navigate('main')} />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  content: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amount: {
    fontSize: 20,
    marginBottom: 20,
    color: '#009743',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
});


export default PaymentPage;
