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

            const listMember = []
            activity.id_member.map((i) => {
                listMember.push({ id_activity: data ? data[0].id : undefined, id_member: i })
            });

            const { data1, error1 } = await supabase
                .from('activity_member')
                .insert(
                    listMember
                )
                .select();

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

            const listMember = []
            activity.id_member.map((i) => {
                listMember.push({ id_activity: id, id_member: i })
            });

            const { data1, error1 } = await supabase
                .from('activity_member')
                .insert(
                    listMember
                )
                .select();

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

    } else {
        if (activity.image == null) {
            const { data, error } = await supabase
                .from('activity')
                .upsert({
                    id: id_activity,
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
                .select();

            const { error2 } = await supabase.from('activity_member').delete().eq('id_activity', id_activity);

            if (error2) {
                throw error2;
            }
            const listMember = []
            activity.id_member.map((i) => {
                listMember.push({ id_activity: id_activity, id_member: i })
            });

            const { data1, error1 } = await supabase
                .from('activity_member')
                .insert(
                    listMember
                )
                .select();

            if (error) {
                throw error;
            }
            return data;
        } else {
            const base64 = await FileSystem.readAsStringAsync(activity.image, { encoding: 'base64' });

            const { data: img, error: imageError } = await supabase.storage.from('activityPics').upload(`public/${id_activity}.png`, decode(base64), {
                upsert: true,
                contentType: 'image/png',
            });

            if (imageError) {
                throw imageError;
            }
            const { data, error } = await supabase
                .from('activity')
                .upsert({
                    id: id_activity,
                    title: activity.title,
                    start: activity.start,
                    end: activity.end,
                    repeat: activity.repeat,
                    remind: activity.remind,
                    id_family: activity.id_family,
                    id_member: activity.id_member,
                    location: activity.location,
                    note: activity.note,
                    image: 'https://kjaxnzwdduwomszumzbf.supabase.co/storage/v1/object/public/activityPics/public/' + id_activity + '.png'
                })
                .select();

            const { error2 } = await supabase.from('activity_member').delete().eq('id_activity', id_activity);
            if (error2) {
                throw error2;
            }
            const listMember = []
            activity.id_member.map((i) => {
                listMember.push({ id_activity: id_activity, id_member: i })
            });

            const { data1, error1 } = await supabase
                .from('activity_member')
                .insert(
                    listMember
                )
                .select();
            if (error) {
                throw error;
            }
            return data;

        }
    }

}

export default function useCreateActivity(activity, id_activity) {
    return useMutation(() => createActivity(activity, id_activity));
} 