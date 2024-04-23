import React, {useState} from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {Text, HelperText, TextInput, Avatar, ActivityIndicator} from "react-native-paper";
import MyDropdown from "@/src/components/DropdownComponent";
import MyMultiSelect from "@/src/components/MultiSelectComponent";
import {useMemberList} from "@/src/api/members";
import * as ImagePicker from "expo-image-picker";
import {Feather} from "@expo/vector-icons";
import {useNavigation} from "expo-router";
import {useInsertExpense} from "@/src/api/expenses";
import DateTimePicker from "@react-native-community/datetimepicker";
import {getFormattedDate} from "@/src/utils/helpers";
import {currencyOptions} from "@/src/constants";
import {Dropdown} from "react-native-element-dropdown";

export default function Layout() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [payer, setPayer] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [image, setImage] = useState(null);
  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState('0');
  const navigation = useNavigation();
  const [group, setGroup] = useState(null);
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    if (event.type === "set") {
      const date = selectedDate;
      setShowDatePicker(false);
      setInputDate(date);
    } else {
      setShowDatePicker(false);
    }
  };

  const {data: members, error, isLoading} = useMemberList();
  const {mutate: insertExpense} = useInsertExpense();

  const validateData = () => {
    return true;
  };

  const handleSubmit = () => {
    if (!validateData()) {
      console.log("error");
      return;
    }

    insertExpense({
      title: title,
      description: description,
      participants: participants,
      payers: [payer],
      date: inputDate.toString(),
      amount: amount,
      currency: currency,
      group: 1, // fixme
    }, {
      onSuccess: () => {
        console.log("Successfully updated profile");
      }
    });
  };

  if (isLoading) {
    return <ActivityIndicator/>;
  }

  if (error) {
    return <Text>Failed to fetch members</Text>;
  }

  const _isTitleValid = () => {
    // return !!title;
    return true;
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          navigation.goBack();
        }}>
          <Feather style={styles.icon} name={"arrow-left"} size={24}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          handleSubmit();
        }}>
          <Text style={styles.icon}>Save</Text>
        </TouchableOpacity>
      </View>
      <Text variant="headlineLarge">New Expense</Text>
      <View style={styles.inputs}>
        <View>
          <TextInput
            label="Enter expense title"
            placeholder="Describe your expense"
            value={title}
            error={!_isTitleValid()}
            onChangeText={setTitle}
          />
          <HelperText type="error" visible={!_isTitleValid()}>
            Title cannot be empty
          </HelperText>
        </View>
        <View>
          <TextInput
            label="Enter expense description"
            placeholder="Give additional information"
            value={description}
            onChangeText={setDescription}
            multiline={true}
          />
        </View>
        <View style={{flexDirection: "row", gap: 5}}>
          <TextInput
            label="Enter amount"
            placeholder="Enter amount"
            value={amount}
            onChangeText={(text) => setAmount(Number(text))}
            keyboardType="numeric"
            style={{flex: 1}}
          />
          <Dropdown
            placeholder={'Select currency'}
            style={styles.currencyDropdown}
            data={currencyOptions}
            labelField={'label'}
            valueField={'value'}
            value={currency}
            onChange={cu => {
              setCurrency(cu);
            }}/>
          <Pressable
            onPress={() => {
              setShowDatePicker(!showDatePicker);
            }}
            style={styles.datetimeButton}
          >
            <Text variant={"labelMedium"}>{getFormattedDate(inputDate)}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              mode={"date"}
              display={"spinner"}
              value={inputDate}
              onChange={onChange}/>
          )}
        </View>
        <View style={{gap: 20}}>
          <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
            <Avatar.Image size={48} source={require('@/assets/images/blank-profile.png')}/>
            <MyDropdown selected={payer} data={members} onChange={setPayer} label={"Who paid"}/>
          </View>
          <MyMultiSelect selected={participants} members={members} onChange={setParticipants}/>
          <View style={{flexDirection: "row", gap: 15}}>
            <Text>Proof of payment: (optional)</Text>
            <Text onPress={pickImage}>Select Image </Text>
            <Avatar.Image style={{display: image ? 1 : "none"}} size={24}
                          source={require('@/assets/images/blank-profile.png')}/>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    fontWeight: "400",
  },
  datetimeButton: {
    backgroundColor: "white",
    paddingHorizontal: 2,
    borderRadius: 10,
    justifyContent: "center",
  },
  currencyLabel: {
    fontSize: 14,
    color: 'pink',
    marginBottom: 4,
    fontWeight: "500",
  },
  currencyDropdown: {
    backgroundColor: "white",
    color: 'pink',
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    width: 60,
  },
  inputs: {
    gap: 10,
  }
});
