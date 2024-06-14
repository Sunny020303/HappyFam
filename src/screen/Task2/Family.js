import React, { useState } from "react";
import { useQueryClient } from "react-query";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  HelperText,
  Icon,
  IconButton,
  TextInput,
  Portal,
  Dialog,
  Button,
  useTheme,
} from "react-native-paper";
import { Color, Theme } from "../../GlobalStyles";
import useUser from "../../hooks/UserHook/useGetUser";
import { useIsFocused } from "@react-navigation/native";
import useCreateFamily from "../../hooks/FamilyHook/useCreateFamily";
import useCreateInvitation from "../../hooks/FamilyHook/useCreateInvitation";
import useDeleteInvitation from "../../hooks/FamilyHook/useDeleteInvitation";
import useJoinFamily from "../../hooks/FamilyHook/useJoinFamily";
import useGetFamilyMemberList from "../../hooks/FamilyHook/useGetFamilyMemberList";
import useGetInvitationList from "../../hooks/FamilyHook/useGetInvitationList";
import { Padding } from "../../GlobalStyles";

export default Family = ({ family, navigation }) => {
  const isFocus = useIsFocused();
  const user = useUser();
  const queryClient = useQueryClient();
  const [addFamilyToggle, setAddFamilyToggle] = useState(false);
  const [menuFamilyToggle, setMenuFamilyToggle] = useState(false);
  const [addMemberToggle, setAddMemberToggle] = useState(false);
  const [addMemberConfirm, setAddMemberConfirm] = useState(false);
  const hideAddMemberConfirm = () => {
    setAddMemberConfirm(false);
    setEmail("");
    setRole("");
    setInitialState({ ...checkInitialState, email: true });
  };

  const [dialogToggle, setDialogToggle] = useState(false);
  var dialogTitle = "";
  var dialogInfo = "";
  var dialogIcon = "";

  const [newFamilyName, setNewFamilyName] = useState("");
  //const [userId, setUserId] = useState();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [emailError, setEmailError] = useState("");

  const [checkInitialState, setInitialState] = useState({ email: true });

  const invitationList = useGetInvitationList(user.data?.email);
  const familyList = useGetFamilyMemberList(family);

  const createFamily = useCreateFamily(user.data?.id, newFamilyName);
  if (createFamily.isSuccess) queryClient.invalidateQueries("Family");
  if (createFamily.isError) console.log(createFamily.error);

  const createInvitation = useCreateInvitation(family, email, role);
  if (createInvitation.isError) console.log(createInvitation.error);

  const handleAddMember = () => {
    setInitialState({ ...checkInitialState, email: false });
    if (validateEmail()) {
      for (const member of familyList.data)
        if (email == member.profiles?.email) {
          setEmailError("User already in the family");
          return;
        }
      createInvitation.mutate();
    }
  };

  const validateEmail = () => {
    if (!checkInitialState.email) {
      if (!email) {
        setEmailError("Enter an email");
        return false;
      }
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email,
        )
      ) {
        setEmailError("Email a valid email");
        return false;
      }
      setEmailError("");
      return true;
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <IconButton onPress={() => setAddFamilyToggle(true)} icon="plus" />

          <IconButton
            onPress={() => console.log(user.data?.id)}
            icon="account-multiple"
          />
        </View>
      ),
    });
  }, [isFocus]);

  React.useEffect(() => {
    invitationList.refetch();
  }, [user]);

  React.useEffect(() => {
    if (createInvitation.isSuccess) {
      setAddMemberToggle(false);
      setAddMemberConfirm(true);
    }
  }, [createInvitation.isSuccess]);

  navigation.setOptions({
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <IconButton
          onPress={() => console.log(user.data?.id)}
          icon="account-multiple"
        />
      </View>
    ),
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {familyList && familyList.data && familyList.data.length > 0 ? (
          <>
            {familyList.data.map((item) => (
              <MemberCard
                familyRole={
                  item.family_role && item.family_role !== ""
                    ? item.family_role
                    : item.profiles.first_name
                }
                role={item.role ? "Admin" : ""}
                image={item.profiles.avatar ?? null}
              />
            ))}
            <Card
              style={styles.cardMember}
              onPress={() => {
                setAddMemberToggle(true);
              }}
            >
              <Card.Title
                title="Add Member"
                left={() => {
                  return <Icon source="plus-circle-outline" size={70}></Icon>;
                }}
                leftStyle={{
                  height: "70px",
                  width: "70px",
                  marginTop: 15,
                  borderRadius: 10,
                  backgroundColor: "pink",
                }}
                titleStyle={{
                  height: 50,
                  paddingTop: 27,
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              />
            </Card>
          </>
        ) : invitationList &&
          invitationList.data &&
          invitationList.data.length > 0 ? (
          <>
            {invitationList.data.map((item) => (
              <InviteCard
                id={item.family?.id}
                user={user}
                name={item.family?.name ?? ""}
                expiration={`expire in ${Math.round((new Date(item.created_at) - new Date()) / (1000 * 60 * 60 * 24)) + 30} days`}
                image={item.family.image ?? null}
                role={item.role}
              />
            ))}
            <Card
              style={styles.cardMember}
              onPress={() => console.log(invitationList.data)}
            >
              <Card.Title
                title="Create a Family"
                left={() => {
                  return <Icon source="plus-circle-outline" size={70}></Icon>;
                }}
                leftStyle={{
                  height: "70px",
                  width: "70px",
                  marginTop: 15,
                  borderRadius: 10,
                  backgroundColor: "pink",
                }}
                titleStyle={{
                  height: 50,
                  paddingTop: 27,
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              />
            </Card>
          </>
        ) : (
          <>
            <Card
              style={styles.cardMember}
              onPress={() => console.log(setAddFamilyToggle(true))}
            >
              <Card.Title
                title="Create a Family"
                left={() => {
                  return <Icon source="plus-circle-outline" size={70}></Icon>;
                }}
                leftStyle={{
                  height: "70px",
                  width: "70px",
                  marginTop: 15,
                  borderRadius: 10,
                  backgroundColor: "pink",
                }}
                titleStyle={{
                  height: 50,
                  paddingTop: 27,
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              />
            </Card>
          </>
        )}

        <Portal>
          <Dialog
            visible={addFamilyToggle}
            onDismiss={() => setAddFamilyToggle(false)}
          >
            <Dialog.Icon icon="plus" size={40}></Dialog.Icon>
            <Dialog.Title alignSelf="center">Create a new family.</Dialog.Title>
            <Dialog.Content>
              <TextInput
                mode="outlined"
                label="Family's Name"
                value={newFamilyName}
                onChangeText={(newFamilyName) =>
                  setNewFamilyName(newFamilyName)
                }
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setAddFamilyToggle(false);
                  createFamily.mutate();
                }}
              >
                Create
              </Button>
              <Button onPress={() => setAddFamilyToggle(false)}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={addMemberToggle}
            onDismiss={() => setAddMemberToggle(false)}
          >
            <Dialog.Title>Invite a member</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Enter their email</Text>
              <TextInput
                style={styles.field}
                label="Email"
                mode="outlined"
                value={email}
                onChangeText={(e) => {
                  setEmail(e);
                  validateEmail();
                }}
                onBlur={() => {
                  setInitialState({ ...checkInitialState, email: false });
                  validateEmail();
                }}
                error={emailError}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.helper}>
                <HelperText type="error">{emailError}</HelperText>
              </View>
              <Text variant="bodyMedium">Enter their role</Text>
              <TextInput
                style={styles.field}
                label="Role"
                mode="outlined"
                value={role}
                onChangeText={setRole}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setAddMemberToggle(false)}>CANCEL</Button>
              <Button mode="contained" onPress={handleAddMember}>
                SEND INVITATION
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog visible={addMemberConfirm} onDismiss={hideAddMemberConfirm}>
            <Dialog.Title>Invite a member</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                An invitation has been sent. The invitation expires in 30 days.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode="contained" onPress={hideAddMemberConfirm}>
                GOT IT
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog
            visible={dialogToggle}
            onDismiss={() => setDialogToggle(false)}
          >
            <Dialog.Icon icon={dialogIcon} size={40}></Dialog.Icon>
            <Dialog.Title alignSelf="center">{dialogTitle}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{dialogInfo}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogToggle(false)}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

const InviteCard = (props) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [focus, setFocus] = useState(false);

  const [acceptToggle, setAcceptToggle] = useState(false);
  const [dismissToggle, setDismissToggle] = useState(false);

  const joinFamily = useJoinFamily(
    props.id,
    props.user.data?.id,
    props.user.data?.email,
    props.role,
  );
  if (joinFamily.isSuccess) queryClient.invalidateQueries("Family");
  if (joinFamily.isError) console.log(joinFamily.error);

  const deleteInvitation = useDeleteInvitation(
    props.id,
    props.user.data?.email,
  );
  if (deleteInvitation.isSuccess)
    queryClient.invalidateQueries("InvitationList");
  if (deleteInvitation.isError) console.log(deleteInvitation.error);

  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={() => setFocus(!focus)}>
        <Card style={styles.cardMember}>
          <Card.Title
            title={props.name}
            subtitle={props.expiration}
            left={() => {
              if (props.image && props.image !== "none")
                return <Icon source={{ uri: props.image }} size={70} />;
              else return <Icon source="account" size={70}></Icon>;
            }}
            leftStyle={{
              height: "70px",
              width: "70px",
              marginTop: 15,
              borderRadius: 10,
              backgroundColor: "pink",
            }}
            right={() => {
              return (
                focus && (
                  <>
                    <Button
                      mode="contained"
                      onPress={() => setAcceptToggle(true)}
                    >
                      Accept
                    </Button>
                    <Button
                      textColor={theme.colors.error}
                      onPress={() => {
                        setDismissToggle(true);
                      }}
                    >
                      Dismiss
                    </Button>
                  </>
                )
              );
            }}
            rightStyle={{ marginTop: 15 }}
            titleStyle={{
              height: 50,
              paddingTop: 25,
              fontSize: 30,
              fontWeight: "bold",
            }}
            subtitleStyle={{ height: 30, paddingTop: 5, fontSize: 20 }}
          />
        </Card>
      </TouchableOpacity>

      <Portal>
        <Dialog visible={acceptToggle} onDismiss={() => setAcceptToggle(false)}>
          <Dialog.Title>Join a family</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to join {props.name}?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAcceptToggle(false)}>CANCEL</Button>
            <Button
              mode="contained"
              onPress={() => {
                joinFamily.mutate();
                setAcceptToggle(false);
              }}
            >
              JOIN
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={dismissToggle}
          onDismiss={() => setDismissToggle(false)}
        >
          <Dialog.Title>Delete an invitation</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete {props.name}'s invitation? This
              cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDismissToggle(false)}>CANCEL</Button>
            <Button
              mode="contained"
              onPress={() => {
                deleteInvitation.mutate();
                setDismissToggle(false);
              }}
            >
              DELETE
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const MemberCard = (props) => {
  return (
    <Card style={styles.cardMember}>
      <Card.Title
        title={props.familyRole}
        subtitle={props.role}
        left={() => {
          if (props.image && props.image !== "none")
            return <Icon source={{ uri: props.image }} size={70} />;
          else return <Icon source="account" size={70}></Icon>;
        }}
        leftStyle={{
          height: "70px",
          width: "70px",
          marginTop: 15,
          borderRadius: 10,
          backgroundColor: "pink",
        }}
        titleStyle={{
          height: 50,
          paddingTop: 25,
          fontSize: 30,
          fontWeight: "bold",
        }}
        subtitleStyle={{ height: 30, paddingTop: 5, fontSize: 20 }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: Color.materialThemeSysLightOutlineVariant,
  },
  scrollView: {
    backgroundColor: Color.materialThemeSysLightOutlineVariant,
    width: "100%",
    height: "100%",
  },
  cardMember: {
    marginTop: 5,
    marginBottom: 0,
    height: 100,
    backgroundColor: Color.materialThemeSysLightInverseOnSurface,
    borderRadius: 0,
  },
  helper: { padding: Padding.p_9xs },
});
