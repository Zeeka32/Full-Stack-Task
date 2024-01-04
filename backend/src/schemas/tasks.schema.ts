import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../schemas/users.schema';

export type TaskDocument = Task & Document;

@Schema()
export class Task {

  _id?: Document['_id'];

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: 'created' })
  status: string;

  @Prop({ required: true, default: 0 })
  timeSpent?: number;

  @Prop({ type: Date, default: null })
  startTime?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user?: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);