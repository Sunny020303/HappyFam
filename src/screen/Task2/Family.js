import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "../../lib/supabase";
import {
  Alert,
  Keyboard,
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  ActivityIndicator,
  Card,
  HelperText,
  Icon,
  IconButton,
  Switch,
  TextInput,
  Portal,
  Dialog,
  Button,
  useTheme,
} from "react-native-paper";
import useUser from "../../hooks/UserHook/useGetUser";
import useCreateFamily from "../../hooks/FamilyHook/useCreateFamily";
import useCreateInvitation from "../../hooks/FamilyHook/useCreateInvitation";
import useDeleteInvitation from "../../hooks/FamilyHook/useDeleteInvitation";
import useJoinFamily from "../../hooks/FamilyHook/useJoinFamily";
import useGetFamilyMemberList from "../../hooks/FamilyHook/useGetFamilyMemberList";
import useGetInvitationList from "../../hooks/FamilyHook/useGetInvitationList";
import useGetFamily from "../../hooks/FamilyHook/useGetFamily";
import useUpdateFamilyImage from "../../hooks/FamilyHook/useUpdateFamilyImage";
import useUpdateFamilyName from "../../hooks/FamilyHook/useUpdateFamilyName";
import useDeleteFamily from "../../hooks/FamilyHook/useDeleteFamily";
import useUpdateMemberRole from "../../hooks/FamilyHook/useUpdateMemberRole";
import useUpdateMemberFamilyRole from "../../hooks/FamilyHook/useUpdateMemberFamilyRole";
import useDeleteMember from "../../hooks/FamilyHook/useDeleteMember";
import * as ImagePicker from "expo-image-picker";
import ReactFamilyTree from "react-family-tree";
import { Color, FontSize, Padding, StyleVariable } from "../../GlobalStyles";

const Stack = createNativeStackNavigator();

