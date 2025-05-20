import { StyleSheet, Text, View, Modal, Image, TextInput, TouchableOpacity, BackHandler, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
const { width } = Dimensions.get('window');
import { SvgXml } from 'react-native-svg';
import { mobile_svg, settingsSVG, profileSVG, reportSVG, eye, eyeoff, nameSVG, DOBSVG, datepicker, fatherNameSVG, MobileSVG, serviceSVG } from '../../assets/ALLSVG';
import Toast from 'react-native-toast-message';

const Type1_1 = ({ service_data,label, cardtype, form_service_code, form_sub_service_id, form_service_id, formSubmitUrl, navigation }) => {
    // console.log("hello");
    // console.log(form_service_code,form_sub_service_id,form_service_id);
    const [formResponse, setformResponse] = useState([]);

    const [panType, setPanType] = useState('');
    const [name, setName] = useState('');

    const [DD, setDD] = useState('');
    const [MM, setMM] = useState('');
    const [YYYY, setYYYY] = useState('');
    const [dob, setDob] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fatherName, setFatherName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    // Modal state gula
    const [modalMessage, setModalMessage] = useState('');
    const [modalTxnId, setModalTxnId] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('main');
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

    const handleDateChange = (event, date) => {
        setShowPicker(false);
        if (date) {
            const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            setDob(formattedDate);
            setSelectedDate(date);
        }
    };
    // const showSuccessToast = (txn_id) => {
    //     Toast.show({
    //         type: 'success',
    //         text1: `successfull ✅  id:${txn_id}`,
    //         text2: `Form submitted successfully !`,
    //     });
    // };
    // const showErrorToast = (txn_id) => {
    //     Toast.show({
    //         type: 'error',
    //         text1: 'Oops! 😔',
    //         text2: 'Something went wrong. Please try again.',
    //     });
    // };
    const [checked, setChecked] = useState({
        form_csf_name: false,
        form_csf_fname: false,
        form_csf_dob: false,
        form_csf_photo: false,
        form_csf_signature: false,
    });

    const handleCheckboxChange = (checkbox) => {
        setChecked(prevState => {
            const newState = { ...prevState, [checkbox]: !prevState[checkbox] };
            console.log(newState); // Log the current state of all checkboxes
            return newState;
        });
    };


    const handleSubmit = async () => {

        const user_id = await AsyncStorage.getItem('us_id');
        const dateOfBirth = dob;

        if (
            user_id &&
            form_service_id &&
            form_service_code &&
            form_sub_service_id &&
            name &&
            fatherName &&
            dateOfBirth &&
            mobileNo && mobileNo.length === 10
        ) {

                // console.log('Submitted Data:', { user_id, panType, name, dateOfBirth, fatherName, mobileNo });

                const response = await axios.post(formSubmitUrl,
                    qs.stringify({
                        user_id: user_id,
                        service_id: form_service_id,
                        service_code: form_service_code,
                        sub_service_id: form_sub_service_id,
                        name: name,
                        father_name: fatherName,
                        date_of_birth: dateOfBirth,
                        mobile: mobileNo,
                        form_csf_name: checked.form_csf_name ? 'NAME' : '',
                        form_csf_fname: checked.form_csf_fname ? 'FATHER NAME' : '',
                        form_csf_dob: checked.form_csf_dob ? 'DATE OF BIRTH' : '',
                        form_csf_photo: checked.form_csf_photo ? 'PHOTO' : '',
                        form_csf_signature: checked.form_csf_signature ? 'SIGNATURE' : '',

                    }),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );

                if (response.data.status === 'success' && response.data.form_id && response.data.data?.txn_id) {
                    setModalMessage(response.data.message);
                    setModalTxnId(response.data.data.txn_id);
                    setIsSuccessModalVisible(true);

                    // 1 সেকেন্ড পর মডাল বন্ধ করে নেভিগেট করানো হবে
                    setTimeout(() => {
                        setIsSuccessModalVisible(false);
                        navigation.navigate('ImagePicker', {
                            "form_id": response.data.form_id,
                            "txn_id": response.data.data.txn_id,
                            "service_data": service_data
                        });
                    }, 2000);

                    setformResponse(response.data.data);
                    setPanType('');
                    setName('');
                    setDob('');
                    setSelectedDate(new Date());
                    setFatherName('');
                    setMobileNo('');
                    setChecked({
                        form_csf_name: false,
                        form_csf_fname: false,
                        form_csf_dob: false,
                        form_csf_photo: false,
                        form_csf_signature: false,
                    });


                } else {
                    setModalMessage("Something went wrong. Please try again.");
                    setModalTxnId('');
                    setIsSuccessModalVisible(true);
                }

        } else {
            console.log("Form validation failed! Check missing fields.");
            Alert.alert("Enter all fields correctly!");

        }




    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>{label}</Text>
                    
                    <Text style={styles.label}>Name <Text style={{ color: 'red' }}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <SvgXml xml={nameSVG} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter Name"
                            placeholderTextColor="#666"
                        />
                    </View>
                    
                    <Text style={styles.label}>DOB (DD/MM/YYYY) <Text style={{ color: 'red' }}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <SvgXml xml={DOBSVG} style={styles.icon} />

                        {/* ম্যানুয়ালি টাইপের জন্য TextInput */}
                        <TextInput
                            style={styles.input}
                            value={dob}
                            onChangeText={(text) => {
                                // শুধুমাত্র সংখ্যা ছাড়া কিছু লিখতে দেবে না
                                let cleanedText = text.replace(/\D/g, '');

                                // Auto `/` বসানোর জন্য ফরম্যাটিং
                                if (cleanedText.length > 2 && cleanedText.length <= 4) {
                                    cleanedText = cleanedText.slice(0, 2) + '/' + cleanedText.slice(2);
                                } else if (cleanedText.length > 4) {
                                    cleanedText = cleanedText.slice(0, 2) + '/' + cleanedText.slice(2, 4) + '/' + cleanedText.slice(4, 8);
                                }

                                setDob(cleanedText);
                            }}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            maxLength={10} // 10 ক্যারেক্টারের বেশি হতে দেবে না (DD/MM/YYYY)
                        />

                        {/* ক্যালেন্ডার খুলতে বাটন */}
                        <TouchableOpacity onPress={() => setShowPicker(true)} style={{ padding: 10 }}>
                        <SvgXml xml={DOBSVG} style={styles.icon} />
                        </TouchableOpacity>
                    </View>

                    {/* ক্যালেন্ডার ওপেন হলে */}
                    {showPicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="calendar"
                            maximumDate={new Date()}
                            minimumDate={new Date(1900, 0, 1)}
                            onChange={(event, selectedDate) => {
                                setShowPicker(false);
                                if (selectedDate) {
                                    const formattedDate = selectedDate.toLocaleDateString('en-GB'); // DD/MM/YYYY ফরম্যাট
                                    setDob(formattedDate);
                                    setSelectedDate(selectedDate);
                                }
                            }}
                        />
                    )}


                    
                    <Text style={styles.label}>Father's Name <Text style={{ color: 'red' }}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <SvgXml xml={fatherNameSVG} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={fatherName}
                            onChangeText={setFatherName}
                            placeholder="Enter Father's Name"
                            placeholderTextColor="#666"
                        />
                    </View>
                    
                    <Text style={styles.label}>Mobile No <Text style={{ color: 'red' }}>*</Text></Text>
                    <View style={styles.inputContainer}>
                        <SvgXml xml={MobileSVG} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={mobileNo}
                            onChangeText={setMobileNo}
                            placeholder="Enter Mobile Number"
                            placeholderTextColor="#666"
                            maxLength={10}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        
                        <View >
                            

                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => handleCheckboxChange('form_csf_name')}
                            >
                                <View style={[styles.checkbox, checked.form_csf_name && styles.checkboxChecked]} >
                                    {checked.form_csf_name ?
                                        <SvgXml xml={`<svg width="17px" height="17px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="tick"> <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> </g> </g> </g></svg>`} />
                                        : null}
                                </View>
                                <Text style={styles.labelCheckBox}>Name</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => handleCheckboxChange('form_csf_fname')}
                            >
                                <View style={[styles.checkbox, checked.form_csf_fname && styles.checkboxChecked]} >
                                    {checked.form_csf_fname ?
                                        <SvgXml xml={`<svg width="17px" height="17px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="tick"> <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> </g> </g> </g></svg>`} />
                                        : null}
                                </View>
                                <Text style={styles.labelCheckBox}>Father's Name</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => handleCheckboxChange('form_csf_dob')}
                            >
                                <View style={[styles.checkbox, checked.form_csf_dob && styles.checkboxChecked]} >
                                    {checked.form_csf_dob ?
                                        <SvgXml xml={`<svg width="17px" height="17px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="tick"> <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> </g> </g> </g></svg>`} />
                                        : null}
                                </View>
                                <Text style={styles.labelCheckBox}>Date of Birth</Text>
                            </TouchableOpacity>

                        </View>

                        <View>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => handleCheckboxChange('form_csf_photo')}
                            >
                                <View style={[styles.checkbox, checked.form_csf_photo && styles.checkboxChecked]} >
                                    {checked.form_csf_photo ?
                                        <SvgXml xml={`<svg width="17px" height="17px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="tick"> <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> </g> </g> </g></svg>`} />
                                        : null}
                                </View>
                                <Text style={styles.labelCheckBox}>Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => handleCheckboxChange('form_csf_signature')}
                            >
                                <View style={[styles.checkbox, checked.form_csf_signature && styles.checkboxChecked]} >
                                    {checked.form_csf_signature ?
                                        <SvgXml xml={`<svg width="17px" height="17px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="tick"> <polyline fill="none" points="3.7 14.3 9.6 19 20.3 5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> </g> </g> </g></svg>`} />
                                        : null}
                                </View>
                                <Text style={styles.labelCheckBox}>Signature</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                    
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
                <Toast />
            </ScrollView>
            {/* <Modal visible={isSuccessModalVisible} animationType="fade" transparent>
                <TouchableOpacity 
                    style={styles.modalContainer} 
                    activeOpacity={1} 
                    onPress={() => setIsSuccessModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.successText}>✅ {modalMessage}</Text>
                        {modalTxnId ? <Text style={styles.txnText}>Txn ID: {modalTxnId}</Text> : null}
                        <Button title="OK" onPress={() => setIsSuccessModalVisible(false)} />
                    </View>
                </TouchableOpacity>
            </Modal> */}
            
            <Modal visible={isSuccessModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                    <Image source={require('../../assets/success.gif')} style={styles.successGif} />
                    <Text style={styles.modalMessage}>{modalMessage}</Text>
                    {modalTxnId ? <Text style={styles.modalTransactionId}>Txn ID: {modalTxnId} </Text>: null }

                    <TouchableOpacity
                        style={styles.closeButton}
                        //activeOpacity={1} 
                        onPress={() => {
                        setIsSuccessModalVisible(false);
                        }}
                    >
                        <Text style={styles.closeButtonText}>OK</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

export default Type1_1

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        padding: 10,
    },
    card: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color:'#FFCB0A',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#009743',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFCB0A',
        borderRadius: 10,
        padding: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: 'black',
    },
    dateInput: {
        flex: 1,
        paddingVertical: 10,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    dropdownList: {
        maxHeight: 150,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dropdownText: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#FFCB0A',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    checkbox: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderRadius: 5,
    },
    checkboxChecked: {
        backgroundColor: 'red',
    },
    labelCheckBox: {
        fontSize: 16,
        color: '#000',
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
        alignSelf: 'center', // Fix for centering
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
        alignSelf: 'center', // Fix for centering
        width: '100%', // Full width to maintain centering
        alignItems: 'center',
      },
      closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
});