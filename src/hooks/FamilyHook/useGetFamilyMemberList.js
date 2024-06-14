import { useQuery, useQueryClient } from "react-query";
import supabase from "../../app/supabase";

const getFamilyMemberList = async (family_id) => {
  if (!family_id) return null;

  let { data, error } = await supabase
    .from("family_member")
    .select(
      "id_member, role, family_role, profiles(id, first_name, last_name, avatar, email)",
    )
    .eq("id_family", family_id);

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }
  return data;
};

export default function useGetFamilyMemberList(family_id) {
  return useQuery("FamilyMemberList", () => getFamilyMemberList(family_id));
}
