import {supabase} from "@/src/lib/supabase";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@/src/providers/AuthProvider";


export const useGroupList = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const {data, error} = await supabase
        .from('groups')
        .select('id, status, title, members(count), expenses(count)');
      if (error) {
        // console.log(error.message);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useGroup = (id: number) => {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: async () => {
      const {data, error} = await supabase
        .from('groups')
        .select('id, title, members(name, role, profile(avatar_url))')
        .eq('id', id)
        .single();
      if (error) {
        console.log(error.message);
        throw new Error(error.message);
      }
      // console.log("data received is ", data);
      return data;
    }
  });
};

export const useInsertGroup = () => {
  const queryClient = useQueryClient();
  const {profile} = useAuth();

  return useMutation({
    async mutationFn(data) {
      // console.log('Data received for insertion:', data);
      const {error, data: newGroup} = await supabase
        .from('groups')
        .insert({
          title: data.title,
          description: data.description,
          owner: profile.id,
        })
        .select()
        .single();
      if (error) {
        console.error('Error during insertion:', error);
        throw new Error(error.message);
      }
      console.log('New group inserted:', newGroup);
      return newGroup;
    },
    async onSuccess() {
      // console.log('Mutation succeeded. Invalidating "groups" query.');
      await queryClient.invalidateQueries(['groups']);
    }
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      const {error, data: updatedGroup} = await supabase
        .from('groups')
        .update(data)
        .eq('id', data.id)
        .select()
        .single();
      if (error) {
        console.error('Error during update:', error);
        throw new Error(error.message);
      }
      console.log("updated group is", updatedGroup);
      return updatedGroup;
    },
    async onSuccess(_, {id}) {
      await queryClient.invalidateQueries(['groups']);
      await queryClient.invalidateQueries(['groups', id]);
    }
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id) {
      const {error} = await supabase
        .from('groups')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error during delete:', error);
        throw new Error(error.message);
      }
      console.log("group is deleted");
      return true;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['groups']);
    }
  });
};
