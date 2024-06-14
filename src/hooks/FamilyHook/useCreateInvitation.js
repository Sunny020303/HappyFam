import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const createInvitation = async (family, email, role) => {
  await supabase
    .from("invitation")
    .delete()
    .eq("family", family)
    .eq("email", email);

  const { data, error } = await supabase
    .from("invitation")
    .insert({
      family: family,
      email: email,
      role: role,
    })
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export default function useCreateInvitation(family, email, role) {
  return useMutation(() => createInvitation(family, email, role));
}
