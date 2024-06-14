import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const deleteInvitation = async (family, email) => {
  const { error } = await supabase
    .from("invitation")
    .delete()
    .eq("family", family)
    .eq("email", email);
  if (error) {
    throw error;
  }
  return;
};

export default function useDeleteInvitation(family, email) {
  return useMutation(() => deleteInvitation(family, email));
}
