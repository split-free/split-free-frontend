import {supabase} from "@/src/lib/supabase";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";


export const useExpenseList = (group_id: number) => {
  return useQuery({
    queryKey: ['expenses', group_id],
    queryFn: async () => {
      const {data, error} = await supabase
        .from('expenses')
        .select('id, title, amount, created_at, group_id, balances(amount, owner)')
        .eq('group_id', group_id);
      if (error) {
        console.log(error.message);
        throw new Error(error.message);
      }
      // console.log("Expense data is ", data);
      return data;
    },
  });
};

export const useExpense = (id: number) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      const {data: [expense], error} = await supabase
        .rpc('use_expense', {
          expense_id_input: id
        });
      if (error) {
        console.log("error is ", error.message);
        throw new Error(error.message);
      }
      // console.log("expense is ", expense);
      return expense;
    }
  });
};

export const useInsertExpense = (group_id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data) {
      const {data: newExpenseID, error} = await supabase
        .rpc('create_expense', {
          amount_input: data.amount,
          currency_input: data.currency,
          date_input: data.date,
          description_input: data.description,
          group_id_input: data.group_id,
          participants_input: data.participants,
          payers_input: data.payers,
          proof_input: data.proof,
          title_input: data.title,
        });
      if (error) {
        console.error('Error during insertion:', error.message);
        throw new Error(error.message);
      }
      console.log('New expense inserted:', newExpenseID);
      return newExpenseID;
    },
    async onSuccess() {
      await queryClient.invalidateQueries(['group', group_id]);
      await queryClient.invalidateQueries(['expenses', group_id]);
      await queryClient.invalidateQueries(['groups']);
    }
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data) {
      const {data: newExpense, error} = await supabase
        .rpc('update_expense', {
          expense_id: data.id,
          amount_input: data.amount,
          currency_input: data.currency,
          date_input: data.date,
          description_input: data.description,
          participants_input: data.participants,
          payers_input: data.payers,
          proof_input: data.proof,
          title_input: data.title
        });
      if (error) {
        console.error('Error during update:', error.message);
        throw new Error(error.message);
      }
      // console.log('Expense is updated:', newExpense);
      return newExpense;
    },
    async onSuccess(_, {id, group_id}) {
      await queryClient.invalidateQueries(['group', group_id]);
      await queryClient.invalidateQueries(['expense', id]);
      await queryClient.invalidateQueries(['expenses', group_id]);
    }
  });
};

export const useDeleteExpense = (group_id: bigint) => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(id: bigint) {
      const {error} = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error during deletion:', error.message);
        throw new Error(error.message);
      }
      // console.log('Expense is deleted');
      return id;
    },
    async onSuccess(id) {
      await queryClient.invalidateQueries(['group', group_id]);
      await queryClient.invalidateQueries(['expenses', group_id]);
      await queryClient.invalidateQueries(['expense', id]);
      await queryClient.invalidateQueries(['groups']);
    }
  });
};
