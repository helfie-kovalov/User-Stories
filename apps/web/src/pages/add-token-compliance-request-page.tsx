import { Button, Checkbox, Input, Stack, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Container, Flex, Select } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import { useGetAsset } from "../hooks/api/assets/use-get-asset"
import { UserComponent } from "../components/user-component"
import { useState } from "react"
import { HeaderComponent } from "../components/header-component"
import { zeroAddress } from "viem"
import { useGetUser } from "../hooks/api/users/use-get-user"
import { useParams } from "react-router-dom"
import { getStatusName } from "../functions"
import { useGetTokenComplianceRequestsTokenUser } from "../hooks/api/token-compliance-request/use-get-token-compliance-requests-token-user"
import { useCreateTokenComplianceRequest } from "../hooks/api/token-compliance-request/use-create-token-compliance-request"
import { useGetIsProcessingTokenComplianceRequest } from "../hooks/api/token-compliance-request/use-get-is-processing-token-compliance-request"

export const AddTokenComplianceRequestPage = () => {
    const { address } = useAccount()
    const { tokenAddress, userAddress } = useParams()
    const { isLoadingUser, userData } = useGetUser(address?.toString() ?? zeroAddress)
    const { isPendingAsset, assetData } = useGetAsset(tokenAddress?.toString() ?? zeroAddress)
    const { isPendingRequest, requestsData } = useGetTokenComplianceRequestsTokenUser(tokenAddress ?? zeroAddress, userAddress ?? zeroAddress)
    const { isPendingIsProcessing, isProcessingData } = useGetIsProcessingTokenComplianceRequest(tokenAddress ?? zeroAddress, userAddress ?? zeroAddress)

    const [inputAmount, setAmount] = useState('');

    const createTokenComplianceRequest = useCreateTokenComplianceRequest();

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        <TableContainer>
            <Table variant='simple'>
                <TableCaption placement="top">Claim Topics</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Token</Th>
                        <Th>User</Th>
                        <Th>Limit Transfer Amount</Th>
                        <Th>Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {requestsData?.map((element: any) => {
                        return (
                            <Tr key={`${element?.id}`} justifyContent={'center'}>
                                <Td>{element?.tokenAddress}</Td>
                                <Td>{element?.userAddress}</Td>
                                <Td>{element?.maxTransferAmount}</Td>
                                <Td>{getStatusName(element?.status)}</Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>

        <Flex w={'100%'} justifyContent={'center'} margin={'30px'}>
            <Stack spacing={3} w={'100%'} maxW={'2xl'}>
                <Input placeholder='Amount' value={inputAmount} onChange={(e) => setAmount(e.target.value)} />
                <Button colorScheme='blue' isDisabled={assetData?.isVerified && inputAmount !== ''} onClick={() => {
                    if (!isProcessingData && inputAmount !== '') {
                        createTokenComplianceRequest.mutate({
                            senderAddress: address?.toString(),
                            tokenAddress: tokenAddress?.toString(),
                            amount: Number(inputAmount),
                            decimals: assetData?.decimals
                        })
                        setAmount('')
                    }
                }}>
                    Add Claim Topic
                </Button>
            </Stack>
        </Flex>
    </Container>
}