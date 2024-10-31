import { StatusBar, Image, BackHandler, ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, Linking, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import logo from '../../assets/images/vertical_righten_without_logo.png'
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import qs from 'qs';
import Toast from 'react-native-toast-message';
import PhonePePaymentSDK from 'react-native-phonepe-pg'
import AsyncStorage from '@react-native-async-storage/async-storage';


import Base64 from 'react-native-base64'
import sha256 from 'sha256'
const PaymentPage = ({ route, navigation }) => {
  const { txn_id, service_data } = route.params;
  // console.log("from payment page");
  // console.log(service_data);
  // console.log(parseFloat(service_data.offer_price) * 100);
  // console.log(txn_id, "----------------------------------------------------------------------------------");
  const [paymentCount, setPaymentCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);


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




  const handlePress = async () => {
    try {

      const environmentForSDK = 'PRODUCTION';
      const merchantId = 'M22BD1522HQFO';
      const salt_key = '7a9c42b8-a73c-45f6-8d4f-13728d0e1966';
      const appId = null;
      const enableLogging = true;
      const amount = parseFloat(service_data.offer_price) * 100;
      const us_id = await AsyncStorage.getItem('us_id');
      PhonePePaymentSDK.init(
        environmentForSDK,
        merchantId,
        appId,
        enableLogging
      ).then(result => {
        const payTime = paymentCount + 1;
        if (payTime > 3) {
          setPaymentCount(0);
          navigation.navigate('main');
          return true;
        }
        setPaymentCount(payTime)
        const merchantTransactionId = txn_id + "R" + payTime;
        console.log(merchantTransactionId);
        console.log('merchantTransactionId : ', merchantTransactionId);
        const requestBody = {
          "merchantId": merchantId,
          "merchantTransactionId": merchantTransactionId,
          "merchantUserId": us_id,
          "amount": amount,
          "redirectMode": "POST",
          "paymentInstrument": {
            "type": "PAY_PAGE"
          }
        }
        const payload = Base64.encode(JSON.stringify(requestBody));
        const encodechecksusm = sha256(Base64.encode(JSON.stringify(requestBody)) + '/pg/v1/pay' + salt_key) + "###" + 1

        PhonePePaymentSDK.startTransaction(
          payload,
          encodechecksusm,
          null, null).then(async (a) => {

            console.log(a.status === 'SUCCESS', merchantTransactionId)
            const response = await axios.post('https://righten.in/api/services/payment_status_phonepe',
              qs.stringify({
                transactionId: txn_id,
                merchantTransactionId: merchantTransactionId,
              }),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            );
            if (a.status === 'SUCCESS') {
              setPaymentCount(0);
              setShowSuccess(true)
              setTimeout(() => {
                setShowSuccess(false)
                navigation.navigate('main');
                return true;
              }, 1500);
            }
          })

      }).catch(e => {
        console.log(e);
      })

    } catch (error) {
      // console.log(error);
      showErrorToast();
    }
    // const url = '';
  };

  return (
    !showSuccess ?
      <SafeAreaView style={styles.container}>

        <View style={styles.content}>


          <Text style={styles.username}>Pay To:  RightEN.in</Text>
          <Image
            source={logo}
            style={{
              width: 300,
              height: undefined,
              aspectRatio: 5,
            }}

          />

          <Text style={styles.amount}>Amount: ₹
            {service_data.offer_price}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            console.log("predd");
            handlePress()
          }}>
            <Text style={styles.buttonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      :
      <View style={{
        backgroundColor: '#f0f0f0',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: '#ffffff',
          height: 300,
          width: 300,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius:15
        }}>
          <Image
            source={require('../../assets/success.gif')}
            style={{
              width: 175,
              height: 175,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              borderRadius: 500

            }}
          />
          <Text style={{fontSize:24,fontWeight:'bold',color:'#009743'}}>Payment Success </Text>
        </View>
      </View>



  )
}

export default PaymentPage;

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
});
