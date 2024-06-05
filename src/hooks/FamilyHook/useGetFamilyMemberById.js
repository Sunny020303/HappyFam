import { useQuery, useQueryClient } from "react-query";
import supabase from "../../app/supabase";

const getFamilyMemberById = async (id_family) =>{
    let { family , error } = await supabase
        .from('family_member')
        .select(`
            profile(id,first_name,last_name,avatar),
        `)
        .eq("id_family",id_family)
        
    if (error) {
        throw new Error(error.message);
    }
    if(!family){
        throw new Error("Family not found")
    }
    return family;
}

export default function userGetFamilyMemberById(id_family) {
    return useQuery("Family", ()=> getFamilyMemberById(id_family))
}


