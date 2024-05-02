import {StyleSheet, View, Text, Pressable} from 'react-native';
import React from "react";
import {Feather} from "@expo/vector-icons";
import {Link} from "expo-router";
import {useAuth} from "@/src/providers/AuthProvider";

const ExpenseItem = ({expense}) => {
  const {profile} = useAuth();
  const memberId = profile?.members?.find(mb => mb.group_id == expense.group_id).id | null;
  const impact = 0;
  if (memberId) {
    const impact = expense.balances?.find(bl => bl.owner == memberId)?.amount | 0;
  }
  return (
    <Link href={`/(tabs)/group/${expense.group_id}/expense/${expense.id}/details`} asChild>
      <Pressable style={styles.expenseItem}>
        <View style={styles.expenseCatIcon}>
          <Feather name={'shopping-cart'} source={require('@/assets/images/logo.png')} style={styles.icon}/>
        </View>
        <View>
          <Text style={{fontSize: 18, fontWeight: '600'}}>{expense.title}</Text>
          <Text style={{fontSize: 14, fontWeight: '300'}}>Total €{expense.amount}</Text>
        </View>
        <Text style={styles.balanceEffect}>
          + €{impact}
        </Text>
      </Pressable>
    </Link>
  );
};

export default ExpenseItem;

const styles = StyleSheet.create({
  container: {},
  expenseItem: {
    backgroundColor: 'white',
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 15,
  },
  expenseCatIcon: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    borderRadius: 15,
    backgroundColor: "orange",
    padding: 5,
  },
  icon: {
    fontSize: 25,
  },
  balanceEffect: {
    color: "green",
    fontSize: 16,
    fontWeight: "500",
    position: "absolute",
    right: 20,
    alignSelf: "center",
  },
});
