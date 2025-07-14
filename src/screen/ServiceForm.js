// ✅ Cleaned and Secure Version of ServiceForm.js

import React from 'react';
import { BackHandler, Dimensions, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Type1 from '../ServiceForm/Type1';
import Type1_1 from '../ServiceForm/Type1_1';
import Type2 from '../ServiceForm/Type2';
import Type3 from '../ServiceForm/Type3';
import Type4 from '../ServiceForm/Type4';
import Type5 from '../ServiceForm/Type5';
import Type6 from '../ServiceForm/Type6';
import Type7 from '../ServiceForm/Type7';
import Type8 from '../ServiceForm/Type8';
import Type9 from '../ServiceForm/Type9'; // ✅ NEW for PAN Find

const { width, height } = Dimensions.get('window');

const uploadURLs = {
  REPAN: 'pancard',
  REIN: 'insurance',
  REITR: 'income_tax',
  REGST: 'gst',
  REFSSAI: 'fssai',
  RETL: 'tl',
  REMSME: 'MSME',
  RETM: 'trademark',
  REPTAX: 'ptax',
  REPF: 'pf',
  REPANS: 'surrander',
  REPAS: 'passport',
  REAPLINK: 'link',
  REPLC: 'pvt_ltd',
  REDL: 'driving_license',
  REPCF: 'pan_find'
};

const ServiceForm = ({ route, navigation }) => {
  const { service_data, app_icon } = route.params;
  const { form_service_code, form_sub_service_id } = service_data;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('main');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const baseUrl = 'https://righten.in/api/services';
  const setFileUrls = (key) => {
    service_data.fileUploadURl = `${baseUrl}/${key}/upload`;
    service_data.fileReUploadURl = `${baseUrl}/${key}/reupload`;
    return `${baseUrl}/${key}/save`;
  };

  const commonProps = {
    service_data,
    label: `${service_data.name} @ ${service_data.offer_price}`,
    form_service_code: service_data.form_service_code,
    form_service_id: service_data.form_service_id,
    form_sub_service_id: service_data.form_sub_service_id,
    app_icon: service_data.app_icon,
    navigation
  };

  // 🧠 Special cases
  if (form_service_code === 'REPAN' && ['3', '5', '27', '28', '38'].includes(form_sub_service_id)) {
    const formSubmitUrl = setFileUrls('pancard');
    return <Type1 {...commonProps} formSubmitUrl={formSubmitUrl} cardtype="Pan" />;
  }

  if (form_service_code === 'REPAN' && form_sub_service_id === '4') {
    const formSubmitUrl = setFileUrls('pancard');
    return <Type1_1 {...commonProps} formSubmitUrl={formSubmitUrl} cardtype="Pan" />;
  }

  if (form_service_code === 'REPRD') {
    return <Type7 {...commonProps} formSubmitUrl={`${baseUrl}/product/save`} cardtype="Product" />;
  }

  if (form_service_code === 'REPCF') {
    // ✅ PAN Find: Send to Type9 instead of Type3
    return (
      <Type9
        {...commonProps}
        formSubmitUrl='https://righten.in/api/app/pan_find'
        cardtype="Pan Find"
      />
    );
  }

  // ✅ Handle all other mapped types
  if (uploadURLs[form_service_code]) {
    const urlKey = uploadURLs[form_service_code];
    const formSubmitUrl = setFileUrls(urlKey);

    const typeComponentMap = {
      REIN: Type2,
      REPAS: Type5,
      REPANS: Type4,
      REAPLINK: Type6,
      REDL: Type8,
    };

    const Component = typeComponentMap[form_service_code] || Type3;

    return <Component {...commonProps} formSubmitUrl={formSubmitUrl} cardtype={service_data.cardtype || form_service_code} />;
  }

  return null;
};

export default ServiceForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff'
  }
});
