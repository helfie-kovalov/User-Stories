import { usePublicClient, useReadContract } from "wagmi"
import { DVD } from "../../../addresses"
import { DVD_ABI } from "apps/web/src/abis/dvd.abi"
import { Address, parseUnits } from "viem"
import { TOKEN_ABI } from "apps/web/src/abis/token.abi"

export const useBcGetBuyerPrice = (
    sellerToken: string,
    sellerAmount: number) => {
    const sellerTokenDecimals = useReadContract({
        abi: TOKEN_ABI,
        address: sellerToken as Address,
        functionName: 'decimals',
        args: [],
    })
    const decimalsData: number = sellerTokenDecimals?.data as number ?? 6
    const result = useReadContract({
        abi: DVD_ABI,
        address: DVD,
        functionName: 'evaluateBuyerPrice',
        args: [
            sellerToken as Address,
            parseUnits(sellerAmount.toString(), decimalsData)
        ]
    })
    const resultData: bigint = result?.data as bigint
    if (!resultData) {
        return { buyerPriceData: BigInt(0) }
    } else {
        return { buyerPriceData: result.data }
    }
}