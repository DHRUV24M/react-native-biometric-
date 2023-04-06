import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Alert, TouchableHighlight } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export default function App() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  //for face dectection or fingerprint scan 
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
  };

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess[
      {
        text: btnTxt,
        onPress: btnFunc,
      }
    ]);
  };

  const TwoButtonAlert = () =>
    Alert.alert('Wlecome To App', 'Subscribe Now', [
      {
        text: 'Back',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'Ok', onPress: () => console.log('Ok Pressed')
      },
    ]);

  const handleBiometricAuth = async () => {
    // check if the hardware supports biometric
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // fall back to default authentication method i.e password if biometric is not Available
    if (!isBiometricAvailable)
      return alertComponent(
        'please Enter Your Password',
        'Biometric Auth not Supported',
        'Ok',
        () => fallBackToDefaultAuth()
      );

    //check biometric types available (fingrtprint, facial recognition , iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

    //check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        'Biometric record not found',
        'Please Login with Password',
        'ok',
        () => fallBackToDefaultAuth()
      );

    //authenticate with biometric 
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometric',
      cancelLabel: 'cancel',
      disableDeviceFallback: true,
    });

    // Log the user in on success
    if (biometricAuth) { TwoButtonAlert() };
    console.log({ isBiometricAvailable });
    console.log({ supportedBiometrics });
    console.log({ savedBiometrics });
    console.log({ biometricAuth });

  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>
          {isBiometricSupported
            ? 'Your Device is compatible with biometrics'
            : 'Face or Fingerprint Scanner is available on this device'}
        </Text>
        <TouchableHighlight style={{
          height: 60,
          marginTop: 200
        }}
        >
          <Button
            title="Login with biometrics"
            color="black"
            onPress={handleBiometricAuth}
          />
        </TouchableHighlight>
        <StatusBar style='auto' />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
});
