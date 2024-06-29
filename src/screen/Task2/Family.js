import React, { Component, useEffect, useState, useRef } from "react";
import { useQueryClient } from "react-query";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "../../lib/supabase";
import {
  Alert,
  Dimensions,
  Keyboard,
  Text,
  View,
  FlatList,
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
import { PaperSelect } from "react-native-paper-select";
import Svg, { Line } from "react-native-svg";
import { useActionSheet } from "@expo/react-native-action-sheet";

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
import useUpdateChildren from "../../hooks/FamilyHook/useUpdateChildren";
import useUpdateSpouse from "../../hooks/FamilyHook/useUpdateSpouse";
import * as ImagePicker from "expo-image-picker";
import ReactFamilyTree from "react-family-tree";
import { Color, FontSize, Padding, StyleVariable } from "../../GlobalStyles";

const Stack = createNativeStackNavigator();

export default Family = ({ family, role, navigation, route }) => {
  const theme = useTheme();
  const familyList = useGetFamilyMemberList(family.id_family);

  family && role
    ? navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <IconButton
              onPress={() => navigation.navigate("Family Settings")}
              icon="cog-outline"
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
            isAdmin={role}
            familyList={familyList}
          />
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
  isAdmin,
  navigation,
  route,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const user = useUser();
  const queryClient = useQueryClient();
  const [addFamilyToggle, setAddFamilyToggle] = useState(false);

  const [dialogToggle, setDialogToggle] = useState(false);
  var dialogTitle = "";
  var dialogInfo = "";
  var dialogIcon = "";

  const [newFamilyName, setNewFamilyName] = useState("");
  //const [userId, setUserId] = useState();

  const [familyTree, setFamilyTree] = useState([]);
  const [familyTreeWidth, setFamilyTreeWidth] = useState(0);
  const [familyTreeHeight, setFamilyTreeHeight] = useState(0);

  const invitationList = useGetInvitationList(user.data?.email);

  const createFamily = useCreateFamily(user.data?.id, newFamilyName);
  if (createFamily.isSuccess) queryClient.invalidateQueries("Family");
  if (createFamily.isError) console.log(createFamily.error);

  React.useEffect(() => {
    invitationList.refetch();
  }, [user]);

  React.useEffect(() => {
    if (familyList && familyList.data && familyList.data.length > 0) {
      const modifyFamilyData = (familyData, isSpouse) => {
        const modifiedData = { ...familyData };
        if (familyData.profiles) {
          modifiedData.name =
            familyData.family_role ??
            `${familyData.profiles.first_name} ${familyData.profiles.last_name}`;
          modifiedData.avatar = familyData.profiles.avatar;
        }
        if (isSpouse) modifiedData.spouse = null;
        else if (familyData.spouse) {
          const spouseItem = familyList.data.find(
            (item) => item.id_member === familyData.spouse,
          );
          modifiedData.spouse = modifyFamilyData(spouseItem, true);
        }
        if (familyData.children && familyData.children.length > 0) {
          modifiedData.children = familyData.children.map((childId) =>
            modifyFamilyData(
              familyList.data.find((child) => child.id_member === childId),
              false,
            ),
          );
        }
        return modifiedData;
      };

      const uniqueSpouses = new Set();

      const filteredData = familyList.data.filter((item) => {
        if (item.spouse && uniqueSpouses.has(item.spouse)) {
          return false;
        }
        uniqueSpouses.add(item.id_member);
        return true;
      });

      setFamilyTree(
        filteredData
          .filter(
            (item) =>
              !filteredData.some(
                (member) =>
                  member.children?.includes(item.id_member) ||
                  member.children?.includes(item.spouse),
              ),
          )
          .map((item) => modifyFamilyData(item, false)),
      );
    }
  }, [familyList]);

  return (
    <SafeAreaView>
      {familyTree && familyTree.length > 0 ? (
        <View style={styles.container}>
          <FamilyTree
            data={familyTree}
            isAdmin={isAdmin}
            familyList={familyList}
          />
        </View>
      ) : invitationList &&
        invitationList.data &&
        invitationList.data.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
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
        </ScrollView>
      ) : (
        <>
          <Card
            style={styles.cardMember}
            onPress={() => setAddFamilyToggle(true)}
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
              onChangeText={(newFamilyName) => setNewFamilyName(newFamilyName)}
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
      </Portal>

      <Portal>
        <Dialog visible={dialogToggle} onDismiss={() => setDialogToggle(false)}>
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
  const { showActionSheetWithOptions } = useActionSheet();

  const [focus, setFocus] = useState(false);
  const [image, setImage] = useState(
    props.member.profiles.avatar
      ? `${props.member.profiles.avatar}?${Date.now()}`
      : null,
  );
  const [role, setRole] = useState(props.member.role);
  const [isCurrentUser, setIsCurrentUser] = useState(
    props.member.id_member === user.data?.id,
  );
  const [addMemberType, setAddMemberType] = useState("");
  const [removeMemberType, setRemoveMemberType] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const actionSheetRef = useRef(null);

  const UpdateMemberRole = useUpdateMemberRole(props.member.id_member, role);
  if (UpdateMemberRole.isError) console.log(error);
  const DeleteMember = useDeleteMember(
    props.member.id_family,
    props.member.id_member,
  );
  if (DeleteMember.isError) console.log(error);

  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkInitialState, setInitialState] = useState({ email: true });
  const [addMemberToggle, setAddMemberToggle] = useState(false);
  const [addMemberConfirm, setAddMemberConfirm] = useState(false);
  const hideAddMemberConfirm = () => {
    setAddMemberConfirm(false);
    setEmail("");
    setInviteRole("");
    setInitialState({ ...checkInitialState, email: true });
  };

  const [selectOptions, setSelectOptions] = useState({
    value: "",
    list: [],
    selectedList: [],
  });
  const [addRelationshipToggle, setAddRelationshipToggle] = useState(false);
  const [removeRelationshipToggle, setRemoveRelationshipToggle] =
    useState(false);

  const createInvitation = useCreateInvitation(
    props.member.id_family,
    email,
    inviteRole,
  );
  if (createInvitation.isError) console.log(createInvitation.error);

  const [targetMember, setTargetMember] = useState(null);
  const [targetSpouse, setTargetSpouse] = useState(null);
  const [targetChildren, setTargetChildren] = useState(null);
  const updateChildren = useUpdateChildren(targetMember, targetChildren);
  if (updateChildren.isError) {
    console.log(updateChildren.error);
    setAddMemberType("");
    setRemoveMemberType("");
    setTargetMember(null);
    setTargetChildren(null);
    setAddRelationshipToggle(false);
  }
  const updateSpouse = useUpdateSpouse(targetMember, targetSpouse);
  if (updateSpouse.isError) {
    console.log(updateSpouse.error);
    setAddMemberType("");
    setRemoveMemberType("");
    setTargetMember(null);
    setTargetSpouse(null);
    setAddRelationshipToggle(false);
  }

  const handleAddMember = () => {
    setInitialState({ ...checkInitialState, email: false });
    if (validateEmail()) {
      for (const member of props.familyTree)
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

  const modifyFamilyData = (familyData, isSpouse) => {
    const modifiedData = { ...familyData };
    if (familyData.profiles) {
      modifiedData.name =
        familyData.family_role ??
        `${familyData.profiles.first_name} ${familyData.profiles.last_name}`;
      modifiedData.avatar = familyData.profiles.avatar;
    }
    if (isSpouse) modifiedData.spouse = null;
    else if (familyData.spouse) {
      const spouseItem = props.familyList.data.find(
        (item) => item.id_member === familyData.spouse,
      );
      modifiedData.spouse = modifyFamilyData(spouseItem, true);
    }
    if (familyData.children && familyData.children.length > 0) {
      modifiedData.children = familyData.children.map((childId) =>
        modifyFamilyData(
          props.familyList.data.find((child) => child.id_member === childId),
          false,
        ),
      );
    }
    return modifiedData;
  };

  const isDescendant = (member, targetMember) => {
    if (member.id_member === targetMember.id_member) {
      return true;
    }
    var descendantCheck = false;
    if (targetMember.children && targetMember.children.length > 0)
      for (let i = 0; i < targetMember.children.length; i++)
        descendantCheck =
          descendantCheck || isDescendant(member, targetMember.children[i]);
    return descendantCheck;
  };

  const showChooseGenerationToAddActionSheet = () => {
    const modifiedFamilyList = props.familyList.data.map((item) =>
      modifyFamilyData(item, false),
    );
    const isAChild = modifiedFamilyList.some((member) =>
      member.children?.some(
        (child) => child.id_member === props.member.id_member,
      ),
    );

    const descendantList = modifiedFamilyList.filter((member) => {
      return (
        isDescendant(member, props.member) || isDescendant(props.member, member)
      );
    });
    const potentialMemberList = modifiedFamilyList.filter((member) => {
      return (
        !isDescendant(member, props.member) &&
        !isDescendant(props.member, member) &&
        !(
          member.id_member === props.member.spouse?.id_member ||
          member.spouse?.id_member === props.member.id_member
        ) &&
        !member.children?.some(
          (child) =>
            child.id_member !== props.member.id_member &&
            isDescendant(child, props.member),
        ) &&
        !descendantList.some((i) =>
          modifiedFamilyList
            .filter((item) => {
              return isDescendant(item, member) || isDescendant(member, item);
            })
            .map((index) => index.id_member)
            .includes(i.id_member),
        )
      );
    });
    const potentialSpouseList = potentialMemberList.filter((member) => {
      return !(
        member.spouse ||
        modifiedFamilyList.some(
          (item) => item.spouse?.id_member === member.id_member,
        )
      );
    });
    const potentialChildList = potentialMemberList.filter((member) => {
      return !props.familyList.data.some((family) => {
        return family.children?.some(
          (child) => child.id_member === member.id_member,
        );
      });
    });

    const hasSpouse =
      props.member.spouse ||
      modifiedFamilyList.some(
        (member) => member.spouse?.id_member === props.member.id_member,
      );

    var index = 0;
    var parentIndex = -1;
    var spouseIndex = -1;
    var childIndex = -1;
    var options = [];
    if (!isAChild && potentialMemberList.length > 0) {
      options.push("Add Parent");
      parentIndex = index++;
    }
    if (!hasSpouse && potentialSpouseList.length > 0) {
      options.push("Add Spouse");
      spouseIndex = index++;
    }
    if (potentialChildList.length > 0) {
      options.push("Add Child");
      childIndex = index++;
    }
    options.push("Cancel");
    const cancelButtonIndex = index;

    showActionSheetWithOptions(
      {
        message:
          cancelButtonIndex === 0
            ? `You cannot add any relationship for ${props.member.profiles.first_name} ${props.member.profiles.last_name}`
            : "",
        options,
        cancelButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case parentIndex:
            setAddMemberType("parent");
            break;

          case spouseIndex:
            setAddMemberType("spouse");
            break;

          case childIndex:
            setAddMemberType("child");
            break;

          case cancelButtonIndex:
            break;
        }
      },
    );
  };

  const showAddMemberActionSheet = () => {
    const options = ["Add Existing Member", "Invite New Member", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            showChooseGenerationToAddActionSheet();
            break;

          case 1:
            setAddMemberToggle(true);
            break;

          case cancelButtonIndex:
            break;
        }
      },
    );
  };

  const showChooseGenerationToRemoveActionSheet = () => {
    const modifiedFamilyList = props.familyList.data.map((item) =>
      modifyFamilyData(item, false),
    );

    const hasChildren =
      props.member.children && props.member.children.length > 0;

    const hasSpouse =
      props.member.spouse ||
      modifiedFamilyList.some(
        (member) => member.spouse?.id_member === props.member.id_member,
      );

    var index = 0;
    var spouseIndex = -1;
    var childIndex = -1;
    var options = [];
    if (hasSpouse) {
      options.push("Remove Spouse");
      spouseIndex = index++;
    }
    if (hasChildren) {
      options.push("Remove A Child");
      childIndex = index++;
    }
    options.push("Cancel");
    const cancelButtonIndex = index;

    showActionSheetWithOptions(
      {
        message:
          cancelButtonIndex === 0
            ? `${props.member.profiles.first_name} ${props.member.profiles.last_name} does not have any relationship`
            : "",
        options,
        cancelButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case spouseIndex:
            setRemoveMemberType("spouse");
            break;

          case childIndex:
            setRemoveMemberType("child");
            break;

          case cancelButtonIndex:
            break;
        }
      },
    );
  };

  const showRemoveMemberActionSheet = () => {
    const options = [
      "Remove Member From Family",
      "Remove A Relationship",
      "Cancel",
    ];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case destructiveButtonIndex:
            setDialogVisible(true);
            break;

          case 1:
            showChooseGenerationToRemoveActionSheet();
            break;

          case cancelButtonIndex:
            break;
        }
      },
    );
  };

  const handleAddRelationship = () => {
    switch (addMemberType) {
      case "parent":
        const parentMember = props.familyList.data.find(
          (member) => member.id_member === targetMember,
        );
        parentMember.children
          ? setTargetChildren([
              ...parentMember.children,
              props.member.id_member,
            ])
          : setTargetChildren([props.member.id_member]);
        break;
      case "spouse":
        const myChildren = props.familyList.data.find(
          (member) => member.id_member === props.member.id_member,
        )?.children;
        const spouseChildren = props.familyList.data.find(
          (member) => member.id_member === targetMember,
        )?.children;
        if (
          myChildren &&
          spouseChildren &&
          myChildren.length > 0 &&
          spouseChildren.length > 0
        ) {
          setTargetChildren([...myChildren, ...spouseChildren]);
          setTargetSpouse(props.member.id_member);
        } else if (myChildren && myChildren.length > 0) {
          setTargetChildren(myChildren);
          setTargetSpouse(props.member.id_member);
        } else if (spouseChildren && spouseChildren.length > 0) {
          setTargetChildren(spouseChildren);
          setTargetSpouse(props.member.id_member);
        } else setTargetSpouse(props.member.id_member);
        break;
      case "child":
        const childMember = props.familyList.data.find(
          (member) => member.id_member === targetMember,
        );
        setTargetMember(props.member.id_member);
        props.member.children
          ? setTargetChildren([
              ...props.member.children.map((child) => child.id_member),
              childMember.id_member,
            ])
          : setTargetChildren([childMember.id_member]);
        break;
      default:
        break;
    }
  };

  const handleRemoveChild = () => {
    const spouse = props.familyList.data.filter(
      (item) =>
        item.id_member === props.member.spouse?.id_member ||
        item.spouse === props.member.id_member,
    );
    const children = props.familyList.data
      .find((member) => member.id_member === props.member.id_member)
      ?.children.filter((child) => child !== targetChildren);
    setTargetChildren(children && children.length > 0 ? children : null);
    setTargetMember(
      spouse && spouse.length > 0
        ? spouse[0].id_member
        : props.member.id_member,
    );
  };

  const turnPink = () => {
    return props.member.profiles.gender === "M"
      ? { backgroundColor: "skyblue" }
      : props.member.profiles.gender === "F"
        ? { backgroundColor: "pink" }
        : { backgroundColor: theme.colors.surface };
  };

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
    setIsCurrentUser(props.member.id_member === user.data?.id);
  }, [user]);

  React.useEffect(() => {
    if (createInvitation.isSuccess) {
      setAddMemberToggle(false);
      setAddMemberConfirm(true);
    }
  }, [createInvitation.isSuccess]);

  React.useEffect(() => {
    if (addMemberType) {
      const modifiedFamilyList = props.familyList.data.map((item) =>
        modifyFamilyData(item, false),
      );
      const descendantList = modifiedFamilyList.filter((member) => {
        return (
          isDescendant(member, props.member) ||
          isDescendant(props.member, member)
        );
      });
      const potentialMemberList = modifiedFamilyList.filter((member) => {
        return (
          !isDescendant(member, props.member) &&
          !isDescendant(props.member, member) &&
          !(
            member.id_member === props.member.spouse?.id_member ||
            member.spouse?.id_member === props.member.id_member
          ) &&
          !member.children?.some(
            (child) =>
              child.id_member !== props.member.id_member &&
              isDescendant(child, props.member),
          ) &&
          !descendantList.some((i) =>
            modifiedFamilyList
              .filter((item) => {
                return isDescendant(item, member) || isDescendant(member, item);
              })
              .map((index) => index.id_member)
              .includes(i.id_member),
          )
        );
      });
      const potentialSpouseList = potentialMemberList.filter((member) => {
        return !(
          member.spouse ||
          modifiedFamilyList.some(
            (item) => item.spouse?.id_member === member.id_member,
          )
        );
      });
      const potentialChildList = potentialMemberList.filter((member) => {
        return !props.familyList.data.some((family) => {
          return family.children?.some(
            (child) => child.id_member === member.id_member,
          );
        });
      });
      switch (addMemberType) {
        case "parent":
          setSelectOptions({
            value: "",
            list: potentialMemberList.map((member) => ({
              _id: member.id_member,
              value: `${member.profiles.first_name} ${member.profiles.last_name}`,
            })),
            selectedList: [],
          });
          break;
        case "spouse":
          setSelectOptions({
            value: "",
            list: potentialSpouseList.map((member) => ({
              _id: member.id_member,
              value: `${member.profiles.first_name} ${member.profiles.last_name}`,
            })),
            selectedList: [],
          });
          break;
        case "child":
          setSelectOptions({
            value: "",
            list: potentialChildList.map((member) => ({
              _id: member.id_member,
              value: `${member.profiles.first_name} ${member.profiles.last_name}`,
            })),
            selectedList: [],
          });
          break;
        default:
          break;
      }
    }
  }, [addMemberType]);

  React.useEffect(() => {
    if (removeMemberType) {
      const modifiedFamilyList = props.familyList.data.map((item) =>
        modifyFamilyData(item, false),
      );
      const childrenList = modifiedFamilyList.filter((item) => {
        return props.member.children?.some(
          (child) => child.id_member === item.id_member,
        );
      });
      switch (removeMemberType) {
        case "spouse":
          setTargetMember(props.member.spouse.id_member);
          break;
        case "child":
          setSelectOptions({
            value: "",
            list: childrenList.map((member) => ({
              _id: member.id_member,
              value: `${member.profiles.first_name} ${member.profiles.last_name}`,
            })),
            selectedList: [],
          });
          break;
        default:
          break;
      }
    }
  }, [removeMemberType]);

  React.useEffect(() => {
    if (selectOptions && selectOptions.list && selectOptions.list.length > 0) {
      if (addMemberType) setAddRelationshipToggle(true);
      else if (removeMemberType) setRemoveRelationshipToggle(true);
    }
  }, [selectOptions]);

  React.useEffect(() => {
    if (
      addMemberType &&
      targetMember &&
      targetChildren &&
      targetChildren.length > 0
    )
      updateChildren.mutate();
    if (removeMemberType && targetMember) {
      if (removeMemberType === "spouse") updateSpouse.mutate();
      else updateChildren.mutate();
    }
  }, [targetMember, targetChildren]);

  React.useEffect(() => {
    if (addMemberType && targetMember && targetSpouse) updateSpouse.mutate();
  }, [targetSpouse]);

  React.useEffect(() => {
    if (updateChildren.isSuccess && addMemberType) {
      switch (addMemberType) {
        case "parent":
          setAddMemberType("");
          setTargetMember(null);
          setTargetChildren(null);
          queryClient.invalidateQueries("FamilyMemberList");
          setAddRelationshipToggle(false);
          break;
        case "spouse":
          break;
        case "child":
          const spouse = props.familyList.data.find(
            (member) => member.id_member === targetMember,
          )?.spouse;
          if (spouse) {
            setTargetMember(spouse);
            setAddMemberType("parent");
          } else {
            setAddMemberType("");
            setTargetMember(null);
            setTargetChildren(null);
            queryClient.invalidateQueries("FamilyMemberList");
            setAddRelationshipToggle(false);
          }
          break;
        default:
          break;
      }
    }
    if (updateChildren.isSuccess && removeMemberType) {
      if (removeMemberType === "spouse") updateSpouse.mutate();
      else if (removeMemberType === "child") {
        if (targetMember === props.member.id_member) {
          setRemoveMemberType("");
          setTargetMember(null);
          setTargetSpouse(null);
          setTargetChildren(null);
          queryClient.invalidateQueries("FamilyMemberList");
          setRemoveRelationshipToggle(false);
        } else setTargetMember(props.member.id_member);
      }
    }
  }, [updateChildren.isSuccess]);

  React.useEffect(() => {
    if (updateSpouse.isSuccess && addMemberType) {
      if (targetMember === props.member.id_member) {
        setAddMemberType("");
        setTargetMember(null);
        setTargetChildren(null);
        queryClient.invalidateQueries("FamilyMemberList");
        setAddRelationshipToggle(false);
      } else {
        const newTarget = targetSpouse;
        const newSpouse = targetMember;
        setTargetMember(newTarget);
        setTargetSpouse(newSpouse);
      }
    }
    if (updateSpouse.isSuccess && removeMemberType === "spouse") {
      if (targetMember === props.member.id_member) {
        setRemoveMemberType("");
        setTargetMember(null);
        setTargetChildren(null);
        queryClient.invalidateQueries("FamilyMemberList");
        setRemoveRelationshipToggle(false);
      } else setTargetMember(props.member.id_member);
    }
  }, [updateSpouse.isSuccess]);

  return (
    <>
      <View key={props.member.id_member}>
        <View style={[styles.card, turnPink()]}>
          {image ? (
            <Image
              style={[styles.avatar]}
              source={{ uri: props.member.profiles.avatar }}
            />
          ) : (
            <Icon source="account" size={100} />
          )}
          {props.isAdmin && !isCurrentUser && (
            <Switch
              value={role}
              onValueChange={setRole}
              style={styles.switch}
            />
          )}
          <Text style={styles.admin}>{role ? "Admin" : ""}</Text>
          <Text style={styles.naming}>
            {`${props.member.profiles.first_name} ${props.member.profiles.last_name}`}
          </Text>
          <Text style={styles.famrole}>{props.member.family_role}</Text>
          {(props.isAdmin || isCurrentUser) && (
            <TouchableOpacity
              style={props.isAdmin ? styles.btn1 : styles.btn2}
              onPress={() => {}}
            >
              <Icon source="square-edit-outline" size={24} />
            </TouchableOpacity>
          )}
          {props.isAdmin && (
            <>
              <TouchableOpacity
                style={props.isAdmin ? styles.btn2 : styles.btn3}
                onPress={showAddMemberActionSheet}
              >
                <Icon source="plus" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn3}
                onPress={() => showRemoveMemberActionSheet()}
              >
                <Icon
                  source="trash-can-outline"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

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
                Are you sure you want to remove{" "}
                {props.member.family_role ??
                  `${props.member.profiles.first_name} ${props.member.profiles.last_name}`}{" "}
                from the family?
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
              value={inviteRole}
              onChangeText={setInviteRole}
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

        <Dialog
          visible={addRelationshipToggle}
          onDismiss={() => {
            setSelectOptions({ value: "", list: [], selectedList: [] });
            setAddMemberType("");
            setTargetMember(null);
            setTargetSpouse(null);
            setTargetChildren(null);
            setAddRelationshipToggle(false);
          }}
        >
          <Dialog.Title>Add a relationship</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{`Add a ${addMemberType} for ${props.member.profiles.first_name} ${props.member.profiles.last_name}`}</Text>
            <PaperSelect
              label="Select member"
              value={selectOptions.value}
              arrayList={[...selectOptions.list]}
              selectedArrayList={selectOptions.selectedList}
              onSelection={(value) => {
                setSelectOptions({
                  ...selectOptions,
                  value: value.text,
                  selectedList: value.selectedList,
                });
                setTargetMember(value.selectedList[0]._id);
              }}
              multiEnable={false}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setSelectOptions({ value: "", list: [], selectedList: [] });
                setAddMemberType("");
                setTargetMember(null);
                setTargetSpouse(null);
                setTargetChildren(null);
                setAddRelationshipToggle(false);
              }}
            >
              CANCEL
            </Button>
            <Button mode="contained" onPress={handleAddRelationship}>
              CREATE RELATIONSHIP
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={removeRelationshipToggle}
          onDismiss={() => {
            setSelectOptions({ value: "", list: [], selectedList: [] });
            setRemoveMemberType("");
            setTargetMember(null);
            setTargetSpouse(null);
            setTargetChildren(null);
            setRemoveRelationshipToggle(false);
          }}
        >
          <Dialog.Title>Remove a child</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{`Remove a child for ${props.member.profiles.first_name} ${props.member.profiles.last_name}`}</Text>
            <PaperSelect
              label="Select member"
              value={selectOptions.value}
              arrayList={[...selectOptions.list]}
              selectedArrayList={selectOptions.selectedList}
              onSelection={(value) => {
                setSelectOptions({
                  ...selectOptions,
                  value: value.text,
                  selectedList: value.selectedList,
                });
                setTargetChildren(value.selectedList[0]._id);
              }}
              multiEnable={false}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setSelectOptions({ value: "", list: [], selectedList: [] });
                setRemoveMemberType("");
                setTargetMember(null);
                setTargetSpouse(null);
                setTargetChildren(null);
                setRemoveRelationshipToggle(false);
              }}
            >
              CANCEL
            </Button>
            <Button mode="contained" onPress={handleRemoveChild}>
              REMOVE CHILD
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

