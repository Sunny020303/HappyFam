import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const deleteMember = async (familyId, memberId) => {
  var hasAdmin = false;

  const { data, error1 } = await supabase
    .from("family_member")
    .select("*")
    .eq("id_family", familyId);
  if (error1) throw error1;

  if (data && data.length === 1) {
    const { error2 } = await supabase
      .from("family")
      .delete()
      .eq("id", familyId);
    if (error2) throw error2;
    return;
  }

  if (data && data.data && data.data.length > 1)
    for (const member of data.data)
      if (member.id_member !== memberId && member.role) hasAdmin = true;
  if (!hasAdmin) {
    const { error2 } = await supabase
      .from("family_member")
      .update({ role: true })
      .eq("id_family", familyId);
    if (error2) throw error2;
  }

  const { error } = await supabase
    .from("family_member")
    .delete()
    .eq("id_member", memberId);
  if (error) throw error;

  return;
};

export default function useDeleteMember(familyId, memberId) {
  return useMutation(() => deleteMember(familyId, memberId));
}
