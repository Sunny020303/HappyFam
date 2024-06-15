import { useQuery, useQueryClient } from "react-query";
import supabase from "../../app/supabase";

const getFamily = async (id) => {
  if (!id) return null;

  let { data, error } = await supabase.from("family").select("*").eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }
  return data;
};

export default function userGetFamily(id) {
  return useQuery("GetFamily", () => getFamily(id));
}
