import { useMutation, useQueryClient } from "react-query";
import supabase from "../../app/supabase";
import Family from "../../screen/Task2/Family";

const createFamily = async (member_id, name) => {
  const { data, error } = await supabase
    .from("family")
    .insert({
      name: name,
    })
    .select();
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Family not created");
  }

  const { data2, error2 } = await supabase
    .from("family_member")
    .insert({
      id_family: data[0].id,
      id_member: member_id,
      role: true,
      family_role: "",
    })
    .select();
  if (error2) {
    throw error2;
  }
  return data2;
};

export default function useCreateFamily(member_id, name) {
  return useMutation(() => createFamily(member_id, name));
}
