import { useQuery, useQueryClient } from "react-query";
import supabase from "../../app/supabase";

const getActivityById = async (activity_id) =>{
    let { activity , error } = await supabase
        .from('activity')
        .select('*')
        .eq("id",activity_id)
        
    if (error) {
        throw new Error(error.message);
    }
    if(!activity){
        throw new Error("Activity not found")
    }
    return activity;
}

export default function userGetActivityList(activity_id) {
    return useQuery("Activity", ()=> getActivityById(activity_id))
}


