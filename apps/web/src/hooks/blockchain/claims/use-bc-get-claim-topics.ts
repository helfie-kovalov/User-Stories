import { useReadContract } from "wagmi"
import { CTR_ABI } from "../../../abis/ctr.abi"
import { CTR } from "../../../addresses"
import { getClaimTopicName } from "../../../functions"

const CLAIM_TOPICS = [1, 2, 3, 4, 5, 6, 7]

export const useBcGetClaimTopics = () => {
    const result = useReadContract({
        abi: CTR_ABI,
        address: CTR,
        functionName: 'getClaimTopics',
    })
    const resultData: bigint[] = result?.data as bigint[]
    const data = !resultData ? CLAIM_TOPICS : resultData.sort();
    const parsedData = data.map(el => {
        const claimTopic = {
            value: el,
            name: getClaimTopicName(el)
        }
        return claimTopic
    });
    return { claimTopicsData: parsedData };
}