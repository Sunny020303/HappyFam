import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const updateMemberRole = async (id, role) => {
  const { data, error } = await supabase
    .from("family_member")
    .update({
      role: role,
    })
    .eq("id_member", id)
    .select();
  if (error) {
    throw error;
  }
};

export default function useUpdateMemberRole(id, role) {
  return useMutation(() => updateMemberRole(id, role));
}
