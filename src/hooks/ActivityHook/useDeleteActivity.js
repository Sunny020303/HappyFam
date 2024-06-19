import { supabase } from "../../lib/supabase";
import { useMutation } from "react-query";

const deleteActivity = async (id_activity) => {
    const { error } = await supabase.from('activity').delete().eq('id', id_activity);
    const { error2 } = await supabase.from('activity_member').delete().eq('id_activity', id_activity);

    if (error) {
        throw error;
    } else {
        const { error: isError } = await supabase.storage
            .from("activityPics")
            .remove(["public/" + id_activity + ".png"]);
        if (isError) {
            throw isError;
        }
    }
};

export default function useDeleteActivity(id_activity) {
    return useMutation(() => deleteActivity(id_activity));
}