export default Family = ({ family, role, navigation, route }) => {
  const theme = useTheme();
  const [roleToggle, setRoleToggle] = useState(false);
  const [manageMember, setManageMember] = useState(false);
  const familyList = useGetFamilyMemberList(family.id_family);

  family && role
    ? navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <IconButton
              onPress={() => {
                setManageMember(false);
                setRoleToggle(!roleToggle);
              }}
              mode={roleToggle ? "contained" : "elevated"}
              icon="crown-outline"
              style={{ padding: 0, margin: 0 }}
            />
            <IconButton
              onPress={() => {
                setRoleToggle(false);
                setManageMember(!manageMember);
              }}
              mode={manageMember ? "contained" : "elevated"}
              icon="minus-circle-outline"
              style={{ padding: 0, margin: 0 }}
            />
            <IconButton
              onPress={() => navigation.navigate("Family Tree")}
              icon="family-tree"
              style={{ padding: 0, margin: 0 }}
            />
            <IconButton
              onPress={() => navigation.navigate("Family Settings")}
              icon="cog-outline"
              style={{ padding: 0, margin: 0 }}
            />
          </View>
        ),
      })
    : null;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Family Members"
        options={({ navigation, route }) => ({
          headerShown: false,
        })}
      >
        {(props) => (
          <FamilyMembers
            {...props}
            family={family}
            roleToggle={roleToggle}
            manageMemberToggle={manageMember}
            familyList={familyList}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Family Tree"
        options={({ navigation, route }) => ({
          headerStyle: { backgroundColor: theme.colors.primaryContainer },
          unmountOnBlur: true,
        })}
      >
        {(props) => (
          <FamilyTree {...props} family={family} familyList={familyList} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Family Settings"
        options={({ navigation, route }) => ({
          headerStyle: { backgroundColor: theme.colors.primaryContainer },
          unmountOnBlur: true,
        })}
      >
        {(props) => <FamilySettings {...props} family={family} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export const FamilyMembers = ({
  family,
  familyList,
  roleToggle,
  manageMemberToggle,
  navigation,
  route,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const user = useUser();
  const queryClient = useQueryClient();
  const [addFamilyToggle, setAddFamilyToggle] = useState(false);
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

  const createFamily = useCreateFamily(user.data?.id, newFamilyName);
  if (createFamily.isSuccess) queryClient.invalidateQueries("Family");
  if (createFamily.isError) console.log(createFamily.error);

  const createInvitation = useCreateInvitation(family.id_family, email, role);
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
    invitationList.refetch();
  }, [user]);

  React.useEffect(() => {
    if (createInvitation.isSuccess) {
      setAddMemberToggle(false);
      setAddMemberConfirm(true);
    }
  }, [createInvitation.isSuccess]);
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {familyList && familyList.data && familyList.data.length > 0 ? (
          <>
            {familyList.data.map((item) => (
              <MemberCard
                familyId={item.id_family}
                memberId={item.id_member}
                title={
                  item.family_role && item.family_role !== ""
                    ? item.family_role
                    : item.first_name
                }
                role={item.role}
                image={item.profiles.avatar}
                roleToggle={roleToggle}
                manageMemberToggle={manageMemberToggle}
              />
            ))}
            <Card
              style={styles.cardMember}
              onPress={() => setAddMemberToggle(true)}
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
                image={item.family.image}
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
                  setInitialState({
                    ...checkInitialState,
                    email: false,
                  });
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

const FamilySettings = ({ family, navigation, route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const queryClient = useQueryClient();
  const user = useUser();
  const GetFamily = useGetFamily(family.id_family);
  if (GetFamily.isError) console.log(GetFamily.error);
  const DeleteFamily = useDeleteFamily(family.id_family);

  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [nameChanged, setNameChanged] = useState(false);
  const [familyRole, setFamilyRole] = useState(family.family_role);
  const [roleChanged, setRoleChanged] = useState(false);
  const [initialImage, setInitialImage] = useState(true);
  const [initial, setInitial] = useState(true);

  const updateFamilyImage = useUpdateFamilyImage(family.id_family, imageUrl);
  if (updateFamilyImage.isError) {
    setLoading(false);
    Alert.alert(updateFamilyImage.error.message);
  }
  const updateFamilyName = useUpdateFamilyName(family.id_family, name);
  if (updateFamilyName.isError) {
    setLoading(false);
    Alert.alert(updateFamilyName.error.message);
  }
  const updateFamilyRole = useUpdateMemberFamilyRole(user.data?.id, familyRole);
  if (updateFamilyRole.isError) {
    setLoading(false);
    Alert.alert(updateFamilyRole.error.message);
  }

  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [deleteFamilyToggle, setDeleteFamilyToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loginErrors, setLoginErrors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkInitialState, setInitialState] = useState({
    email: true,
    password: true,
  });

  const uploadImage = async () => {
    const arraybuffer = await fetch(image).then((res) => res.arrayBuffer());
    const { error } = await supabase.storage
      .from("activityPics")
      .upload(`public/Family-${family.id_family}.jpg`, arraybuffer, {
        upsert: true,
        contentType: "image/jpeg",
      });
    if (error) {
      Alert.alert("Upload image error", error.message);
      setLoading(false);
      return;
    }
    setImageUrl(
      `https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/Family-${family.id_family}.jpg`,
    );
  };

  const pickImage = async () => {
    hideDialog();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setInitialImage(false);
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    hideDialog();
    await requestPermission();
    if (!permission) return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setInitialImage(false);
      setImage(result.assets[0].uri);
    }
  };

  const deleteImage = () => {
    hideDialog();
    Alert.alert(
      "Delete Family Image",
      "Are you sure you want to delete the family image?",
      [
        {
          text: "CANCEL",
        },
        {
          text: "DELETE",
          onPress: async () => {
            const { error } = await supabase.storage
              .from("activityPics")
              .remove(`public/Family-${family.id_family}.jpg`);

            if (error) Alert.alert("Error deleting image", error.message);
            setImage(null);
            setImageUrl(null);
            updateFamilyImage.mutate();
          },
        },
      ],
    );
  };

  async function handleDeleteFamily() {
    setLoading(true);
    setInitialState({ email: false, password: false });
    await signInWithEmail();
  }

  async function signInWithEmail() {
    if (!validateLogin()) {
      setLoading(false);
      return false;
    }
    if (email !== user.data?.email) {
      setLoading(false);
      Alert.alert("Error", "Your credentials are not valid");
      return false;
    }

    const { data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (data?.user?.id) {
      DeleteFamily.mutate();
      Alert.alert("Delete Success", "Family successfully deleted");
      deleteFamilyToggle(false);
      queryClient.invalidateQueries("Family");
    } else {
      Alert.alert(
        "Error",
        "Your credentials are not valid. For safety concerns, you need to re-log",
      );
      const { logouterror } = await supabase.auth.signOut();
      if (logouterror) Alert.alert("Log out error", logouterror.message);
    }

    setLoading(false);
    return !error;
  }

  const validateLogin = () => {
    let errors = {};

    if (!checkInitialState.email) {
      if (!email) errors.email = "Enter an email";
      else if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email,
        )
      )
        errors.email = "Email a valid email";
    }

    if (!checkInitialState.password) {
      if (!password) errors.password = "Enter a password";
    }

    setLoginErrors(errors);
    return (
      !checkInitialState.email &&
      !checkInitialState.password &&
      Object.keys(errors).length === 0
    );
  };

  React.useEffect(() => {
    if (initial && GetFamily.isSuccess && GetFamily.data) {
      setInitial(false);
      setImage(`${GetFamily.data.image}?${Date.now()}`);
      setName(GetFamily.data.name);
    }
    setLoading(false);
  }, [GetFamily.isSuccess]);

  React.useEffect(() => {
    if (image && !initialImage) {
      setInitialImage(true);
      setLoading(true);
      uploadImage();
    }
  }, [image]);

  React.useEffect(() => {
    if (imageUrl) updateFamilyImage.mutate();
  }, [imageUrl]);

  React.useEffect(() => {
    if (updateFamilyName.isSuccess) queryClient.invalidateQueries("Family");
    if (updateFamilyImage.isSuccess || updateFamilyName.isSuccess) {
      GetFamily.refetch();
      setLoading(false);
    }
  }, [updateFamilyImage.isSuccess, updateFamilyName.isSuccess]);

  React.useEffect(() => {
    if (updateFamilyRole.isSuccess) {
      GetFamily.refetch();
      queryClient.invalidateQueries("FamilyMemberList");
      queryClient.invalidateQueries("Family");
      setLoading(false);
    }
  }, [updateFamilyRole.isSuccess]);

  // When the keyboard is hidden, dismiss it instead
  React.useEffect(() => {
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      Keyboard.dismiss();
    });

    return () => hideSubscription.remove();
  }, []);

  // Hide Drawer header when on Family Settings
  React.useLayoutEffect(() => {
    if (!navigation || !route) return;

    // Get parent by id
    const drawerNavigator = navigation.getParent("Drawer");

    if (drawerNavigator) {
      if (route.name === "Family Settings") {
        drawerNavigator.setOptions({
          headerShown: false,
        });
      }
    }

    // Turn header back on when unmount
    return drawerNavigator
      ? () =>
          drawerNavigator.setOptions({
            headerShown: true,
          })
      : undefined;
  }, [navigation, route]);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {image && image !== "none" ? (
          <View>
            <View>
              <ActivityIndicator
                animating={true}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  margin: "auto",
                }}
              />
              <Image
                source={{ uri: image }}
                style={{ marginBottom: 20, width: 250, height: 250, zIndex: 1 }}
              />
            </View>
            <Button
              icon="plus"
              mode="outlined"
              onPress={showDialog}
              style={{ marginBottom: 40 }}
            >
              UPDATE PHOTO
            </Button>
          </View>
        ) : (
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                width: 250,
                backgroundColor: Color.materialThemeSysLightSurfaceDim,
              }}
            >
              <Icon source="account-multiple" size={250} />
            </View>
            <Button
              icon="plus"
              mode="outlined"
              onPress={showDialog}
              style={{ marginVertical: 20 }}
            >
              ADD A PHOTO
            </Button>
          </View>
        )}
        <TextInput
          mode="flat"
          variant="largeTitle"
          label="Family Name"
          placeholder="+ Add family name"
          value={name}
          onChangeText={(e) => {
            setNameChanged(true);
            setName(e);
          }}
          onBlur={() => {
            if (nameChanged) {
              setNameChanged(false);
              setLoading(true);
              updateFamilyName.mutate();
            }
          }}
          style={{
            width: 350,
            backgroundColor: "transparent",
            fontSize: FontSize.materialThemeTitleLarge_size,
          }}
        />
        <TextInput
          mode="flat"
          variant="largeTitle"
          label="Role"
          placeholder="What is your role in the family?"
          value={familyRole}
          onChangeText={(e) => {
            setRoleChanged(true);
            setFamilyRole(e);
          }}
          onBlur={() => {
            if (roleChanged) {
              setRoleChanged(false);
              setLoading(true);
              updateFamilyRole.mutate();
            }
          }}
          style={{
            width: 350,
            backgroundColor: "transparent",
            fontSize: FontSize.materialThemeTitleLarge_size,
          }}
        />
        <Button
          mode="contained"
          onPress={() => setDeleteFamilyToggle(true)}
          style={{ marginTop: 200 }}
        >
          DELETE FAMILY
        </Button>
      </ScrollView>

      <Portal>
        <Dialog
          visible={deleteFamilyToggle}
          onDismiss={() => setDeleteFamilyToggle(false)}
        >
          <Dialog.Title>Confirm deleting family</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              <Text>Deleting your family will </Text>
              <Text style={{ fontWeight: "bold" }}>
                permanently delete all data stored in the family, including
                activities and photos in the gallery. This action cannot be
                undone.
              </Text>
            </Text>
            <Text variant="bodyMedium">
              Once you submit this form, you could immediately create a new
              family or join one.
            </Text>

            <ScrollView
              style={styles.credentials}
              keyboardShouldPersistTaps="handled"
            >
              <TextInput
                style={styles.field}
                label="Email"
                mode="outlined"
                value={email}
                onChangeText={(e) => {
                  setEmail(e);
                  setInitialState({ ...checkInitialState, email: false });
                  validateLogin();
                }}
                error={loginErrors.email}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.helper}>
                <HelperText type="error">{loginErrors.email}</HelperText>
              </View>
              <TextInput
                style={styles.field}
                label="Password"
                mode="outlined"
                right={
                  <TextInput.Icon
                    icon={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
                }
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={(e) => {
                  setPassword(e);
                  setInitialState({ ...checkInitialState, password: false });
                  validateLogin();
                }}
                error={loginErrors.password}
              />
              <View style={styles.helper}>
                <HelperText type="error">{loginErrors.password}</HelperText>
              </View>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDeleteFamilyToggle(false)}
              disabled={loading}
            >
              CANCEL
            </Button>
            <Button
              uppercase
              mode="contained"
              onPress={handleDeleteFamily}
              contentStyle={styles.buttonContent}
              disabled={loading}
            >
              DELETE
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Upload family image</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              You can upload a family image to make it more personal.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={takePhoto}>Take a photo</Button>
            <Button onPress={pickImage}>Browse</Button>
            <Button onPress={deleteImage} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {loading && (
        <ActivityIndicator
          animating={true}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            margin: "auto",
            zIndex: 4,
            backgroundColor: "#0000008c",
          }}
        />
      )}
    </SafeAreaView>
  );
};

