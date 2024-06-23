import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const updateComment = async (id, body) => {
  const { data, error } = await supabase
    .from("comment")
    .update({ body: body })
    .eq("id", id)
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export default function useUpdateComment(id, body) {
  return useMutation(() => updateComment(id, body));
}
