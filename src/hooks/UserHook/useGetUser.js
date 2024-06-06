import { useQuery } from "react-query";
import { supabase } from "../../lib/supabase";

const GetCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
  return data.session?.user;
};
export default function useUser() {
  return useQuery("user1", () => GetCurrentUser());
}