const InviteCard = (props) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const queryClient = useQueryClient();
  const [focus, setFocus] = useState(false);

  const [acceptToggle, setAcceptToggle] = useState(false);
  const [dismissToggle, setDismissToggle] = useState(false);
  const [image, setImage] = useState(
    props.image ? `${props.image}?${Date.now()}` : null,
  );

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
              if (image)
                return (
                  <View>
                    <ActivityIndicator
                      animating={true}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        margin: "auto",
                      }}
                    />
                    <Image
                      source={{ uri: image }}
                      style={{ width: 70, height: 70, zIndex: 1 }}
                    />
                  </View>
                );
              else return <Icon source="account" size={70}></Icon>;
            }}
            leftStyle={{
              height: "70px",
              width: "70px",
              marginTop: 15,
              borderRadius: 10,
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
                      onPress={() => setDismissToggle(true)}
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
  const user = useUser();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [focus, setFocus] = useState(false);
  const [image, setImage] = useState(
    props.image ? `${props.image}?${Date.now()}` : null,
  );
  const [role, setRole] = useState(props.role);
  const [isCurrentUser, setIsCurrentUser] = useState(
    props.memberId === user.data?.id,
  );
  const [dialogVisible, setDialogVisible] = useState(false);

  const UpdateMemberRole = useUpdateMemberRole(props.memberId, role);
  if (UpdateMemberRole.isError) console.log(error);
  const DeleteMember = useDeleteMember(props.familyId, props.memberId);
  if (DeleteMember.isError) console.log(error);

  React.useEffect(() => {
    UpdateMemberRole.mutate();
  }, [role]);

  React.useEffect(() => {
    if (DeleteMember.isSuccess) {
      isCurrentUser
        ? queryClient.invalidateQueries("Family")
        : queryClient.invalidateQueries("FamilyMemberList");
      setDialogVisible(false);
    }
  }, [UpdateMemberRole.isSuccess, DeleteMember.isSuccess]);

  React.useEffect(() => {
    setIsCurrentUser(props.memberId === user.data?.id);
  }, [user]);

  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={() => setFocus(!focus)}>
        <Card style={styles.cardMember}>
          <Card.Title
            title={props.title}
            subtitle={role ? "Admin" : ""}
            left={() => {
              if (image)
                return (
                  <View>
                    <ActivityIndicator
                      animating={true}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        margin: "auto",
                      }}
                    />
                    <Image
                      source={{ uri: image }}
                      style={{ height: 70, width: 70, zIndex: 1 }}
                    />
                  </View>
                );
              else return <Icon source="account" size={70}></Icon>;
            }}
            leftStyle={{
              height: "70px",
              width: "70px",
              marginTop: 15,
              borderRadius: 10,
            }}
            right={() => {
              if (props.roleToggle)
                return (
                  !isCurrentUser && (
                    <Switch value={role} onValueChange={setRole} />
                  )
                );
              if (props.manageMemberToggle)
                return (
                  <Button
                    mode="text"
                    textColor={theme.colors.error}
                    onPress={() => setDialogVisible(true)}
                  >
                    {isCurrentUser ? "LEAVE" : "REMOVE"}
                  </Button>
                );
              else if (isCurrentUser && focus)
                return (
                  <Button
                    mode="text"
                    textColor={theme.colors.error}
                    onPress={() => setDialogVisible(true)}
                  >
                    LEAVE
                  </Button>
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
        {isCurrentUser ? (
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>Leave Family</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Are you sure you want to leave the family? The family will also
                be deleted if you are the only member.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>CANCEL</Button>
              <Button
                mode="contained"
                onPress={DeleteMember.mutate}
                buttonColor={theme.colors.error}
              >
                LEAVE
              </Button>
            </Dialog.Actions>
          </Dialog>
        ) : (
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>Remove Member</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Are you sure you want to remove {props.title} from the family?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>CANCEL</Button>
              <Button
                mode="contained"
                onPress={DeleteMember.mutate}
                buttonColor={theme.colors.error}
              >
                REMOVE
              </Button>
            </Dialog.Actions>
          </Dialog>
        )}
      </Portal>
    </>
  );
};

const FamilyTree = ({ family, familyList, navigation, route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const user = useUser();

  const [nodes, setNodes] = useState(familyList.data);
  const firstNodeId = nodes[0].id_member;
  const [rootId, setRootId] = useState(firstNodeId);
  const [hoverId, setHoverId] = useState("");
  const [selectId, setSelectId] = useState("");

  const selected = React.useMemo(
    () => nodes.find((item) => item.id === selectId),
    [nodes, selectId],
  );
  const resetRootHandler = React.useCallback(
    () => setRootId(firstNodeId),
    [firstNodeId],
  );

  // When the keyboard is hidden, dismiss it instead
  React.useEffect(() => {
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      Keyboard.dismiss();
    });

    return () => hideSubscription.remove();
  }, []);

  // Hide Drawer header when on Family Settings
  React.useLayoutEffect(() => {
    if (!navigation || !route) return;

    // Get parent by id
    const drawerNavigator = navigation.getParent("Drawer");

    if (drawerNavigator) {
      if (route.name === "Family Settings") {
        drawerNavigator.setOptions({
          headerShown: false,
        });
      }
    }

    // Turn header back on when unmount
    return drawerNavigator
      ? () =>
          drawerNavigator.setOptions({
            headerShown: true,
          })
      : undefined;
  }, [navigation, route]);

  return (
    <SafeAreaView>
      <Text>Family Tree</Text>
      <ReactFamilyTree
        nodes={nodes}
        rootId={rootId}
        renderNode={(node) => (
          <FamilyNode
            key={node.id_member}
            node={node}
            isRoot={node.id_member === rootId}
            isHover={node.id === hoverId}
            onClick={setSelectId}
            onSubClick={setRootId}
          />
        )}
      />
      {rootId !== firstNodeId && (
        <Button onClick={resetRootHandler}>Reset</Button>
      )}
      {selected && (
        <NodeDetails
          node={selected}
          className={css.details}
          onSelect={setSelectId}
          onHover={setHoverId}
          onClear={() => setHoverId(undefined)}
        />
      )}
    </SafeAreaView>
  );
};

