import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex, Link, Input, TagLabel, FormControl, FormLabel } from "@chakra-ui/react"
import { UserComponent } from "../components/user-component"
import { useGetUser } from "../hooks/api/users/use-get-user"
import { useAccount } from "wagmi"
import { useGetAllTokenClaims } from "../hooks/api/token-claims/use-get-all-token-claims"
import { env } from "../env"
import { useVerifyTokenClaim } from "../hooks/api/token-claims/use-verify-token-claim"
import { HeaderComponent } from "../components/header-component"
import { useBcCreateClaim } from "../hooks/blockchain/claims/use-bc-create-claim-topics"
import { useBcRemoveClaim } from "../hooks/blockchain/claims/use-bc-remove-claim-topics"

export const AdminAssetClaimPage = () => {
    const { address } = useAccount()
    const { isLoadingUser, userData } = useGetUser(address?.toString())
    const { isPendingTokenClaims, tokenClaimsData } = useGetAllTokenClaims('true')

    const verifyClaim = useVerifyTokenClaim()
    const addClaim = useBcCreateClaim(true)
    const removeClaim = useBcRemoveClaim(true)

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />

        {
            userData?.isAdmin ?
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption placement="top">Claim Topics</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Token Address</Th>
                                <Th>Claim Topic</Th>
                                <Th>Document</Th>
                                <Th>Verified</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tokenClaimsData?.map((element: any) => {
                                return (
                                    <Tr key={`${element?.claimTokenKey}`}>
                                        <Td>
                                            <Stack direction={"row"}>
                                                <Text>{element?.tokenAddress}</Text>
                                                <Checkbox size={'lg'} isChecked={element?.asset.isVerified} disabled />
                                            </Stack>
                                        </Td>
                                        <Td>
                                            <Text>{element?.claimTopic}</Text >
                                        </Td>
                                        <Td>
                                            <Image src={`${env.VITE_API_URL}/token-claims/claim/docgen/${address?.toString()}/${element?.tokenAddress}-${element?.claimTopic}`} alt='Doc' boxSize='75px' />
                                        </Td>
                                        <Td>
                                            {
                                                !element?.asset.isVerified
                                                    ?
                                                    <Button colorScheme={!element?.isClaimVerified ? "green" : "red"} size='sm'
                                                        isDisabled={element?.asset.isVerified || element?.asset?.identityAddress === null} onClick={async () => {
                                                            if (!element?.asset.isVerified && element?.asset?.identityAddress !== null) {
                                                                if (!element?.isClaimVerified) {
                                                                    await addClaim.mutateAsync({
                                                                        senderAddress: address?.toString(),
                                                                        address: element?.tokenAddress,
                                                                        identityAddress: element?.asset?.identityAddress,
                                                                        claimTopic: BigInt(element?.claimTopic)
                                                                    })
                                                                } else {
                                                                    await removeClaim.mutateAsync({
                                                                        address: address?.toString(),
                                                                        identityAddress: element?.asset?.identityAddress,
                                                                        claimTopic: BigInt(element?.claimTopic)
                                                                    })
                                                                }
                                                                await verifyClaim.mutateAsync({
                                                                    senderAddress: address?.toString(),
                                                                    tokenAddress: element?.tokenAddress,
                                                                    claimTopic: Number(element?.claimTopic),
                                                                    verify: !element?.isClaimVerified
                                                                })
                                                            }
                                                        }}>
                                                        {!element?.isClaimVerified ? "Verify" : "Unverify"}
                                                    </Button>
                                                    : <Checkbox size={'lg'} isChecked={element?.asset.isVerified} disabled />
                                            }
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
                : <></>
        }
    </Container>
}