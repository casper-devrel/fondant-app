import { useEffect, useState } from "react";
import { useSearchContext } from "../../context/SearchContext";
import { Helmet } from "react-helmet-async";
import { Flex, VStack, Text, Progress, Box } from "@chakra-ui/react";
import AccountRowElement from "../molecules/account-row-element";
import axios from "axios";

type AccountData = {
  publicKey: string;
  privateKey: string;
};

const Accounts = () => {
  const { searchValue } = useSearchContext();
  const [accountsData, setAccountsData] = useState<AccountData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccountsData = async () => {
      setIsLoading(true);
      let fetchedAccounts: AccountData[] = [];
      for (let i = 1; i <= 10; i++) {
        try {
          const response = await axios.get(
            `http://localhost:3001/user-keys/${i}`
          );
          fetchedAccounts.push({
            publicKey: response.data.public_key,
            privateKey: response.data.private_key,
          });
        } catch (error) {
          console.error(`Error fetching data for user ${i}:`, error);
        }
      }
      setAccountsData(fetchedAccounts);
      setIsLoading(false);
    };

    fetchAccountsData();
  }, []);

  const filteredAccounts = accountsData.filter(
    (account) =>
      account.publicKey
        .toLowerCase()
        .includes(searchValue.toLowerCase().trim()) ||
      account.privateKey
        .toLowerCase()
        .includes(searchValue.toLowerCase().trim())
  );

  if (isLoading) {
    return (
      <Flex
        justifyContent="center"
        height="calc(100vh - 148px)"
        alignItems="center"
      >
        <Progress
          size="lg"
          rounded={50}
          isIndeterminate
          width="100%"
          maxWidth="1440px"
          justifySelf="center"
          alignSelf="center"
          alignContent="center"
        />
      </Flex>
    );
  }

  return (
    <>
      <Helmet>
        <title>Fondant | Accounts</title>
      </Helmet>
      <Flex w="100%" justify="center">
        <VStack w="100%" maxW="1440px" gap="0" mt="16px">
          {filteredAccounts ? (
            filteredAccounts.map((account, index) => (
              <AccountRowElement
                key={index}
                publicKey={account.publicKey}
                privateKey={account.privateKey}
              />
            ))
          ) : (
            <Flex w="100%" justify="center" pt="100px">
              <Text color="grey.400">No accounts available to display.</Text>
            </Flex>
          )}
        </VStack>
      </Flex>
    </>
  );
};

export default Accounts;
