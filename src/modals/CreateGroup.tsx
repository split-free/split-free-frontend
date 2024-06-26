import React, {useEffect, useState} from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  TouchableOpacity, Alert,
} from "react-native";
import {Feather} from '@expo/vector-icons';
import Participants from "@/src/modals/CreateGroupParticipants";
import {useAuth} from "@/src/providers/AuthProvider";
import {useInsertGroup} from "@/src/api/groups";
import {useProfile} from "@/src/api/profiles";
import {ActivityIndicator} from "react-native-paper";
import {useQueryClient} from "@tanstack/react-query";

const CreateGroupModal = ({isVisible, onClose}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [error, setError] = useState('');

  const {mutate: insertGroup} = useInsertGroup();

  const {setSession, session} = useAuth();
  const {data: profile, isLoading, isError} = useProfile(session?.user.id);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setMembers([profile?.full_name])
  }, [profile]);

  if (isLoading) {
    return <ActivityIndicator/>;
  }

  if (isError) {
    setSession(null);
    return <Text>Failed to fetch data</Text>;
  }

  const handleParticipantsSubmit = (members) => {
    setShowParticipantsModal(false);
    setMembers(members);
  };

  const resetFields = () => {
    setTitle('');
    setMembers([profile?.full_name])
  };

  const handleCreateGroup = async () => {
    if (!validateData()) {
      console.log('Invalid group data');
      return;
    }
    // Save group in the database
    insertGroup({
      title,
      member_names: members,
    }, {
      onSuccess: async () => {
        resetFields();
        onClose();
        await queryClient.invalidateQueries(['groups']);
      },
      onError: (error) => {
        console.error('Server error:', error);
        Alert.alert('Error', 'There was an error saving the group. Please try again.');
      },
    })
  };

  const validateData = () => {
    setError('');
    if (!title) {
      setError('Group name cannot be empty');
      return false;
    }
    return true;
  };

  const openParticipantsModal = () => {
    setShowParticipantsModal(true);
  };

  const closeParticipantsModal = () => {
    setShowParticipantsModal(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.tabBar}>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="black"/>
            </TouchableOpacity>
            <Pressable onPress={handleCreateGroup}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter Group Name"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <TouchableOpacity style={styles.addParticipants} onPress={openParticipantsModal}>
            <Text style={styles.parTitle}>Add Participants</Text>
          </TouchableOpacity>
          <Text style={{color: 'red'}}>{error}</Text>
        </View>
      </View>
      {showParticipantsModal && (
        <Participants
          isVisible={showParticipantsModal}
          onClose={closeParticipantsModal}
          onSubmit={handleParticipantsSubmit}
          members={members}
        />
      )}
    </Modal>
  );
};

export default CreateGroupModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "80%",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "white",
  },
  input: {
    width: "100%",
    height: 60,
    backgroundColor: "white",
    fontWeight: "400",
    fontSize: 22,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  parTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  done: {},
  doneText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  addParticipants: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 10,
    marginBottom: 5,
  },
});
