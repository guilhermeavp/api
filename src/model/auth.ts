import { badRequest } from '@hapi/boom';
import JWT from 'jsonwebtoken';
import aguid from 'aguid';
import axios from 'axios';
import { urls } from '../util/consul';
import { SomeModel } from '../schema/auth';

export class Servico {

  //urlMock = 'http://127.0.0.1:63496';

  async validar(dto: any): Promise<string> {
    const session = {
      username: dto.username,
      roles:['user'], // this will be set to false when the person logs out
      _id: aguid(), // a random session id
      exp: new Date().getTime() + 30 * 60 * 1000, // expires in 30 minutes time
      __v: 0,
      iat: new Date().getTime()
    };
    try {
      await  axios.post(`${urls.get('user')}/valid`, 
        dto
      );
      const token = JWT.sign(session, process.env.SECRET);
      const result = await new SomeModel(session);
      result.save();

      return Promise.resolve(token);
    } catch (error){
      return Promise.reject(badRequest(error.response.data.message));
    }
  }

  async findToken(req: any): Promise<boolean> {
    if((req.exp - new Date().getTime()) < 0){
      return false;
    }
    try {
      const user = await SomeModel.find(req).exec();
      if (user.length) {
         return true;
        }
      return false;
      } catch (error) {
        return false;
      }
  }

  async createUser(req: any): Promise<boolean> {
    try {
      const response = await axios.post(`${urls.get('user')}/`, 
        req
      );
      return Promise.resolve(response.data);
    } catch (error){
      return Promise.reject(badRequest(error.response.data.message));
    }
  }
}
