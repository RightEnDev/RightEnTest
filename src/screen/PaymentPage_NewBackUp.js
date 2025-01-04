import { Alert, Button, NativeEventEmitter, Modal, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import qs from 'qs';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PayUBizSdk from 'payu-non-seam-less-react';
import { sha512 } from 'js-sha512';

const PaymentPage_NewBackUp = ({ route, navigation }) => {

    const { txn_id, user_id, service_data } = route.params;
    const [userData, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(service_data);

    const [firstName, setFirstName] = useState(''); // Initially empty string
    const [email, setEmail] = useState(''); // Initially empty string
    const [phone, setPhone] = useState(''); // Initially empty string

    useEffect(() => {
      const fetchData = async () => {
        try {
          // If user_id is not passed as a route param, try fetching it from AsyncStorage
          const userId = user_id || await AsyncStorage.getItem('us_id');
          console.log('Fetched User ID:', userId);
  
          if (!userId) {
            setError('User ID is missing');
            setLoading(false);
            return;
          }
  
          // Fetch user data based on the user_id
          const response = await axios.get(`https://righten.in/api/users/profile?user_id=${userId}`);
          console.log('API Response--------:', response.data);
  
          // Check if the response is successful
          if (response.data.status === 'success') {
            const userData = response.data.data;
            setFirstName(userData.name || '');
            setEmail(userData.email_id || '');
            setPhone(userData.mobile || '');
          } else {
            setError('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error.message); // Handle any error
        } finally {
          setLoading(false); // Stop loading when done
        }
      };
  
      fetchData();
    }, [user_id, navigation]);

    const [key, setKey] = useState("XYOWAU"); // Replace with your PayU Key
    const [merchantSalt, setMerchantSalt] = useState("3VBj9QFB59MzeKIXI11itF4zwTxVlA5Z"); // Replace with your Salt Key

    const amount = parseFloat(service_data.offer_price).toFixed(2); // Format amount to 2 decimals
    //const [productInfo, setProductInfo] = useState(service_data.name); // Replace with your product name
    const productInfo = service_data.name;
    // const [firstName, setFirstName] = useState('');
    // const [email, setEmail] = useState('');
    // const [phone, setPhone] = useState('');

    const [ios_surl, setIosSurl] = useState(
        'https://success-nine.vercel.app',
      );
      const [ios_furl, setIosFurl] = useState(
        'https://failure-kohl.vercel.app',
      );
      const [environment, setEnvironment] = useState('0');
      const [android_surl, setAndroidSurl] = useState(
        'https://success-nine.vercel.app',
      );
      const [android_furl, setAndroidFurl] = useState(
        'https://failure-kohl.vercel.app',
      );

  const [udf1, setUdf1] = useState('udf1s');
  const [udf2, setUdf2] = useState('udf2');
  const [udf3, setUdf3] = useState('udf3');
  const [udf4, setUdf4] = useState('udf4');
  const [udf5, setUdf5] = useState('udf5');

  const [showCbToolbar, setShowCbToolbar] = useState(true);
  const [userCredential, setUserCredential] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#4c31ae');

  const [secondaryColor, setSecondaryColor] = useState('#022daf');
  const [merchantName, setMerchantName] = useState('DEMO PAY U');
  const [merchantLogo, setMerchantLogo] = useState("" );

  const [cartDetails, setCartDetails] = useState([
    {Order: 'Food Order'},
    {'order Id': '123456'},
    {'Shop name': 'Food Shop'},
  ]);
  const [paymentModesOrder, setPaymentModesOrder] = useState([
    {UPI: 'TEZ'},
    {Wallets: 'PAYTM'},
    {EMI: ''},
    {Wallets: 'PHONEPE'},
  ]);
  const [surePayCount, setSurePayCount] = useState(1);
  const [merchantResponseTimeout, setMerchantResponseTimeout] = useState(10000);
  const [autoApprove, setAutoApprove] = useState(false);
  const [merchantSMSPermission, setMerchantSMSPermission] = useState(false);
  const [
    showExitConfirmationOnCheckoutScreen,
    setShowExitConfirmationOnCheckoutScreen,
  ] = useState(true);
  const [
    showExitConfirmationOnPaymentScreen,
    setShowExitConfirmationOnPaymentScreen,
  ] = useState(true);

  const [autoSelectOtp, setAutoSelectOtp] = useState(true);

  requestSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: 'PayU SMS Permission',
          message:
            'Pay  U Demo App needs access to your sms to autofill OTP on Bank Pages ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('SMS Permission Granted!');
      } else {
        console.log('SMS Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  displayAlert = (title, value) => {
    Alert.alert(title, value);
    
  };
  onPaymentSuccess = e => {
    console.log(e.merchantResponse);
     console.log(e.payuResponse);
     displayAlert('onPaymentSuccess', "Payment success");
   };

   onPaymentFailure = e => {
    console.log(e.merchantResponse);
    console.log(e.payuResponse);
    displayAlert('onPaymentFailure', JSON.stringify(e));
  }


  onPaymentCancel = e => {
    console.log('onPaymentCancel isTxnInitiated -' + e);
    displayAlert('onPaymentCancel', JSON.stringify(e));
  }

  onError = e => {
 displayAlert('onError', JSON.stringify(e));
  };


  calculateHash = data => {
    console.log(data);
    var result = sha512(data);
    console.log(result);
    return result;
  };

  sendBackHash = (hashName, hashData) => {
    var hashValue = calculateHash(hashData);
    var result = {[hashName]: hashValue};
     console.log(result);
    PayUBizSdk.hashGenerated(result);
  };
  generateHash = e => {
    console.log(e.hashName);
    console.log(e.hashString);
    sendBackHash(e.hashName, e.hashString + merchantSalt);
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(PayUBizSdk);
    payUOnPaymentSuccess = eventEmitter.addListener(
      'onPaymentSuccess',
      onPaymentSuccess,
    );
    payUOnPaymentFailure = eventEmitter.addListener(
      'onPaymentFailure',
      onPaymentFailure,
    );
    payUOnPaymentCancel = eventEmitter.addListener(
      'onPaymentCancel',
      onPaymentCancel,
    );
    payUOnError = eventEmitter.addListener('onError', onError);
    payUGenerateHash = eventEmitter.addListener('generateHash', generateHash);

    //Unregister eventEmitters here
    return () => {
    console.log('Unsubscribed!!!!');
      payUOnPaymentSuccess.remove();
      payUOnPaymentFailure.remove();
      payUOnPaymentCancel.remove();
      payUOnError.remove();
      payUGenerateHash.remove();
    };
  }, [merchantSalt]);

  const createPaymentParams=()=>{
    var txnid = new Date().getTime().toString();
    var payUPaymentParams = {
        key: key,
        transactionId: txn_id,
        amount: amount,
        productInfo: productInfo,
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
          udf1: udf1,
          udf2: udf2,
          udf3: udf3,
          udf4: udf4,
          udf5: udf5,
          walletUrn: '100000',
        },
      };
      var payUCheckoutProConfig = {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        merchantName: merchantName,
        merchantLogo: merchantLogo,
        showExitConfirmationOnCheckoutScreen:
          showExitConfirmationOnCheckoutScreen,
        showExitConfirmationOnPaymentScreen: showExitConfirmationOnPaymentScreen,
        cartDetails: cartDetails,
        paymentModesOrder: paymentModesOrder,
        surePayCount: surePayCount,
        merchantResponseTimeout: merchantResponseTimeout,
        autoSelectOtp: autoSelectOtp,
        autoApprove: autoApprove,
        merchantSMSPermission: merchantSMSPermission,
        showCbToolbar: showCbToolbar,
      };
      return {
        payUPaymentParams: payUPaymentParams,
        payUCheckoutProConfig: payUCheckoutProConfig,
      };

  }

  const lunchPayUPayment=()=>{
    PayUBizSdk.openCheckoutScreen(createPaymentParams());

}



  return (
    <View>
      <Text style={{fontSize:20,marginVertical:20}}>Your  payable Amount is {amount}</Text>
      <Button
      title='Pay Now'
      onPress={lunchPayUPayment}
      />
    </View>
  )
}

export default PaymentPage_NewBackUp

const styles = StyleSheet.create({})