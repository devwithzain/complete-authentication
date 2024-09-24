export const getAccountByUserId = async (userId: string) => {
   try {
      const getUserAccount = await prisma?.account.findFirst({
         where: {
            userId
         },
      });
      return getUserAccount;
   } catch (error) {
      return null;
   }
};