class FamilyTree extends Component {
  constructor(props) {
    super(props);
  }

  hasChildren(member) {
    return member.children && member.children.length;
  }

  hasSpouse(member) {
    return member.spouse && member.spouse.id_member;
  }

  renderTree(data, level) {
    return (
      <FlatList
        data={data}
        horizontal={true}
        contentContainerStyle={{ padding: 50 }}
        keyExtractor={(item, index) => item.id_member}
        listKey={(item, index) => item.id_member}
        initialScrollIndex={0}
        style={{ flexGrow: 1 }}
        renderItem={({ item, index }) => {
          const { name, avatar } = item;
          const info = { name, avatar };
          const spouse = this.hasSpouse(item) ? item.spouse : null;

          return (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: this.props.siblingGap / 2,
                paddingRight: this.props.siblingGap / 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    zIndex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MemberCard
                    member={item}
                    isAdmin={this.props.isAdmin}
                    familyTree={this.props.data}
                    familyList={this.props.familyList}
                  />
                  {spouse && (
                    <>
                      <Svg height="20" width="50">
                        <Line
                          x1="0"
                          y1="50%"
                          x2="50"
                          y2="50%"
                          stroke={this.props.pathColor}
                          strokeWidth={this.props.strokeWidth}
                        />
                      </Svg>
                      <MemberCard
                        member={spouse}
                        isAdmin={this.props.isAdmin}
                        familyTree={this.props.data}
                        familyList={this.props.familyList}
                      />
                    </>
                  )}
                </View>
              </View>
              {(this.hasChildren(item) ||
                (spouse && this.hasChildren(spouse))) && (
                <Svg height="50" width="20">
                  <Line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="150"
                    stroke={this.props.pathColor}
                    strokeWidth={this.props.strokeWidth}
                  />
                </Svg>
              )}
              <View style={{ flexDirection: "row" }}>
                {(this.hasChildren(item) ||
                  (spouse && this.hasChildren(spouse))) &&
                  (item.children.length > 0
                    ? item.children
                    : spouse.children
                  ).map((child, index) => {
                    const { name, avatar } = child;
                    const info = { name, avatar };
                    return (
                      <View
                        key={child.id_member}
                        style={{
                          flexDirection: "row",
                        }}
                      >
                        <View>
                          <Svg height="50" width="100%">
                            <Line
                              x1="50%"
                              y1="0"
                              x2="50%"
                              y2="100%"
                              stroke={this.props.pathColor}
                              strokeWidth={this.props.strokeWidth}
                            />
                            {/* Right side horizontal line */}
                            {item.children.length != 1 &&
                              item.children.length - 1 !== index && (
                                <Line
                                  x1="100%"
                                  y1={this.props.strokeWidth / 2}
                                  x2="50%"
                                  y2={this.props.strokeWidth / 2}
                                  stroke={this.props.pathColor}
                                  strokeWidth={this.props.strokeWidth}
                                />
                              )}
                            {/* Left side horizontal line */}
                            {item.children.length != 1 && index !== 0 && (
                              <Line
                                x1="50%"
                                y1={this.props.strokeWidth / 2}
                                x2="0"
                                y2={this.props.strokeWidth / 2}
                                stroke={this.props.pathColor}
                                strokeWidth={this.props.strokeWidth}
                              />
                            )}
                          </Svg>
                          {this.renderTree([child], level + 1)}
                        </View>
                        <View
                          style={{
                            height: this.props.strokeWidth,
                            backgroundColor:
                              item.children.length - 1 !== index
                                ? this.props.pathColor
                                : "transparent",
                            width:
                              this.hasChildren(child) &&
                              child.children.length - 1 !== index
                                ? level * this.props.familyGap
                                : 0,
                          }}
                        />
                      </View>
                    );
                  })}
              </View>
            </View>
          );
        }}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>{this.renderTree(this.props.data, 1)}</View>
    );
  }
}

