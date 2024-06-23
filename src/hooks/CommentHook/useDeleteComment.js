import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const deleteComment = async (id) => {
  const { error } = await supabase.from("comment").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return;
};

export default function useDeleteComment(id) {
  return useMutation(() => deleteComment(id));
}
