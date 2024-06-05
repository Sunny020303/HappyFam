import { useQuery, useQueryClient } from "react-query";
import supabase from "../../app/supabase";

const getActivityList = async (family_id) =>{
    let { activities , error } = await supabase
        .from('activity')
        .select('*')
        .eq("id_family",family_id)
        
    if (error) {
        throw new Error(error.message);
    }
    if(!activities){
        throw new Error("Activity list not found")
    }
    return activities;
}

export default function userGetActivityList(family_id) {
    return useQuery("ActivityList", ()=> getActivityList(family_id))
}


