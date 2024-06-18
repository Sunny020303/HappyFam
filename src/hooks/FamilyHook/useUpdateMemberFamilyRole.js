import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const updateMemberFamilyRole = async (id, role) => {
  const { data, error } = await supabase
    .from("family_member")
    .update({
      family_role: role,
    })
    .eq("id_member", id)
    .select();
  if (error) {
    throw error;
  }
};

export default function useUpdateMemberFamilyRole(id, role) {
  return useMutation(() => updateMemberFamilyRole(id, role));
}