FamilyTree.defaultProps = {
  data: [],
  pathColor: "#00ffd8",
  siblingGap: 50,
  familyGap: 30,
  strokeWidth: 5,
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
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
    body: {
      flex: 1,
      backgroundColor: "#3a5561",
      justifyContent: "center",
      alignItems: "center",
    },
    zoomable: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    card: {
      height: 140,
      width: 300,
      justifyContent: "center",
      alignContent: "center",
      borderRadius: 6,
    },
    avatar: {
      height: 100,
      width: 100,
      left: 10,
    },
    switch: {
      left: 125,
      top: 0,
      position: "absolute",
    },
    admin: {
      color: "#3a5561",
      fontSize: 10,
      left: 175,
      top: 17.5,
      position: "absolute",
    },
    naming: {
      color: "#3a5561",
      fontSize: 20,
      left: 125,
      position: "absolute",
      top: 40,
    },
    famrole: {
      position: "absolute",
      color: "#3a5561",
      fontSize: 20,
      left: 125,
      top: 70,
    },
    btn1: {
      height: 24,
      width: 24,
      position: "absolute",
      left: 180,
      top: 108,
    },
    btn2: {
      height: 24,
      width: 24,
      position: "absolute",
      top: 108,
      left: 220,
    },
    btn3: {
      height: 24,
      width: 24,
      position: "absolute",
      top: 108,
      left: 260,
    },
    upper: {
      height: "60%",
      backgroundColor: "#DDD",
      opacity: 0.5,
    },
    lower: {
      flex: 1,
      backgroundColor: "white",
    },
    gender: {
      position: "absolute",
      left: "25%",
    },
    generation: {
      height: "40%",
    },
  });
