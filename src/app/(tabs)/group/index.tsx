import {View, StyleSheet, SectionList} from 'react-native';
import GroupItem from "@/src/components/GroupItem";
import React, {useState} from "react";
import CreateGroupModal from "@/src/modals/CreateGroup";
import CustomHeader from "@/src/components/CustomHeader";
import {useGroupList} from "@/src/api/groups";
import {Text, ActivityIndicator} from "react-native-paper";
import {Hidden} from "@/src/utils/helpers";
import {useAuth} from "@/src/providers/AuthProvider";
import {useGroupInvitations} from "@/src/api/profiles";

const GroupScreen = ({}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [anchoredGroups, setAnchoredGroups] = useState([]);

  const {data: groups, error, isLoading} = useGroupList();
  const {session} = useAuth();
  const {data: groupInvitations, error: error2, isLoading: isLoading2} = useGroupInvitations(session?.user.id);

  if (isLoading || isLoading2) {
    return <ActivityIndicator/>;
  }

  if (error || error2) {
    return <Text variant={'displayLarge'}>Failed to fetch data</Text>;
  }

  function handleSearch() {
    console.log('searching');
  }

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleAnchor = (group, anchored) => {
    group.anchored = anchored;
    // Update anchored groups state
    if (anchored) {
      setAnchoredGroups([...anchoredGroups, group]);
    } else {
      setAnchoredGroups(anchoredGroups.filter(g => g.id !== group.id));
    }
  };

  // Define sections for SectionList
  const sections = [];
  if (anchoredGroups.length > 0) {
    sections.push({title: "Quick Access", data: anchoredGroups});
  }
  sections.push({title: "All Groups", data: groups.filter(g => !anchoredGroups.some(ag => ag.id === g.id))});

  return (
    <View style={styles.container}>
      <CustomHeader title={'Groups'} handleSearch={handleSearch} setIsModalVisible={setIsModalVisible}/>
      <View style={styles.body}>
        <SectionList
          sections={sections}
          renderItem={({item}) => <GroupItem group={item} onAnchor={(anchored) => handleAnchor(item, anchored)}/>}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <CreateGroupModal isVisible={isModalVisible} onClose={closeModal}/>
        <Hidden>Display pending group invitations</Hidden>
        <View>
          <Text variant={'labelLarge'}>Pending Group Invitations</Text>
          {groupInvitations?.map((gi) => (
            <Text variant={'bodyLarge'} key={gi.id}>{gi.sender} {gi.receiver}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
  },
});

export default GroupScreen;
