import { StyleSheet, Text, View, TextInput, TouchableOpacity, BackHandler, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
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
    const showSuccessToast = (txn_id) => {
        Toast.show({
            type: 'success',
            text1: `successfull ✅  id:${txn_id}`,
            text2: `Form submitted successfully !`,
        });
    };
    const showErrorToast = (txn_id) => {
        Toast.show({
            type: 'error',
            text1: 'Oops! 😔',
            text2: 'Something went wrong. Please try again.',
        });
    };
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
                    form_csf_name: checked.form_csf_name ? 'name' : '',
                    form_csf_fname: checked.form_csf_fname ? 'father_name' : '',
                    form_csf_dob: checked.form_csf_dob ? 'dob' : '',
                    form_csf_photo: checked.form_csf_photo ? 'photo' : '',
                    form_csf_signature: checked.form_csf_signature ? 'signature' : '',

                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.data.status === 'success') {
                setformResponse(response.data.data);
                showSuccessToast(response.data.data.txn_id);
                setPanType('');
                setName('');
                setDD('');
                setMM('');
                setYYYY('');
                setDob('');
                setShowPicker(false);
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

                navigation.navigate('ImagePicker', {
                    "form_id": response.data.form_id,
                    "txn_id": response.data.data.txn_id,
                    "service_data": service_data
                });


            } else {
                showErrorToast();
            }
            // console.log(response.data.status === 'success');
        } else {
            Alert.alert("Enter all field");

        }




    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust offset if needed
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>{cardtype} Type <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={serviceSVG} />
                    </View>
                    <Text style={[styles.input, { fontSize: 24, fontWeight: 'bold', fontFamily: 'BAUHS93', height: 'auto' }]}>{label}</Text>

                </View>
                <Toast />


                <Text style={styles.label}>Name <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={nameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter Name"
                        placeholderTextColor="black"

                    />
                </View>

                <Text style={styles.label}>DOB (DD/MM/YYYY) <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={DOBSVG} />
                    </View>
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flex: 1 }}>
                        <TextInput
                            style={[styles.input, { width: '100%' }]}
                            value={dob}
                            placeholder="Select Date of Birth"
                            placeholderTextColor="black"
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="spinner" // Use "spinner" for better UX on mobile
                            maximumDate={new Date()}
minimumDate={new Date(1900, 0, 1)}
                            onChange={handleDateChange}
                        />
                    )}

                </View>

                <Text style={styles.label}>Father's Name <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={fatherNameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={fatherName}
                        onChangeText={setFatherName}
                        placeholder="Enter Father's Name"
                        placeholderTextColor="black"
                    />
                </View>

                <Text style={styles.label}>Mobile no <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={MobileSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={mobileNo}
                        onChangeText={setMobileNo}
                        placeholder="Enter Mobile Number"
                        placeholderTextColor="black"
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Type1_1

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 8,
    },
    checkboxChecked: {
        // backgroundColor: 'blue',
    },
    label: {
        color: 'black',
        fontSize: 20,
        margin: 10,
        marginBottom: 8,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    labelCheckBox: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',

    },

    input_view: {
        borderColor: '#ccc',
        borderWidth: 2,
        borderRadius: 10,
        // alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15,
    },
    svg_box: {
        borderColor: '#ccc',
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: '#d2d2d2',
        justifyContent: 'center',
        alignItems: 'center'

    },

    input: {
        height: 40,
        width: '80%',
        alignItems: 'center',
        paddingHorizontal: 10,
        fontSize: 18,
        color: 'black',
        fontFamily: 'BAUHS93',
        borderColor: '#ccc',
        // backgroundColor:'red'
    },
    button: {
        backgroundColor: '#FFCB0A',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,

    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
});