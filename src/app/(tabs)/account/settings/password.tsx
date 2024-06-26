import {Image, StyleSheet, View, Text, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from "react";
import {supabase} from "@/src/lib/supabase";
import {ActivityIndicator, TextInput} from "react-native-paper";
import Button from '@/src/components/Button';
import {useNavigation} from "expo-router";
import {useAuth} from "@/src/providers/AuthProvider";
import {Feather} from "@expo/vector-icons";

const Password = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);

  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const {session} = useAuth();

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&_\-{}\[\]()#^<>.,:;"'~`|\\\/]{8,}$/;
    return passwordRegex.test(password);
  };

  const passwordsMatch = () => password === confirmPassword;

  useEffect(() => {
    if (password.length > 0) {
      setPasswordError(validatePassword() ? '' : 'Password must be at least 8 characters long and contain both letters and numbers.');
    } else {
      setPasswordError('');
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length > 0) {
      setConfirmPasswordError(passwordsMatch() ? '' : 'Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  }, [confirmPassword]);

  if (loading) {
    return <ActivityIndicator/>;
  }

  async function changePassword() {
    if (!validatePassword()) {
      Alert.alert('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }
    if (passwordError || confirmPasswordError) {
      Alert.alert('Please fix the errors before proceeding.');
      return;
    }

    setLoading(true);
    // check if old password is correct
    const {error} = await supabase.auth.signInWithPassword({email: session?.user.email, password: oldPassword});
    if (error) {
      console.error('Server error:', error);
      Alert.alert('Error', 'Server error.');
    } else {
      // update new password
      const {error} = await supabase.auth.updateUser({password});
      setLoading(false);
      if (error) {
        console.error('Server error:', error);
        Alert.alert('Error', 'Server error.');
      } else {
        Alert.alert('Password is changed successfully');
        resetFields();
        navigation.goBack();
      }
    }
  }

  const resetFields = () => {
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          navigation.goBack();
        }}>
          <Feather name={"arrow-left"} size={36}/>
        </TouchableOpacity>
      </View>
      <View style={styles.inputs}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo}/>
        <Text style={styles.headLine}>Change Password</Text>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Old Password"
          style={styles.input}
          secureTextEntry={!showOldPassword}
          right={<TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={toggleOldPasswordVisibility}
          />}
          error={!!passwordError}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="New Password"
          style={styles.input}
          secureTextEntry={!showPassword}
          right={<TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={togglePasswordVisibility}
          />}
          error={!!passwordError}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
          right={<TextInput.Icon
            icon={showConfirmPassword ? "eye-off" : "eye"}
            onPress={toggleConfirmPasswordVisibility}
          />}
          error={!!confirmPasswordError}
        />
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        <Button disabled={loading} onPress={changePassword} text={loading ? "Submitting..." : "Submit"}/>
      </View>
    </View>
  );
};

export default Password;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  inputs: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 14,
    height: 45,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  logo: {
    height: 200,
    aspectRatio: 1,
    alignSelf: "center",
  },
  headLine: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 20
  },
  header: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "absolute",
    top: 60,
  },
});
