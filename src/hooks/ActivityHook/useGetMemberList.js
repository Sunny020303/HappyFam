import { useQuery, useQueryClient } from "react-query";
import supabase from "../../app/supabase";

const getMemberList = async (activity_id) =>{
    let { data: activity , error } = await supabase
        .from('activity_member')
        .select("id, profiles(id, first_name, last_name, avatar)")
        .eq('id_activity',activity_id);
        
    if (error) {
        throw new Error(error.message);
    }
    if(!activity){
        throw new Error("Members not found")
    }
    return activity;
}

export default function userGetMemberList(activity_id) {
    return useQuery("MemberList", ()=> getMemberList(activity_id))
}


