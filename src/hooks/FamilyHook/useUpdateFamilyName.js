import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const updateFamilyName = async (id, name) => {
  const { error } = await supabase
    .from("family")
    .update({
      name: name,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }
};

export default function useUpdateFamilyName(id, name) {
  return useMutation(() => updateFamilyName(id, name));
}
