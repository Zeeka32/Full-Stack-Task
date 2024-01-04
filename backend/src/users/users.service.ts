import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async validatePassword(username: string, password: string): Promise<boolean> {
    const user = await this.findOne(username);
    if (user && await bcrypt.compare(password, user.password)) {
      return true;
    }
    return false;
  }

  async create(username: string, password: string): Promise<User> {
    const createdUser = new this.userModel({ username, password: bcrypt.hashSync(password, 10) });
    return createdUser.save();
  }
  
}