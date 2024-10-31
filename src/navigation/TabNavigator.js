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
import { mobile_svg, profileSVG, historySVG, settingsSVG, price_chartSVG, reportSVG, eye, eyeoff } from '../../assets/ALLSVG';
import Type1 from '../ServiceForm/Type1';
import ImagePicker from '../screen/ImagePicker';
import paymentPage from '../screen/PaymentPage';
import PaymentPage from '../screen/PaymentPage';
import ShowDetails from '../screen/ShowDetails';
import PrivacyPolicy from '../screen/PrivacyPolicy';
import RefundPolicy from '../screen/RefundPolicy';
import TermsAndConditions from '../screen/TermsAndConditions';


const Tab = createBottomTabNavigator();

function TabNavigator() {
  function MyTabBar({ state, descriptors, navigation }) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',paddingLeft:5, backgroundColor: '#CFF7FF',width:'160%' }}>
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
              label_text_value = "price Chart";
              break;
            case 'Example2_1':
              label_text_value = "History";
              break;
            case 'Example2_2':
              label_text_value = "settings";
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
                  flex: 1, justifyContent: 'center', alignItems: "center",
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
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
          ),
        }}
      />

      <Tab.Screen name="Example1_2" component={PriceChart}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
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
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
          ),
        }}
      />
      <Tab.Screen name="Example2_1" component={History}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
          ),
        }}
      />

      <Tab.Screen name="Example2_2" component={Settings}
        options={{
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff',
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
          ),
        }}
      />

<Tab.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          tabBarButton: () => null,
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
          ),
        }}
      />


<Tab.Screen
        name="RefundPolicy"
        component={RefundPolicy}
        options={{
          tabBarButton: () => null,
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
          ),
        }}
      />


<Tab.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          tabBarButton: () => null,
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
          ),
        }}
      />




      <Tab.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          tabBarButton: () => null,
          headerTitle: '',
          headerShown: false
        }}
      />
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
          tabBarButton: () => null,
          headerStyle: { backgroundColor: '#CFF7FF' }, // Customize header color for this tab
          headerTintColor: '#fff', // Customize header text color
          headerTitleStyle: { color: 'black', fontSize: 20 },
          headerTitle: '',
          headerLeft: () => (
            <Image
              source={require('../../assets/images/vertical_righten_without_logo.png')}
              style={{ width: 150, height: 30, marginRight: 'auto', marginLeft: (screenWidth / 2) - 75 }}
            />
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