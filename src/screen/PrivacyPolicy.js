import React from 'react';
import { ScrollView, Text, StyleSheet, View, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const PrivacyPolicy = () => {
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
      <Text style={styles.heading}>Our Privacy Policy</Text>
      <ScrollView style={styles.scrollView}>
        <View style={styles.cart}>
          <Text style={styles.subheading}>Information Collection:</Text>
          <Text style={styles.paragraph}>
            We collect personal information, including but not limited to your name, contact details, and demographic information, when you use our services or interact with our website.
          </Text>

          <Text style={styles.subheading}>Use of Information:</Text>
          <Text style={styles.paragraph}>
            We use the information collected to provide and improve our services, process insurance applications, communicate with you, and personalize your experience. Your information may also be used for marketing purposes, but you can opt out at any time.
          </Text>

          <Text style={styles.subheading}>Data Security:</Text>
          <Text style={styles.paragraph}>
            We employ industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
          </Text>

          <Text style={styles.subheading}>Information Sharing:</Text>
          <Text style={styles.paragraph}>
            We may share your personal information with trusted third parties, including insurance providers, service providers, and regulatory authorities, to fulfill our services or comply with legal obligations.
          </Text>

          <Text style={styles.subheading}>Cookies:</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookies through your browser settings, but disabling them may affect certain functionalities of our website.
          </Text>

          <Text style={styles.subheading}>Third-Party Links:</Text>
          <Text style={styles.paragraph}>
            Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties and encourage you to review their privacy policies.
          </Text>

          <Text style={styles.subheading}>Children's Privacy:</Text>
          <Text style={styles.paragraph}>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children, and if we become aware of such information, we will take steps to delete it promptly.
          </Text>

          <Text style={styles.subheading}>Changes to Privacy Policy:</Text>
          <Text style={styles.paragraph}>
            We reserve the right to update or modify this Privacy Policy at any time. Any changes will be effective immediately upon posting on our website. We encourage you to review this Privacy Policy periodically for updates.
          </Text>

          <Text style={styles.subheading}>Consent:</Text>
          <Text style={styles.paragraph}>
            By using RightEn's services, you consent to the collection, use, and disclosure of your personal information as described in this Privacy Policy.
          </Text>

          <Text style={styles.subheading}>Contact Us:</Text>
          <Text style={styles.paragraph}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us at righten.in@gmail.com.
          </Text>

          <Text style={styles.paragraph}>
            Thank you for entrusting RightEn – the right place for your insurance needs – with your personal information. We are dedicated to protecting your privacy and ensuring a secure and transparent experience when using our services.
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
  scrollView: {
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

export default PrivacyPolicy;
