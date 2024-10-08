import { useWriteContract } from 'wagmi'
import { TIR_ABI } from '../../abis/tir.abi'
import { TIR } from '../../addresses'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Address } from 'viem'

export const useRemoveOperator = () => {
    const queryClient = useQueryClient()
    const { writeContractAsync } = useWriteContract()

    const mutation = useMutation({
        mutationFn: async (
            variables: {
                userAddress: string | undefined,
            }) => {
            if (!variables.userAddress) {
                throw new Error("No User")
            }

            try {
                const wc = await writeContractAsync({
                    abi: TIR_ABI,
                    address: TIR,
                    functionName: 'removeOperator',
                    args: [
                        variables.userAddress as Address,
                    ],
                })
            } catch (error) {
                console.error(error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    return mutation
}