const FamilyNode = ({ node, isRoot, isHover, onClick, onSubClick }) => {
  const clickHandler = React.useCallback(
    () => onClick(node.id_member),
    [node.id_member, onClick],
  );
  const clickSubHandler = React.useCallback(
    () => onSubClick(node.id_member),
    [node.id_member, onSubClick],
  );

  return (
    <>
      <TouchableOpacity onClick={clickHandler}>
        <Text>{node.id_member}</Text>
      </TouchableOpacity>
      {node.hasSubTree && <div onClick={clickSubHandler} />}
    </>
  );
};

const NodeDetails = ({ node, onSelect, onHover, onClear }) => {
  const closeHandler = useCallback(() => props.onSelect(undefined), [props]);

  return (
    <>
      <Text>{node.id_member}</Text>
      <Button onClick={closeHandler}>&#10005;</Button>
      <Relations {...props} title="Parents" items={node.parents} />
      <Relations {...props} title="Children" items={node.children} />
      <Relations {...props} title="Siblings" items={node.siblings} />
      <Relations {...props} title="Spouses" items={node.spouses} />
    </>
  );
};

const Relations = ({ title, items, onSelect, onHover, onClear }) => {
  const selectHandler = useCallback((id) => () => onSelect(id), [onSelect]);
  const hoverHandler = useCallback((id) => () => onHover(id), [onHover]);
  const clearHandler = useCallback(() => onClear(), [onClear]);

  if (!items.length) return null;

  return (
    <>
      <Text>{title}</Text>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          onClick={selectHandler(item.id)}
          onMouseEnter={hoverHandler(item.id)}
          onMouseLeave={clearHandler}
        >
          {item.id} ({item.type})
        </TouchableOpacity>
      ))}
    </>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      backgroundColor: theme.colors.secondaryContainer,
    },
    scrollView: {
      backgroundColor: theme.colors.secondaryContainer,
      width: "100%",
      height: "100%",
    },
    cardMember: {
      marginTop: 5,
      marginBottom: 0,
      height: 100,
      backgroundColor: theme.colors.surface,
      borderRadius: 0,
    },
    helper: { padding: Padding.p_9xs },
    buttonContent: {
      paddingHorizontal: Padding.p_5xl,
      paddingVertical: Padding.p_xs,
    },
    formContent: { paddingHorizontal: Padding.p_3xs, alignItems: "center" },
    helper: { padding: Padding.p_9xs },
    field: {
      paddingVertical: Padding.p_9xs,
      backgroundColor: "transparent",
      marginTop: 8,
    },
    credentials: { marginTop: 20, alignSelf: "stretch" },
    button: {
      minWidth: StyleVariable.accessibilityMinBtnWidth,
      minHeight: StyleVariable.accessibilityMinTargetSize,
      marginTop: 20,
      alignSelf: "stretch",
    },
  });
