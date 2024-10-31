


import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, Button, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import qs from 'qs';
// const LOGO = require('../../assets/images/logo_png.png');
const image_background = require('../../assets/images/form_background.png');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgXml } from 'react-native-svg';
import { mobile_svg, passwordsvg, eye, eyeoff } from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';
import { CommonActions } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [Mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [notice, setNotice] = useState('')
  // console.log(notice);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const showSuccessToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello 👋',
      text2: 'You are successfully logged in !',

    });
  };
  const showErrorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Oops! 😔',
      text2: 'Something went wrong. Please try again.',
      // position: 'top', // or 'bottom'
    });
  };


  const validateInput = () => {
    if (Mobile.length !== 10) {
      setErrorMessage('Mobile number must be 10 digits.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) return;

    try {
      const response = await axios.post('https://righten.in/api/users/login',
        qs.stringify({
          mobile: Mobile,
          password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.data.status) {
        await AsyncStorage.setItem('userEmail', response.data.data.email);
        await AsyncStorage.setItem('userPassword', password);
        await AsyncStorage.setItem('us_id', response.data.data.id);
        const notice = response.data.data.notice;
        showSuccessToast();
        if (notice) {
          console.log('notice');
          setNotice(response.data.data.notice);
          setShowNotice(true);
          
        } else {
          setTimeout(() => {
            // navigation.navigate('Home');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              })
            );
          }, 1500); // 2000 milliseconds = 2 seconds

        }

        // Alert.alert('Login Successful', 'You are now logged in.');

      } else {
        showErrorToast();
      }
    } catch (error) {
      showErrorToast();
      // Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };


  return (
    <ImageBackground
      source={image_background}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View
        style={{
          position: 'relative',
          zIndex: 10, // Ensure the toast is on top
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Toast />
      </View>

      <View style={styles.container}>
        {showNotice == true ?
          <>
            <View style={styles.inner_container}>
              <View style={{paddingVertical:20,marginBottom:15,marginTop:15,borderRadius:25}}>
              <Text style={{fontSize:24,fontWeight:'bold' ,color:'red'}}>Notice *</Text>
                <Text>
                 
                  <Text style={{fontSize:20,fontWeight:'normal' ,color:'black'}}>{notice}</Text>
                </Text>
              </View>


              <View style={{ justifyContent: 'center', alignItems: 'center', }}>


                <TouchableOpacity onPress={() => {
                  console.log('closed noticce');
                  setNotice('');
                  setShowNotice(false);
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Home' }],
                    })
                  );
                }}>
                  <Text style={{
                    borderWidth: 3, fontSize: 24, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 15,
                    borderColor: 'red', color: 'red', fontWeight: 'bold'
                  }}>close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>

          :
          <View style={styles.inner_container}>
            {/* <Button title="Show toast" onPress={showSuccessToast} /> */}

            <Text style={styles.title}>Retailer</Text>

            <View style={styles.passwordContainer}>
              <SvgXml xml={mobile_svg} />


              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Mobile No"
                placeholderTextColor="#000000"
                keyboardType="numeric"
                value={Mobile}
                onChangeText={setMobile}
                maxLength={10}
              />
            </View>
            <View style={[styles.passwordContainer, {
              marginTop: 10
            }]}>
              <SvgXml xml={passwordsvg} />

              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholderTextColor="#000000"
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <SvgXml
                  xml={isPasswordVisible ? eyeoff
                    : eye
                  }
                  size={30}
                  color="#FFCB0A"
                />
              </TouchableOpacity>
            </View>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <TouchableOpacity style={styles.login_buton} title="Login" onPress={handleLogin} >
              <Text style={{
                fontSize: 20, fontFamily: 'BAUHS93', fontWeight: 'bold', color: '#FFFFFF'
              }}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              navigation.navigate('Register')
            }}>


              <Text style={{
                fontSize: 20,
                marginTop: 20,
                marginBottom: 20,
                textAlign: 'center',
                color: '#000',
                // borderBottomWidth:1,
              }}>Not have an account? Register</Text>
            </TouchableOpacity>


          </View>
        }


      </View>
    </ImageBackground>
  );
};
export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',

  },
  logo_image: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner_container: {
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    margin: 20,
    padding: 10,
    borderRadius: 25,
    elevation: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFCB0A',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 25,
    borderColor: '#FFCB0A',
    marginBottom: 5,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,

  },
  input: {
    height: 40,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    paddingHorizontal: 10,
    marginLeft: 10,
    color: '#000000',
  },
  login_buton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#FFCB0A',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 10
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },


});


