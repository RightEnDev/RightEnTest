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

const Type4 = ({ service_data, label, cardtype, form_service_code, form_sub_service_id, form_service_id, formSubmitUrl, navigation }) => {
    // console.log(cardtype);
    // console.log(form_service_code,form_sub_service_id,form_service_id);
    const [formResponse, setformResponse] = useState([]);

    const [panType, setPanType] = useState('');
    const [name, setName] = useState('');
    const [panNO, setPanNO] = useState('');
    const [surrPan, setSurrPan] = useState('');
    const [dob, setDob] = useState('');
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
            console.log(formattedDate);
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

    const handleSubmit = async () => {
        // Handle form submission here

        const user_id = await AsyncStorage.getItem('us_id');

        if (
            user_id &&
            form_service_id &&
            form_service_code &&
            form_sub_service_id &&
            name &&
            panNO && panNO.length === 10 &&
            surrPan && surrPan.length === 10 &&
            mobileNo && mobileNo.length === 10
        ) {

            // console.log('Submitted Data:', { user_id, panType, name, dateOfBirth, fatherName, mobileNo });

            const response = await axios.post(formSubmitUrl,
                qs.stringify({
                    user_id: user_id,
                    service_id: form_service_id,
                    service_code: form_service_code,
                    sub_service_id: form_sub_service_id,
                    name: name.toUpperCase(),
                    mobile: mobileNo,
                    surrander_pan:surrPan,
                    pan_no:panNO

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
                setPanNO('');
                setSurrPan('');
                setName('');
                setMobileNo('');

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
                <Text style={styles.label}>Surrander PAN No <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={nameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={surrPan}
                        onChangeText={setSurrPan}
                        placeholder="Enter Surrander PAN No"
                        placeholderTextColor="black"
                        maxLength={10}

                    />
                </View>
                <Text style={styles.label}>PAN No <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.input_view}>
                    <View style={styles.svg_box}>

                        <SvgXml xml={nameSVG} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={panNO}
                        onChangeText={setPanNO}
                        placeholder="Enter PAN No"
                        placeholderTextColor="black"
                        maxLength={10}

                    />
                </View>


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

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
            <Toast />
        </KeyboardAvoidingView>
    );
}

export default Type4

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        color: 'black',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        marginBottom: 15,

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