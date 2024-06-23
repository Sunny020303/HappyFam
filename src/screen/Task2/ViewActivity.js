import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  ViewComponent,
} from "react-native";
import { FontSize, Color, StyleVariable } from "../../GlobalStyles";
import { Dimensions } from "react-native";
import {
  IconButton,
  ActivityIndicator,
  Icon,
  Portal,
  Dialog,
  Button,
  Avatar,
} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import Comments from "react-native-comments";
import userGetActivityById from "../../hooks/ActivityHook/useGetActivityById";
import useDeleteActivity from "../../hooks/ActivityHook/useDeleteActivity";
import userGetMemberList from "../../hooks/ActivityHook/useGetMemberList";
import useUser from "../../hooks/UserHook/useGetUser";
import useCreateComment from "../../hooks/CommentHook/useCreateComment";
import useUpdateComment from "../../hooks/CommentHook/useUpdateComment";
import useDeleteComment from "../../hooks/CommentHook/useDeleteComment";
import useGetCommentList from "../../hooks/CommentHook/useGetCommentList";
const screenWidth = Dimensions.get("window").width;

export default ViewActivity = ({ route, navigation, family }) => {
  const isFocus = useIsFocused();
  const user = useUser();
  const scrollViewRef = useRef();
  const activity = userGetActivityById(route.params?.activityId);
  const deleteActivity = useDeleteActivity(route.params?.activityId);
  const memberList = userGetMemberList(route.params?.activityId);
  const [replyTo, setReplyTo] = useState(null);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const createComment = useCreateComment(
    route.params?.activityId,
    user.data?.id,
    replyTo,
    comment,
  );
  if (createComment.isError) console.log(createComment.error);
  const updateComment = useUpdateComment(commentId, comment);
  if (updateComment.isError) console.log(updateComment.error);
  const deleteComment = useDeleteComment(commentId);
  if (deleteComment.isError) console.log(deleteComment.error);
  const GetCommentList = useGetCommentList(route.params?.activityId);
  if (GetCommentList.isError) console.log(GetCommentList.error);
  const [triggerCreateComment, setTriggerCreateComment] = useState(0);
  const [triggerUpdateComment, setTriggerUpdateComment] = useState(0);
  const [triggerDeleteComment, setTriggerDeleteComment] = useState(0);
  const [title, setTitle] = useState("No title");
  const [image, setImage] = useState("No image");
  const [location, setLocation] = useState("Somewhere");
  const [begin, setBegin] = useState();
  const [end, setEnd] = useState();
  const [withWho, setWithWho] = useState("everyone");
  const [repeat, setRepeat] = useState({ value: 0, unit: "day" });
  const [remind, setRemind] = useState({ value: 0, unit: "minute" });
  const [note, setNote] = useState("Doan xem");
  const [height, setHeight] = useState(0);
  const [toggleDelete, setToggleDelete] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  if (deleteActivity.isSuccess) {
    navigation.navigate("Calendar");
  }

  function handleSubmitComment(text, parentCommentId) {
    setComment(text);
    setReplyTo(parentCommentId ? parentCommentId : "null");
    setTriggerCreateComment(1);
  }

  function handleEditComment(text, comment) {
    setComment(text);
    setCommentId(comment.id ? comment.id : "null");
    setTriggerUpdateComment(1);
  }

  function handleDeleteComment(comment) {
    setCommentId(comment.id ? comment.id : "null");
    setTriggerDeleteComment(1);
  }

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <IconButton
            onPress={() =>
              navigation.navigate("Activity", {
                activity: activity.data[0],
              })
            }
            icon="pencil"
          />
          <IconButton
            onPress={() => setToggleDelete(true)}
            icon="delete-outline"
          />
        </View>
      ),
    });
    if (isFocus) activity.refetch();
    if (!isFocus) {
      deleteActivity.reset();
      setImage("No image");
    }
  }, [isFocus]);

  React.useEffect(() => {
    if (activity.data) {
      setTitle(activity.data[0].title);
      setImage(
        activity.data[0].image && activity.data[0].image !== "No image"
          ? `${activity.data[0].image}?${Date.now()}`
          : "No image",
      );
      setLocation(activity.data[0].location);
      setBegin(activity.data[0].start);
      setEnd(activity.data[0].end);
      setWithWho("everyone");
      setRepeat(activity.data[0].repeat);
      setRemind(activity.data[0].remind);
      setNote(activity.data[0].note);
      console.log(activity.data[0].image);
    }
  }, [activity.data]);

  React.useEffect(() => {
    if (memberList.data) {
      console.log(memberList.data);
    }
  }, [memberList.data]);

  React.useEffect(() => {
    if (GetCommentList.data && GetCommentList.data.length) {
      const buildNestedComments = (comments, parentId = null) => {
        const nested = [];
        comments.forEach((comment) => {
          if (comment.id_parent === parentId) {
            const nestedComment = {
              ...comment,
              children: buildNestedComments(comments, comment.id),
            };
            nested.push(nestedComment);
          }
        });
        return nested;
      };

      // email: displayed name
      const updatedCommentList = GetCommentList.data.map((comment) => {
        const email = comment.id_member
          ? comment.profiles.family_member?.length > 0 &&
            comment.profiles.family_member[0]?.family_role
            ? comment.profiles.family_member[0].family_role
            : comment.profiles.first_name + comment.profiles?.last_name
          : "[deleted]";
        const image = comment.id_member
          ? comment.profiles.avatar
            ? `${comment.profiles.avatar}?${Date.now()}`
            : "https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/avatar/public/account.png"
          : "https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/avatar/public/account.png";
        const lastModified = comment.updated_at ?? comment.created_at;
        return { ...comment, email, image, lastModified };
      });

      setCommentList(updatedCommentList);
    } else setCommentList([]);
  }, [GetCommentList.data]);

  React.useEffect(() => {
    if (triggerCreateComment === 1 && comment !== null && replyTo !== null) {
      setTriggerCreateComment(2);
      if (replyTo === "null") setReplyTo(null);
    }
    if (triggerCreateComment === 2 && replyTo !== "null") {
      setTriggerCreateComment(0);
      createComment.mutate();
    }

    if (triggerUpdateComment && comment !== null && commentId !== null) {
      setTriggerUpdateComment(0);
      if (commentId !== "null") updateComment.mutate();
    }

    if (triggerDeleteComment && commentId !== null) {
      setTriggerDeleteComment(0);
      if (commentId !== "null") deleteComment.mutate();
    }
  }, [
    comment,
    replyTo,
    commentId,
    triggerCreateComment,
    triggerUpdateComment,
    triggerDeleteComment,
  ]);

  React.useEffect(() => {
    if (createComment.isSuccess) {
      setComment(null);
      setReplyTo(null);
      GetCommentList.refetch();
    }
    if (updateComment.isSuccess) {
      setComment(null);
      setCommentId(null);
      GetCommentList.refetch();
    }
    if (deleteComment.isSuccess) {
      setCommentId(null);
      GetCommentList.refetch();
    }
  }, [
    createComment.isSuccess,
    updateComment.isSuccess,
    deleteComment.isSuccess,
  ]);

  navigation.setOptions({
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <IconButton
          onPress={() =>
            navigation.navigate("Activity", {
              activity: activity.data[0],
            })
          }
          icon="pencil"
        />
        <IconButton
          onPress={() => setToggleDelete(true)}
          icon="delete-outline"
        />
      </View>
    ),
  });

  if (
    activity.isFetching ||
    memberList.isFetching ||
    GetCommentList.isFetching
  ) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <ActivityIndicator
          animating={true}
          color="blue"
          size="large"
        ></ActivityIndicator>
      </View>
    );
  }

  if (image !== "No image")
    Image.getSize(image, (width, height) => {
      setHeight((screenWidth - 30) * (height / width));
    });

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={styles.formContent}
      onScroll={(event) => setScrollIndex(event.nativeEvent.contentOffset.y)}
      ref={scrollViewRef}
    >
      <View style={styles.viewContainer}>
        <View style={styles.viewComponent}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "bold",
              padding: 20,
              paddingBottom: 0,
            }}
          >
            {title}
          </Text>
          <Text style={styles.textFormat}>{location}</Text>
          {image !== "No image" && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                resizeMode="cover"
                source={{ uri: image }}
                style={{ width: screenWidth - 30, height: height }}
              ></Image>
            </View>
          )}
        </View>

        <View style={styles.viewComponent}>
          <Text style={styles.textFormat}>
            {new Date(begin).toString().split(" G")[0]}
          </Text>
          <Text style={styles.textFormat}>
            {new Date(end).toString().split(" G")[0]}
          </Text>
        </View>

        <View style={styles.viewComponent}>
          <Text style={styles.textFormat}>
            {repeat.value == 0
              ? "No repeat"
              : "Every " +
                repeat.value +
                " " +
                repeat.unit +
                (repeat.value > 1 ? "s" : "")}
          </Text>
        </View>

        <View
          style={[styles.viewComponent, { flexDirection: "row", height: 70 }]}
        >
          {memberList.data ? (
            memberList.data.map((i) =>
              i.profiles.avatar ? (
                <Image
                  resizeMode="cover"
                  source={{ uri: i.profiles.avatar }}
                  style={{ width: 60, height: 60 }}
                  margin={5}
                  borderRadius={20}
                ></Image>
              ) : (
                <Avatar.Icon
                  color="#F5E388"
                  style={{ borderRadius: 20, margin: 5 }}
                  icon="account"
                />
              ),
            )
          ) : (
            <Text style={styles.textFormat}>No member</Text>
          )}
        </View>

        <View style={styles.viewComponent}>
          <Text style={styles.textFormat}>
            {remind.unit == "none"
              ? "No reminder"
              : remind.value == 0
                ? "At time"
                : remind.value +
                  " " +
                  remind.unit +
                  (remind.value > 1 ? "s" : "") +
                  " before start"}
          </Text>
        </View>

        <View style={styles.viewComponent}>
          <Text style={styles.textFormat}>{note ? note : "No note"}</Text>
        </View>

        <View style={styles.viewComponent}>
          <Comments
            data={commentList}
            viewingUserName={
              family.family_role ?? user.data?.first_name + user.data?.last_name
            }
            childPropName={"children"}
            isChild={(item) => (item.id_parent ? true : false)}
            keyExtractor={(item) => item.id}
            parentIdExtractor={(item) => item.id_parent}
            usernameExtractor={(item) => item.email}
            createdTimeExtractor={(item) => item.created_at}
            editTimeExtractor={(item) => item.lastModified}
            bodyExtractor={(item) => item.body}
            imageExtractor={(item) => item.image}
            likesExtractor={() => []}
            childrenCountExtractor={() => 0}
            // replyAction={(offset) => {
            //   scrollViewRef.current.scrollTo({
            //     x: null,
            //     y: scrollIndex + offset - 300,
            //     animated: true,
            //   });
            // }}
            saveAction={(text, parentCommentId) =>
              handleSubmitComment(text, parentCommentId)
            }
            editAction={(text, comment) => handleEditComment(text, comment)}
            deleteAction={(comment) => handleDeleteComment(comment)}
          />
        </View>
      </View>

      <Portal>
        <Dialog visible={toggleDelete} onDismiss={() => setToggleDelete(false)}>
          <Dialog.Icon icon="delete-outline" size={40}></Dialog.Icon>
          <Dialog.Title alignSelf="center">Confirm</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this activity?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setToggleDelete(false);
                deleteActivity.mutate();
              }}
            >
              Confirm
            </Button>
            <Button onPress={() => setToggleDelete(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.materialThemeSysLightOutlineVariant,
  },
  formContent: {
    alignItems: "center",
  },
  viewContainer: {
    width: screenWidth - 30,
    margin: 15,
    backgroundColor: Color.materialThemeSysLightOutlineVariant,
  },
  viewComponent: {
    marginTop: 3,
    backgroundColor: Color.materialThemeSysLightInverseOnSurface,
  },
  textFormat: {
    padding: 20,
    fontSize: 30,
  },
});
