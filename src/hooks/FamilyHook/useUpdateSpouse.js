import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const updateSpouse = async (id, spouse) => {
  const { error } = await supabase
    .from("family_member")
    .update({
      spouse: spouse,
    })
    .eq("id_member", id);
  if (error) {
    throw error;
  }
};

export default function useUpdateSpouse(id, spouse) {
  return useMutation(() => updateSpouse(id, spouse));
}
