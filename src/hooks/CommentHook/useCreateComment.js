import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const createComment = async (activity, member, parent, body) => {
  const { data, error } = await supabase
    .from("comment")
    .insert({
      id_activity: activity,
      id_member: member,
      id_parent: parent,
      body: body,
    })
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export default function useCreateComment(activity, member, parent, body) {
  return useMutation(() => createComment(activity, member, parent, body));
}
