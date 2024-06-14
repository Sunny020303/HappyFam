import { useQuery } from "react-query";
import supabase from "../../app/supabase";

const getInvitationList = async (email) => {
  let { data, error } = await supabase
    .from("invitation")
    .select("id, created_at, family, email, role, family(id, name, image)")
    .eq("email", email);

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }
  return data;
};

export default function useGetInvitationList(email) {
  return useQuery("InvitationList", () => getInvitationList(email));
}
