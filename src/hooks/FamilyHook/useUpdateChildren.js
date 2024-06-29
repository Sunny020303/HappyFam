import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const updateChildren = async (id, children) => {
  const { error } = await supabase
    .from("family_member")
    .update({
      children: children,
    })
    .eq("id_member", id);
  if (error) {
    throw error;
  }
};

export default function useUpdateChildren(id, children) {
  return useMutation(() => updateChildren(id, children));
}
