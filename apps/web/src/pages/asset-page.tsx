import { Button, Checkbox, Text, Stack, Table, Image, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Container, Flex, useDisclosure, Input } from "@chakra-ui/react"
import { ObligationModal } from "../components/obligation-modal";
import { UserComponent } from "../components/user-component";
import { useAccount } from "wagmi";
import { useGetUser } from "../hooks/users/use-get-user";
import { useGetUserAssets } from "../hooks/assets/use-get-user-assets";
import { useState } from "react";
import { useCreateAsset } from "../hooks/assets/use-create-asset";
import { HeaderComponent } from "../components/header-component";
import { useDeleteObligation } from "../hooks/obligations/use-delete-obligation";

export const AssetPage = () => {
    const { isOpen, onOpen, onClose, } = useDisclosure();

    const { address } = useAccount()
    const { isPendingUser, userData } = useGetUser(address?.toString())
    const { isPendingUserAssets, userAssetsData } = useGetUserAssets(address?.toString(), 'true')

    const [inputName, setInputName] = useState('');
    const [inputType, setInputType] = useState('');
    const [inputDescription, setInputDescription] = useState('');

    const createAssetMutation = useCreateAsset();
    const deleteObligationMutation = useDeleteObligation();

    return <Container maxW={'8xl'} w={'100%'}>
        <HeaderComponent userData={userData} />
        <UserComponent userData={userData} />
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>User Assets</TableCaption>
                <Thead>
                    <Tr>
                        <Th isNumeric>Asset id</Th>
                        <Th>User Address</Th>
                        <Th>Name</Th>
                        <Th>Desciption</Th>
                        <Th>Type</Th>
                        <Th>Sell</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {userAssetsData?.map((element: any) => {
                        return (
                            <Tr key={`${element.id}`}>
                                <Td>{element?.id}</Td>
                                <Td>{element?.userAddress}</Td>
                                <Td>{element?.name}</Td>
                                <Td>{element?.description}</Td>
                                <Td>{element?.type}</Td>
                                <Td>
                                    <ObligationModal key={`${element.id}-${element?.userAddress}`}
                                        isOpen={isOpen} onClose={onClose}
                                        assetId={element?.id} userAddress={element?.userAddress} />

                                    <Stack direction={"row"}>
                                        <Button colorScheme='yellow' size='sm' onClick={onOpen}>
                                            {!element.obligationId ? 'Create obligation' : 'Edit obligation'}
                                        </Button>
                                        {
                                            element.obligationId
                                                ?
                                                <Button colorScheme='red' size='sm' onClick={() => {
                                                    deleteObligationMutation.mutate({
                                                        assetId: element?.id,
                                                        userAddress: element?.userAddress,
                                                        obligationId: element?.obligationId
                                                    })
                                                }}>
                                                    Delete Obligation
                                                </Button>
                                                : <></>
                                        }
                                    </Stack>
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>
        <Flex w={'100%'} justifyContent={'center'}>
            <Stack spacing={3} maxW={'2xl'}>
                <Input placeholder='Name' value={inputName} onChange={(e) => setInputName(e.target.value)} />
                <Input placeholder='Description' value={inputDescription} onChange={(e) => setInputDescription(e.target.value)} />
                <Input placeholder='Type' value={inputType} onChange={(e) => setInputType(e.target.value)} />

                <Button colorScheme='blue' onClick={() => {
                    setInputName('')
                    setInputType('')
                    setInputDescription('')
                    createAssetMutation.mutate({
                        userAddress: address?.toString(),
                        name: inputName,
                        description: inputDescription,
                        type: inputType,
                    })
                }}
                >
                    Mint Asset
                </Button>
            </Stack>
        </Flex>
    </Container>
}