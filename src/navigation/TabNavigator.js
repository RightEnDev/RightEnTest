import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Example1 from '../screen/Example1';
import Example2 from '../screen/Example2';

import { TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { Image } from 'react-native';
import HomeScreen from '../screen/HomeScreen';
import DetailsScreen from '../screen/DetailsScreen';
import Profile from '../screen/Profile';
import PriceChart from '../screen/PriceChart';
import History from '../screen/History';
import Settings from '../screen/Settings';
import ServiceForm from '../screen/ServiceForm';
const screenWidth = Dimensions.get('window').width;
import { SvgXml } from 'react-native-svg';
import { mobile_svg, profileSVG, historySVG, settingsSVG, calliconSVG, price_chartSVG, reportSVG, CurveSvg, eye, eyeoff } from '../../assets/ALLSVG';
import Type1 from '../ServiceForm/Type1';
import ImagePicker from '../screen/ImagePicker';
import paymentPage from '../screen/PaymentPage';
import PaymentPage from '../screen/PaymentPage';
import ShowDetails from '../screen/ShowDetails';
import PrivacyPolicy from '../screen/PrivacyPolicy';
import RefundPolicy from '../screen/RefundPolicy';
import TermsAndConditions from '../screen/TermsAndConditions';
import { Linking } from 'react-native';
import { StyleSheet } from 'react-native';
//import Type8 from '../ServiceForm/Type8';


const Tab = createBottomTabNavigator();

const helplineNumber = "+91 8250883776";
const handleCallPress = () => {
  Linking.openURL(`tel:${helplineNumber}`);
};

function TabNavigator() {
  function MyTabBar({ state, descriptors, navigation }) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',paddingLeft:5, backgroundColor: '#CFF7FF',width:'155%' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          // let icon = route.name === 'main'
          //   ? require('../../assets/images/SERVICEICON/gst.png')
          //   : route.name === 'Example1_1'
          //     ? require('../../assets/images/SERVICEICON/passport.png')
          //     : require('../../assets/images/SERVICEICON/gst.png');
          let icon
          switch (route.name) {
            case 'main':
              icon = require('../../assets/images/logo.png')
              break;
            case 'Example1_1':
              icon = profileSVG
              break;
            case 'Example1_2':
              icon = reportSVG
              break;
            case 'Example2_1':
              icon = historySVG
              break;
            case 'Example2_2':
              icon = settingsSVG
              break;
            default:
              icon = null;
              break;
          }


          // const label_text_value = route.name === 'main'
          //   ? "Home"
          //   : route.name === 'Example1_1'
          //     ? "settings"
          //     : "notification";
          let label_text_value;

          switch (route.name) {
            case 'main':
              label_text_value = "Home";
              break;
            case 'Example1_1':
              label_text_value = "Profile";
              break;
            case 'Example1_2':
              label_text_value = "Price Chart";
              break;
            case 'Example2_1':
              label_text_value = "History";
              break;
            case 'Example2_2':
              label_text_value = "Settings";
              break;
            default:
              label_text_value = null;
              break;
          }

          // console.log(label_text_value);  // Output the label_text_value to the console

          // Apply different styles for the "home" tab
          if (route.name === 'main') {
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}
                key={index}
              >
                <View style={{ alignItems: 'center', width: '100%', marginTop: 5 }}>
                  <View style={{
                    alignItems: 'center', justifyContent: 'center', width: '100%', position: 'static',

                  }}>
                    <View style={{
                      borderWidth: 2,
                      borderRadius: 50,
                      borderColor: '#FFCB0A'
                    }}>
                      <Image
                        source={icon}
                        style={{
                          width: route.name === 'main' ? 60 : 40,
                          height: route.name === 'main' ? 60 : 40, 
                          // borderRadius: 30
                        }}
                      />
                    </View>
                  </View>
                  <Text style={{ color: '#000' }} >
                    {label_text_value}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          else if (route.name === 'Details' || route.name === 'ServiceForm' || route.name === 'Type1' || route.name === 'ImagePicker'
            || route.name === 'Paymennt' || route.name === 'ShowDetails'
          ) {
            return (null)
          }
          else {
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1, justifyContent: 'center',  alignItems: "center",
                }}
                key={index}
              >
                <View style={{
                  alignItems: 'center', justifyContent: 'center', width: '100%',
                }}>
                  <SvgXml xml={icon} />
                  <Text style={{ color: '#000' }}>
                    {label_text_value}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }


        })}
      </View>
    );
  }


  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />} initialRouteName="main">
      <Tab.Screen name="Example1_1" component={Profile}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />

      <Tab.Screen name="Example1_2" component={PriceChart}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />
      <Tab.Screen name="main" component={HomeScreen}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />
      <Tab.Screen name="Example2_1" component={History}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />

      <Tab.Screen name="Example2_2" component={Settings}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />

<Tab.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />


<Tab.Screen
        name="RefundPolicy"
        component={RefundPolicy}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />


    <Tab.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />

{/* <Tab.Screen
        name="Type8"
        component={Type8}
        options={{
          tabBarButton: () => null,
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
          ),
        }}
      /> */}


      {/* <Tab.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          tabBarButton: () => null,
          headerTitle: '',
          headerShown: false
        }}
      /> */}
      <Tab.Screen
        name="ServiceForm"
        component={ServiceForm}
        options={{
          tabBarButton: () => null,
          headerTitle: '',
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Type1"
        component={Type1}
        options={{
          tabBarButton: () => null,
          headerTitle: '',
        }}
      />
      <Tab.Screen
        name="ImagePicker"
        component={ImagePicker}
        options={{
          tabBarButton: () => null,
          headerTitle: '',
          headerShown: false
        }}
      />
      <Tab.Screen
        name="ShowDetails"
        component={ShowDetails}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitle: '',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerLeft: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 50, height: 50, marginRight: 'auto', marginLeft: (screenWidth / 4.5) - 75 }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* TouchableOpacity for Helpline Number */}
              <TouchableOpacity style={styles.noticeBanner} onPress={handleCallPress} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgXml xml={calliconSVG} width={20} height={20} style={{ marginRight: 5 }} />
                  <Text style={styles.helptext}>Helpline : </Text> 
                  <Text style={styles.noticeText}>{helplineNumber}</Text>
                </View>
              </TouchableOpacity>

            </View>
          ),
        }}
      />




      <Tab.Screen
        name="Paymennt"
        component={PaymentPage}
        options={{
          tabBarButton: () => null,
          headerTitle: '',
          headerShown: false
        }}
      />

    </Tab.Navigator>
  );
}
export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 1, // Ensure tab bar is above the curve
  },
  curve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1, // Push curve behind
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
  label: {
    color: '#000',
    fontSize: 12,
    marginTop: 2,
  },
  centerButtonContainer: {
    position: 'absolute',
    bottom: 15,
    left: '42%',
  },
  centerButton: {
    width: 70,
    height: 70,
    backgroundColor: '#FFCB0A',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  centerIcon: {
    width: 50,
    height: 50,
  },
  noticeBanner: {
    marginRight:20,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent:'center',
  },
  helptext: {
    fontSize: 18, // Slightly larger for better visibility
    fontWeight: '600', // Semi-bold for elegance
    color: '#263238', // Dark charcoal for a premium feel
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.25)', 
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    textTransform: 'uppercase',
  },
  noticeText: {
    fontSize: 20, // Slightly bigger for emphasis
    fontWeight: '800', // Extra bold for strong visibility
    color: '#FF3D00', // Bright red-orange for urgency
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(255, 61, 0, 0.5)', // Glow effect
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});