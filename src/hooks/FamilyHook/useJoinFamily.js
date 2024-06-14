import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const joinFamily = async (family_id, member_id, email, role) => {
  const { data, error } = await supabase
    .from("family_member")
    .insert({
      id_family: family_id,
      id_member: member_id,
      role: false,
      family_role: role,
    })
    .select();
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Join failed, unknown error!");
  }

  const { error2 } = await supabase
    .from("invitation")
    .delete()
    .eq("email", email);
  if (error2) {
    throw error2;
  }
  return data;
};

export default function useJoinFamily(family_id, member_id, email, role) {
  return useMutation(() => joinFamily(family_id, member_id, email, role));
}
