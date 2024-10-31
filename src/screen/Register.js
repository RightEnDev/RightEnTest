import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ImageBackground, Button, Image, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import qs from 'qs';
const LOGO = require('../../assets/images/logo_png.png');
const image_background = require('../../assets/images/form_background.png');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgXml } from 'react-native-svg';
import { mobile_svg, passwordsvg, eye, eyeoff } from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { CommonActions } from '@react-navigation/native';


const Register = ({ navigation }) => {

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [block, setBlock] = useState();
  const [postOffice, setPostOffice] = useState('');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');

  const [openState, setOpenState] = useState(false);
  const [itemsState, setItemsState] = useState([]);

  const [openCity, setOpenCity] = useState(false);
  const [itemsCity, setItemsCity] = useState([]);

  const [openBlock, setOpenBlock] = useState(false);
  const [itemsBlock, setItemsBlock] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchStateData = async () => {
    try {
      try {
        const response = await axios.get(`https://righten.in/api/users/state`);
        if (!response.data.status === "success") {
          throw new Error('Network response was not ok');
        }

        setItemsState(response.data.data);
        // console.log(Array.isArray(itemsState));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCityData = async () => {
    try {
      try {
        const response = await axios.post('https://righten.in/api/users/city',
          qs.stringify({
            value: state.value,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        setItemsCity(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockData = async () => {
    try {
      try {
        const response = await axios.post('https://righten.in/api/users/block',
          qs.stringify({
            value: city.value,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        // console.log(response.data.data);

        setItemsBlock(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStateData();
    fetchCityData();
    fetchBlockData();
  }, [state, city, block]);


  const [errorMessage, setErrorMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    const formattedDate = String(currentDate.toISOString().split('T')[0]);
    setDob(formattedDate);
  };




  const showSuccessToast = (password,user_id) => {
    Toast.show({
      type: 'success',
      text1: 'Hello 👋',
      text2: `Registration succcessfull , your password is ${password}`,

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


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = (text) => {
    setEmail(text);
    if (validateEmail(text)) {
      setEmailError('');
    } else {
      setEmailError('Invalid email address');
    }
  };
  const validateInput = () => {
    if (name.length == 0) {
      return false;
    }
    else if (mobile.length !== 10) {
      return false;
    }
    else if (!validateEmail(email)) {
      return false;
    }
    else if (pincode.length !== 6) {
      return false;
    }
    else if (state.value.length <= 1) {
      return false;
    }
    else if (city.value.length <= 1) {
      return false;
    }
    else if (village.length == 0) {
      return false;
    }
    else if (postOffice.length == 0) {
      return false;
    }

    else {
      return true;

    }
  }

  const handlesubmit = async () => {
    // console.log(validateInput());
    if (!validateInput()) return;

    console.log({
      name: name,
      mobile: mobile,
      dob: dob,
      email: email,
      state: state.value,
      city: city.value,
      block: block.value,
      postOffice: postOffice,
      village: village,
      pincode: pincode
    });


    try {
      const response = await axios.post('https://righten.in/api/users/register',
        qs.stringify({
          name: name,
          mobile: mobile,
          dob: dob,
          email: email,
          state: state.value,
          city: city.value,
          block: block.value,
          postOffice: postOffice,
          village: village,
          pin_code: pincode
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      // console.log(response.data.password);

      if (response.data.status === 'success') {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword',response.data.password);
        await AsyncStorage.setItem('us_id', String(response.data.user_id));

        showSuccessToast(response.data.password,response.data.user_i5);

        setTimeout(() => {
          // navigation.navigate('Home');
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          );
        }, 2000); // 2000 milliseconds = 2 seconds

      } else {
        showErrorToast();
      }
    } catch (error) {
      // console.log(error);
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
      {/* <Toast /> */}
      <View style={styles.container}>
        <View style={styles.inner_container}>
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
          <ScrollView showsVerticalScrollIndicator={false}
          >

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter full name"
                placeholderTextColor="#000000"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter mobile No"
                placeholderTextColor="#000000"
                value={mobile}
                onChangeText={setMobile}
                maxLength={10}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Date of Birth (DD/MM/YYYY)"
                placeholderTextColor="#000000"
                value={dob}
                onChangeText={setDob}
                onTouchStart={() => setShowDatePicker(true)}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
minimumDate={new Date(1900, 0, 1)}
                />
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Email"
                placeholderTextColor="#000000"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={[styles.inputContainer,]}
              onStartShouldSetResponder={() => true}
              onResponderRelease={() => setOpenState(!openState)}
            >
              <Text style={[styles.input, {
                flex: 1,
                // alignSelf: 'center',
                height: 40,
                paddingTop: 10,
                paddingBottom: 10,
              }]}>
                {state ?
                  state.label
                  : "Select state"}
              </Text>


            </View>
            {openState ?
              <ScrollView>
                {itemsState.length === 0 ? (
                  <Text>No items available</Text>
                ) : (
                  itemsState.map((item) => (
                    <View key={item.value} style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}
                      onStartShouldSetResponder={() => true}
                      onResponderRelease={() => {
                        setState(item);
                        setOpenState(false);
                      }}
                    >
                      <Text style={{
                        fontSize: 18, color: 'black'
                      }}>{item.label}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              : null}

            <View style={[styles.inputContainer,]}
              onStartShouldSetResponder={() => true}
              onResponderRelease={() => setOpenCity(!openCity)}
            >
              <Text style={[styles.input, {
                flex: 1,
                // alignSelf: 'center',
                height: 40,
                paddingTop: 10,
                paddingBottom: 10,
              }]}>
                {city ?
                  city.label
                  : "Select City"}
              </Text>
            </View>
            {openCity ?
              <ScrollView>
                {itemsCity.length === 0 ? (
                  <Text style={{ color: 'black' }}>select state</Text>
                ) : (
                  itemsCity.map((item) => (
                    <View key={item.value} style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}
                      onStartShouldSetResponder={() => true}
                      onResponderRelease={() => {
                        setCity(item);
                        setOpenCity(false);
                      }}
                    >
                      <Text style={{
                        fontSize: 18, color: 'black'
                      }}>{item.label}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              : null}

            <View style={[styles.inputContainer,]}
              onStartShouldSetResponder={() => true}
              onResponderRelease={() => setOpenBlock(!openBlock)}
            >
              <Text style={[styles.input, {
                flex: 1,
                // alignSelf: 'center',
                height: 40,
                paddingTop: 10,
                paddingBottom: 10,
              }]}>
                {block ?
                  block.label
                  : "Select block"}
              </Text>
            </View>
            {openBlock ?
              <ScrollView>
                {itemsBlock.length === 0 ? (
                  <Text style={{ color: 'black' }} >select city</Text>
                ) : (
                  itemsBlock.map((item) => (
                    <View key={item.value} style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}
                      onStartShouldSetResponder={() => true}
                      onResponderRelease={() => {
                        setBlock(item);
                        setOpenBlock(false);
                      }}
                    >
                      <Text style={{
                        fontSize: 18, color: 'black'
                      }}>{item.label}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              : null}

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Post Office"
                placeholderTextColor="#000000"
                value={postOffice}
                onChangeText={setPostOffice}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Village"
                placeholderTextColor="#000000"
                value={village}
                onChangeText={setVillage}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Pincode"
                placeholderTextColor="#000000"
                value={pincode}
                onChangeText={setPincode}
                maxLength={6}
                keyboardType="numeric"
              />
            </View>


          </ScrollView>


          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <TouchableOpacity style={styles.login_buton} title="Login" onPress={
            // () => { }
            handlesubmit
          } >
            <Text style={{
              fontSize: 20, fontFamily: 'BAUHS93', fontWeight: 'bold', color: '#FFFFFF'
            }}>Register</Text>
          </TouchableOpacity>



        </View>
      </View>
    </ImageBackground>
  );
}

export default Register


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
    height: '80%'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFCB0A',
  },
  inputContainer: {
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


