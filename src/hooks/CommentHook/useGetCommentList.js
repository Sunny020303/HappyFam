import { useQuery } from "react-query";
import supabase from "../../app/supabase";

const getCommentList = async (id) => {
  let { data, error } = await supabase
    .from("comment")
    .select(
      "id, created_at, id_member, id_parent, body, profiles(id, first_name, last_name, avatar, family_member(id_member, family_role))",
    )
    .eq("id_activity", id);

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }
  return data;
};

export default function userGetCommentList(id) {
  return useQuery("GetCommentList", () => getCommentList(id));
}
