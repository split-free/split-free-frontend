import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams, useNavigation} from "expo-router";
import {ActivityIndicator, TextInput} from "react-native-paper";
import MyDropdown from "@/src/components/DropdownComponent";
import {useMemberList} from "@/src/api/members";
import {Feather} from "@expo/vector-icons";

export default function NewTransfer() {
  const navigation = useNavigation();

  const {group_id: idString} = useLocalSearchParams();
  const groupId = parseInt(typeof idString === 'string' ? idString : idString[0]);

  const [amount, setAmount] = useState(0);
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [description, setDescription] = useState('');

  const {data: members, isError, isLoading} = useMemberList(groupId);

  if (isLoading) {
    return <ActivityIndicator/>;
  }

  if (isError) {
    return <Text>Failed to fetch data</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          navigation.goBack();
        }}>
          <Feather style={styles.icon} name={"arrow-left"} size={24}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
        }}>
          <Text style={styles.icon}>Save</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title} variant={"headlineLarge"}>Enter a transfer</Text>
      <TextInput
        label="Enter amount"
        placeholder="Enter amount"
        value={amount}
        onChangeText={(text) => setAmount(text.replace(/^0+(?!$)/, ''))}
        keyboardType="numeric"
        style={{backgroundColor: 'white'}}
      />
      <TextInput
        label="Description (optional)"
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="Enter transfer description"
        multiline={true}
        style={{backgroundColor: 'white'}}
      />
      <View style={styles.dropdownContainer}>
        <MyDropdown
          labelField="name"
          valueField="id"
          data={members}
          onChange={(person) => {
            setSender(person);
          }}
          label={"Who sent"}
          selected={1}
        />
      </View>
      <View style={styles.dropdownContainer}>
        <MyDropdown
          labelField="name"
          valueField="id"
          data={members}
          onChange={(person) => {
            setReceiver(person);
          }}
          label={"Who received"}
          selected={1}
        />
      </View>
      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.saveIcon}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  icon: {
    fontSize: 28,
    fontWeight: "400",
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    marginTop: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveIcon: {
    fontSize: 28,
    fontWeight: "400",
    width: '100%',
    textAlign: 'center',
    marginRight: 10,
    borderWidth: 1,
    padding: 10,
    borderColor: 'green',
    borderRadius: 10,
    color: 'green',
  },
  dropdownContainer: {
    height: 80,
  },
});
