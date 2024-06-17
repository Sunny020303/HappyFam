import { useQuery, useQueryClient } from "react-query";
import supabase from "../../app/supabase";

const getFamilyMemberById = async (id_member) => {
  if (!id_member) return null;

  let { data, error } = await supabase
    .from("family_member")
    .select(
      "id, id_family, id_member, role, family_role, family(id, name, image)",
    )
    .eq("id_member", id_member);

  if (error) {
    throw new Error(error.message);
  }
  if (!data || data.length === 0) {
    return null;
  }
  return data[0];
};

export default function useGetFamilyMemberById(id_member) {
  return useQuery("Family", () => getFamilyMemberById(id_member));
}
