import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ImageBackground, TouchableOpacity, StyleSheet
} from 'react-native';
import axios from 'axios';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgXml } from 'react-native-svg';
import { mobile_svg, passwordsvg, eye, eyeoff } from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';
import { CommonActions } from '@react-navigation/native';

const image_background = require('../../assets/images/form_background.png');

const LoginScreen = ({ navigation }) => {
  const [Mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [showResend, setShowResend] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const showToast = (type, text1, text2 = '') => {
    Toast.show({ type, text1, text2 });
  };

  const validateInput = () => {
    if (Mobile.trim() === '') {
      showToast('error', 'Mobile number required');
      return false;
    }
    if (password.trim() === '') {
      showToast('error', 'Password required');
      return false;
    }
    if (showOtpInput && otp.trim() === '') {
      showToast('error', 'OTP required');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) return;

    try {
      const response = await axios.post(
        'https://righten.in/api/users/login',
        qs.stringify({
          mobile: Mobile,
          password,
          otp: showOtpInput ? otp : '',
          app_version: '1.0.5',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const data = response.data;
      console.log('Login response:', data);

      if (data.status === 426) {
        showToast('error', data.message);
        return;
      }

      if (data.status === 200) {
        await AsyncStorage.setItem('userEmail', data.data.email || '');
        await AsyncStorage.setItem('userPassword', password);
        await AsyncStorage.setItem('us_id', data.data.id || '');
        await AsyncStorage.setItem('balance', data.data.balance || '');
        showToast('success', 'Login Successful', data.message);

        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          );
        }, 1000);
      } else if (data.status === 202 && data.show_otp) {
        setShowOtpInput(true);
        setCountdown(60);
        setShowResend(false);
        showToast('success', 'OTP Sent', data.message);
      } else {
        showToast('error', data.message || 'Login failed');
      }
    } catch (error) {
      console.log('Login error:', error);
      const message = error.response?.data?.message || 'Something went wrong.';
      showToast('error', 'Login Error', message);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch('https://righten.in/api/users/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `mobile=${encodeURIComponent(Mobile)}`
      });

      const data = await response.json();
      if (data.status === 200) {
        setCountdown(60);
        setShowResend(false);
        showToast('success', 'OTP Resent', data.message);
      } else {
        showToast('error', data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Error', 'Could not resend OTP');
    }
  };

  useEffect(() => {
    let timer;
    if (showOtpInput && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown <= 0) {
      setShowResend(true);
    }
    return () => clearInterval(timer);
  }, [showOtpInput, countdown]);

  return (
    <ImageBackground source={image_background} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.toastWrapper}>
        <Toast />
      </View>
      <View style={styles.container}>
        <View style={styles.inner_container}>
          <Text style={styles.title}>Retailer</Text>

          {/* Mobile Field */}
          <View style={styles.passwordContainer}>
            <SvgXml xml={mobile_svg} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Mobile No"
              placeholderTextColor="#000"
              keyboardType="numeric"
              maxLength={10}
              value={Mobile}
              onChangeText={setMobile}
            />
          </View>

          {/* Password Field */}
          <View style={[styles.passwordContainer, { marginTop: 10 }]}>
            <SvgXml xml={passwordsvg} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#000"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <SvgXml xml={isPasswordVisible ? eyeoff : eye} />
            </TouchableOpacity>
          </View>

          {/* OTP Input */}
          {showOtpInput && (
            <View style={[styles.passwordContainer, { marginTop: 10 }]}>
              <SvgXml xml={passwordsvg} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter OTP"
                placeholderTextColor="#000"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
              />
            </View>
          )}

          {/* Resend OTP */}
          {showOtpInput && (
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              {showResend ? (
                <TouchableOpacity onPress={handleResendOTP}>
                  <Text style={{ color: '#007bff', fontWeight: 'bold' }}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ color: '#666' }}>Resend OTP in {countdown}s</Text>
              )}
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            style={[
              styles.login_buton,
              showOtpInput && otp.length !== 6 ? { backgroundColor: '#999' } : {}
            ]}
            disabled={showOtpInput && otp.length !== 6}
          >
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              opacity: showOtpInput && otp.length !== 6 ? 0.6 : 1
            }}>
              {showOtpInput ? 'Verify OTP' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Register */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{
              fontSize: 18,
              marginTop: 20,
              textAlign: 'center',
              color: '#000',
            }}>
              Not have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
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
  toastWrapper: {
  position: 'absolute',
  top: 40, // Adjust if needed
  left: 0,
  right: 0,
  zIndex: 9999,
},

  logo_image: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  toastWrapper: {
    position: 'absolute',
    top: 50, // You can adjust this if needed
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  inner_container: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
    borderRadius: 15,
    borderColor: '#FFCB0A',
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 10,
  },
  login_buton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#FFCB0A',
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
    padding: 12,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  successGif: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  modalTransactionId: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



