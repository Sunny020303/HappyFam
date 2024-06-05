import { useMutation, useQueryClient } from "react-query";
import supabase from "../../app/supabase";
import { v4 as uuidv4 } from "uuid";
import picture from "../../images/activity.jpg"
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
const createActivity = async (activity, id_activity) => {



    if (!id_activity) {
        if (activity.image == null) {
            const { data, error } = await supabase
                .from('activity')
                .insert({
                    title: activity.title,
                    start: activity.start,
                    end: activity.end,
                    repeat: activity.repeat,
                    remind: activity.remind,
                    id_family: activity.id_family,
                    id_member: activity.id_member,
                    location: activity.location,
                    note: activity.note,
                    image: "No image",
                })
                .select()
            if (error) {
                throw error;
            }
            return data;

        } else {
            // var formData = new FormData();
            // formData.append("Image", {
            //     uri: activity.image,
            //     name: "Activity",
            //     type: "image/png",
            // });
            const base64 = await FileSystem.readAsStringAsync(activity.image, { encoding: 'base64' });
            //const contentType = activity.image.type === 'image' ? 'image/png' : 'video/mp4';
            //console.log(base64);
            //const contentType = 'image/png';
            const { data, error } = await supabase
                .from('activity')
                .insert({
                    title: activity.title,
                    start: activity.start,
                    end: activity.end,
                    repeat: activity.repeat,
                    remind: activity.remind,
                    id_family: activity.id_family,
                    id_member: activity.id_member,
                    location: activity.location,
                    note: activity.note,
                })
                .select()

            const id = data ? data[0].id : undefined;
            //console.log(id);
            //
            //console.log("This is the picture")
            //console.log(activity.image);
            await supabase.storage.from('activityPics').upload(`public/${id}.png`, decode(base64), {
                contentType: 'image/png'
            });

            const { data2, updateError } = await supabase
                .from('activity')
                .update({
                    image:
                        'https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/' +
                        id +
                        '.png'
                })
                .eq('id', id)
                .select();

           


            if (error) {
                throw error;
            }
            return data2;
        }

    }
    return data;

}

export default function useCreateActivity(activity, id_activity) {
    return useMutation(() => createActivity(activity, id_activity));
} 