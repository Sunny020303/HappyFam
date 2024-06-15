import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const deleteFamily = async (id) => {
  const { error } = await supabase.from("family").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return;
};

export default function useDeleteFamily(id) {
  return useMutation(() => deleteFamily(id));
}
