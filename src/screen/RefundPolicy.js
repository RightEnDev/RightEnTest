import React from 'react';
import { ScrollView, Text, StyleSheet, BackHandler, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const RefundPolicy = () => {
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
      <Text style={styles.heading}>Refund Policy</Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.cart}>
          <Text style={styles.paragraph}>
            At RightEn, we strive to provide exceptional service and customer satisfaction. This Refund Policy outlines our guidelines for processing refunds for our insurance services.
          </Text>

          <Text style={styles.subheading}>Eligibility for Refunds</Text>
          <Text style={styles.paragraph}>
            Refunds may be requested if a policy is canceled within a specified period after purchase, typically 15 days, and provided that no claims have been filed.
          </Text>

          <Text style={styles.subheading}>Requesting a Refund</Text>
          <Text style={styles.paragraph}>
            To request a refund, please contact our customer support team at righten.in@gmail.com within the eligibility period. Provide your policy details and the reason for the refund request.
          </Text>

          <Text style={styles.subheading}>Processing Refunds</Text>
          <Text style={styles.paragraph}>
            Once your refund request is received and approved, we will initiate the refund process. Refunds may take 7-10 business days to reflect in your account, depending on your payment method and financial institution.
          </Text>

          <Text style={styles.subheading}>Non-Refundable Services</Text>
          <Text style={styles.paragraph}>
            Certain services, including but not limited to administrative fees, may be non-refundable. Please review the terms of your policy for specific details.
          </Text>

          <Text style={styles.subheading}>Changes to the Refund Policy</Text>
          <Text style={styles.paragraph}>
            RightEn reserves the right to modify this Refund Policy at any time without prior notice. Changes will be effective immediately upon posting on our website.
          </Text>

          <Text style={styles.paragraph}>
            If you have any questions or concerns regarding our Refund Policy, please contact us at righten.in@gmail.com.
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

export default RefundPolicy;
