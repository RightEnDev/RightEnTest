import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, BackHandler, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import qs from 'qs';
const { width, height } = Dimensions.get('window');
import { SvgXml } from 'react-native-svg';
import { mobile_svg, settingsSVG, profileSVG, reportSVG, eye, eyeoff, nameSVG, DOBSVG, datepicker, fatherNameSVG, MobileSVG } from '../../assets/ALLSVG';
import Type1 from '../ServiceForm/Type1';
import Type1_1 from '../ServiceForm/Type1_1';
import Type2 from '../ServiceForm/Type2';
import Type3 from '../ServiceForm/Type3';
import Type4 from '../ServiceForm/Type4';
import Type5 from '../ServiceForm/Type5';
import Type6 from '../ServiceForm/Type6';
import Type7 from '../ServiceForm/Type7'; // Import Type7 component
import Type8 from '../ServiceForm/Type8'; // Import Type7 component
//import ShowDetails from '../screen/ShowDetails'; // Import Type7 component


// import { useIsFocused } from '@react-navigation/native';

const ServiceForm = ({ route, navigation }) => {
    // const isFocused = useIsFocused();

    const { service_code, service_data, app_icon,offer_price } = route.params;
    // console.log("*************************************");
    // console.log(service_data);

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
    if (service_data.form_service_code === "REPAN" && (service_data.form_sub_service_id === '3' ||
        service_data.form_sub_service_id === '5' ||
        service_data.form_sub_service_id === '27' ||
        service_data.form_sub_service_id === '28' ||
         service_data.form_sub_service_id === '38'
    )) {
        service_data.fileUploadURl="https://righten.in/api/services/pancard/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/pancard/reupload"

        return (

            <Type1
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/pancard/save"
                cardtype="Pan"
            />

        )
    }
    if (service_data.form_service_code === "REPAN" && service_data.form_sub_service_id === '4' ) {
        service_data.fileUploadURl="https://righten.in/api/services/pancard/upload"

        return (
   
            <Type1_1
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/pancard/save"
                cardtype="Pan"
            />

        )
    }
    if (service_data.form_service_code === "REIN" ) {
        service_data.fileUploadURl="https://righten.in/api/services/insurance/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/insurance/reupload"
        return (
            <Type2
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/insurance/save"
                cardtype="Insurance"
                
            />
        )
    }
    if (service_data.form_service_code === "REITR" ) {
        service_data.fileUploadURl="https://righten.in/api/services/income_tax/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/income_tax/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/income_tax/save"
                cardtype="ITR"
                
            />
        )
    }
    if (service_data.form_service_code === "REGST" ) {
        service_data.fileUploadURl="https://righten.in/api/services/gst/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/gst/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/gst/save"
                cardtype="GST"
                
            />
        )
    }
    if (service_data.form_service_code === "REFSSAI" ) {
        service_data.fileUploadURl="https://righten.in/api/services/fssai/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/fssai/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/fssai/save"
                cardtype="FSSAI"
                
            />
        )
    }

    if (service_data.form_service_code === "RETL" ) {
        service_data.fileUploadURl="https://righten.in/api/services/tl/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/tl/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/tl/save"
                cardtype="Trade License"
                
            />
        )
    }

    if (service_data.form_service_code === "REMSME" ) {
        service_data.fileUploadURl="https://righten.in/api/services/MSME/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/MSME/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/MSME/save"
                cardtype="MSME"
                
            />
        )
    }

    if (service_data.form_service_code === "RETM" ) {
        service_data.fileUploadURl="https://righten.in/api/services/trademark/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/trademark/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/trademark/save"
                cardtype="Trade Mark"
                
            />
        )
    }

    if (service_data.form_service_code === "REPTAX" ) {
        service_data.fileUploadURl="https://righten.in/api/services/ptax/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/ptax/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/ptax/save"
                cardtype="P-Tax"
                
            />
        )
    }
    if (service_data.form_service_code === "REPF" ) {
        service_data.fileUploadURl="https://righten.in/api/services/pf/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/pf/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/pf/save"
                cardtype="PF"
                
            />
        )
    }
    
    if (service_data.form_service_code === "REPANS" ) {
        service_data.fileUploadURl="https://righten.in/api/services/surrander/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/surrander/reupload"
        return (
            <Type4
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/surrander/save"
                cardtype="SURRANDER"
                
            />
        )
    }

    if (service_data.form_service_code === "REPAS" ) {
        service_data.fileUploadURl="https://righten.in/api/services/passport/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/passport/reupload"
        return (
            <Type5
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/passport/save"
                cardtype="Passport"
                
            />
        )
    }
    if (service_data.form_service_code === "REAPLINK" ) {
        service_data.fileUploadURl="https://righten.in/api/services/link/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/link/reupload"
        return (
            <Type6
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/link/save"
                cardtype="Aadhaar PAN Link"
                
            />
        )
    }
    if (service_data.form_service_code === "REPRD") {
        // service_data.fileUploadURl = "https://righten.in/api/services/product/upload";
        return (
            <Type7
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/product/save"
                cardtype="Product"
            />
        );
    }
    if (service_data.form_service_code === "REPLC" ) {
        service_data.fileUploadURl="https://righten.in/api/services/pvt_ltd/upload"
        service_data.fileReUploadURl="https://righten.in/api/services/pvt_ltd/reupload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/pvt_ltd/save"
                cardtype="Private Limited"
                
            />
        )
    }

    if (service_data.form_service_code === "REDL" ) {
        service_data.fileUploadURl="https://righten.in/api/services/driving_license/upload"
        return (
            <Type8
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/driving_license/save"
                cardtype="Driving License"
                
            />
        )
    }

    if (service_data.form_service_code === "REPCF" ) {
        service_data.fileUploadURl="https://righten.in/api/services/pan_find/upload"
        return (
            <Type3
                service_data={service_data}
                label={`${service_data.name} @ ${service_data.offer_price}`}
                form_service_code={service_data.form_service_code}
                form_service_id={service_data.form_service_id}
                form_sub_service_id={service_data.form_sub_service_id}
                navigation={navigation}
                formSubmitUrl="https://righten.in/api/services/pan_find/save"
                cardtype="Pan Find"
                
            />
        )
    }

    
    return (
       null
    );


};

export default ServiceForm;

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
