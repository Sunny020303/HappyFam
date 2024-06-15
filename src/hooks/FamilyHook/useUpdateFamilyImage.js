import { useMutation } from "react-query";
import supabase from "../../app/supabase";

const updateFamilyImage = async (id, image) => {
  const { error } = await supabase
    .from("family")
    .update({
      name: image,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }
};

export default function useUpdateFamilyImage(id, image) {
  return useMutation(() => updateFamilyImage(id, image));
}
