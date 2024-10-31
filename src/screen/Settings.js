import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { BackHandler } from 'react-native';
import { TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const Settings = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('main'); // Navigate back to the main screen
        return true; // Prevent the default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showSuccessToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello 👋',
      text2: 'Password changed successfully',
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Oops! 😔',
      text2: 'Something went wrong. Please try again.',
    });
  };

  const handleSubmit = async () => {
    try {
      const us_id = await AsyncStorage.getItem('us_id');
      console.log(us_id);
      if (newPassword.length < 6 || confirmPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long.');
        return;
      }
      if (newPassword === '' || confirmPassword === '') {
        Alert.alert('Error', 'Please fill in both fields');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      // Handle password change logic here
      const response = await axios.post('https://righten.in/api/users/update_password',
        qs.stringify({
          user_id: us_id,
          password: newPassword,
          cpassword: confirmPassword,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log(response.data.status);
      if (response.data.status) {
        await AsyncStorage.setItem('userPassword', newPassword);
        showSuccessToast();
        setTimeout(() => {
          setNewPassword('');
          setConfirmPassword('');
          navigation.navigate('main');
        }, 2000);
      } else {
        showErrorToast();
      }
    } catch (error) {
      showErrorToast();
    }
  };

  return (
    <View style={styles.container}>
      <View style={{  }}>
        <View style={{ position: 'relative', zIndex: 10, top: 0, left: 0, right: 0, bottom: 0 }}>
          <Toast />
        </View>

        {/* Change Password Card */}
        <View style={styles.card}>
        <Text style={styles.cardTitle}>Change Your Password</Text>

          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter New Password"
            placeholderTextColor="#000000"
            />

          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm New Password"
            placeholderTextColor="#000000"
            />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons Card */}
        <View style={styles.navCard}>
          <Text style={styles.cardTitle}>Important Notes</Text>


          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={styles.navButtonText}>Privacy Policy</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('TermsAndConditions')}>
            <Text style={styles.navButtonText}>Terms and Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('RefundPolicy')}>
            <Text style={styles.navButtonText}>Refund Policy</Text>
          </TouchableOpacity>




        </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa', // Light background for a modern look
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    color:'#000000',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#FFCB0A', // Bright yellow for the submit button
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffffff', // White background for the password change card
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  navCard: {
    backgroundColor: '#ffffff', // White background for the navigation buttons card
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign:'center',
    color: '#000000', // Green color for the title
  },
  navButton: {
    backgroundColor: '#009743', // Bright yellow for navigation buttons
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  navButtonText: {
    color: '#fff', // Green text color for navigation buttons
    fontWeight: 'bold',

  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
        color: '#000000'
  },
  paragraph: {
    fontSize: 14,
    marginVertical: 5,
        color: '#000000'
  },
});

export default Settings;
