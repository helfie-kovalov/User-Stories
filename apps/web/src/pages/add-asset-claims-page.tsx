import { Button, Checkbox, Input, Stack, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr, Container, Flex, Select } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import { useGetAsset } from "../hooks/api/assets/use-get-asset"
import { UserComponent } from "../components/user-component"
import { useState } from "react"
import { HeaderComponent } from "../components/header-component"
import { HeaderImage } from "../components/image-component"
import { useGetClaimTopics } from "../hooks/blockchain/claims/use-bc-get-claim-topics"
import { zeroAddress } from "viem"
import { EditDocComponent } from "../components/edit-doc-component"
import { useGetTokenClaims } from "../hooks/api/token-claims/use-get-token-claims"
import { useCreateTokenClaim } from "../hooks/api/token-claims/use-create-token-claim"
import { useGetUser } from "../hooks/api/users/use-get-user"
import { useParams } from "react-router-dom"

export const AddAssetClaimsPage = () => {
    const { address } = useAccount()
    const { tokenAddress } = useParams()
    const { isLoadingUser, userData } = useGetUser(address?.toString() ?? zeroAddress)
    const { isPendingAsset, assetData } = useGetAsset(tokenAddress?.toString() ?? zeroAddress)
    const { isPendingTokenClaims, tokenClaimsData } = useGetTokenClaims(tokenAddress?.toString())
    const { claimTopicsData } = useGetClaimTopics()
    const [inputClaimTopic, setClaimTopic] = useState('');
    const [inputDoc, setInputDoc] = useState<File | null>(null);

    const mutation = useCreateTokenClaim()

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        <TableContainer>
            <Table variant='simple'>
                <TableCaption placement="top">Claim Topics</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Token Address</Th>
                        <Th isNumeric>Claim Topic</Th>
                        <Th>Document</Th>
                        <Th>Verified</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {tokenClaimsData?.map((element: any) => {
                        return (
                            <Tr key={`${element?.claimTokenKey}`} justifyContent={'center'}>
                                <Td>{element?.tokenAddress}</Td>
                                <Td isNumeric>{element?.claimTopic}</Td>
                                <Td w={'25%'} justifyContent={'center'} justifyItems={'center'}>
                                    <HeaderImage claimTopic={element?.claimTopic} randomStr={element?.randomStr} />
                                </Td>
                                <Td>
                                    <Checkbox isChecked={element?.isClaimVerified} disabled></Checkbox>
                                </Td>
                                <Td w={'25%'}>
                                    {
                                        !element?.isClaimVerified && 
                                            <EditDocComponent 
                                                senderAddress={address?.toString() ?? zeroAddress}
                                                address={element?.tokenAddress?.toString() ?? zeroAddress}
                                                claimTopic={element?.claimTopic ?? 0}
                                                isToken={true}/>
                                    }
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>

        <Flex w={'100%'} justifyContent={'center'} margin={'30px'}>
            <Stack spacing={3} w={'100%'} maxW={'2xl'}>
                <Select placeholder='Claim Topic' onChange={(e) => {
                    if (e.target.value !== '') {
                        setClaimTopic(e.target.value)
                    }
                }}>
                    {
                        claimTopicsData.map((element: any) => {
                            return (
                                <option value={element}>
                                    {element}
                                </option>
                            )
                        })
                    }
                </Select>
                <Input placeholder='Document' type="file" onChange={(e) => { if (e.target.files) { setInputDoc(e.target.files[0]); } }} />
                <Button colorScheme='blue' isDisabled={assetData?.isVerified && inputClaimTopic !== ''} onClick={() => {
                    if (!assetData?.isVerified && inputClaimTopic !== '') {
                        mutation.mutate({
                            senderAddress: address?.toString(),
                            tokenAddress: assetData.tokenAddress?.toString(),
                            claimTopic: inputClaimTopic,
                            docgen: inputDoc,
                        })
                        setClaimTopic('')
                        setInputDoc(null)
                    }
                }}>
                    Add Claim Topic
                </Button>
            </Stack>
        </Flex>
    </Container>
}