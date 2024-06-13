import { useQuery } from "react-query";
import supabase from "../../app/supabase";

const getActivityList = async (family_id, date) => {
    //let begin = new Date(date);
    //let end = new Date(date);
    //begin.setDate(begin.getDate() - 31);
    //end.setDate(end.getDate() + 31);


    let { data: activity, error } = await supabase
        .from('activity')
        .select('*')
        .eq("id_family", family_id)
        //.gte("start", begin.toISOString())
        //.lte("start", end.toISOString())

    if (error) {
        throw new Error(error.message);
    }
    if (!activity) {
        throw new Error("Activity list not found")
    }
    return activity;
}

export default function userGetActivityList(family_id, date) {
    return useQuery("ActivityList", () => getActivityList(family_id, date))
}


