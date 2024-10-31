import React from 'react';
import { ScrollView, Text, StyleSheet, BackHandler, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const TermsAndConditions = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Example2_2'); // Navigate back to the main screen
        return true; // Prevent the default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Terms & Conditions</Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.cart}>
          <Text style={styles.subheading}>Eligibility</Text>
          <Text style={styles.paragraph}>
            You must be of legal age and have the authority to enter into agreements to utilize our services. By using RightEn, you confirm that you meet these criteria.
          </Text>

          <Text style={styles.subheading}>Service Description</Text>
          <Text style={styles.paragraph}>
            RightEn specializes in providing general insurance solutions tailored to your specific needs. Our services include but are not limited to insurance coverage for assets, property, health, and more.
          </Text>

          <Text style={styles.subheading}>Accuracy of Information</Text>
          <Text style={styles.paragraph}>
            You are responsible for providing accurate and complete information when using our services. RightEn is not liable for any consequences resulting from incorrect or incomplete information provided by users.
          </Text>

          <Text style={styles.subheading}>Insurance Policies</Text>
          <Text style={styles.paragraph}>
            All insurance policies offered through RightEn are subject to the terms and conditions set forth by the respective insurance providers. It is your responsibility to review and understand the terms of your insurance policy before purchase.
          </Text>

          <Text style={styles.subheading}>Financial Responsibility</Text>
          <Text style={styles.paragraph}>
            You are responsible for the payment of premiums associated with your insurance policy. Failure to pay premiums may result in the termination or lapse of your coverage.
          </Text>

          <Text style={styles.subheading}>Privacy and Security</Text>
          <Text style={styles.paragraph}>
            RightEn respects your privacy and takes security measures to protect your personal information. By using our services, you consent to the collection, use, and disclosure of your information as outlined in our Privacy Policy.
          </Text>

          <Text style={styles.subheading}>Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content and materials on RightEn's website and platforms, including logos, trademarks, and text, are the property of RightEn and protected by intellectual property laws. You agree not to use or reproduce any content without prior written consent.
          </Text>

          <Text style={styles.subheading}>Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            RightEn shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, including but not limited to loss of profits, data, or goodwill.
          </Text>

          <Text style={styles.subheading}>Modification of Terms</Text>
          <Text style={styles.paragraph}>
            RightEn reserves the right to modify these terms and conditions at any time without prior notice. Continued use of our services after such modifications constitutes your acceptance of the updated terms.
          </Text>

          <Text style={styles.subheading}>Governing Law</Text>
          <Text style={styles.paragraph}>
            These terms and conditions shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any disputes arising out of or relating to these terms shall be resolved through arbitration in [Jurisdiction].
          </Text>

          <Text style={styles.paragraph}>
            By using RightEn's services, you acknowledge that you have read, understood, and agreed to these terms and conditions. If you do not agree with any part of these terms, you may not use our services.
          </Text>

          <Text style={styles.paragraph}>
            For any inquiries or concerns regarding these terms and conditions, please contact us at righten.in@gmail.com
          </Text>

          <Text style={styles.paragraph}>
            Thank you for choosing RightEn – the right place for your insurance needs.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa', // White background
  },
  scrollContainer: {
    flex: 1,
  },
  cart: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff', // Light grey background for the cart
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light grey border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5, // For Android shadow
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000', // Black text
    textAlign: 'center', // Center align the heading
  },
  subheading: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#000000', // Black text
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    color: '#000000', // Black text
  },
});

export default TermsAndConditions;
