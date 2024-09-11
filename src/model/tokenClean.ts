import { SomeModel } from '../schema/auth';
import { badData } from '@hapi/boom';

export const tokenClean = async () => {
  const allTokens = await SomeModel.find({}).exec();

  allTokens.forEach(async el => {
    if((Number(el.exp) - new Date().getTime()) < 0){
      const query = { _id: el.id };
      const result = await SomeModel.deleteOne(query);

      if (result && result.deletedCount) {
        return Promise.resolve(`Successfully updated auth with id ${el.id}`);
    } else if (!result) {
        return Promise.reject(badData(`Failed to remove auth with id ${el.id}`));
    } else if (!result.deletedCount) {
        return Promise.reject(badData(`auth with id ${el.id} does not exist`));
    }
    }
  });

  setTimeout(() => {
    tokenClean();
  }, 120000);
};
