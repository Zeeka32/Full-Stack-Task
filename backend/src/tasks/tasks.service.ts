import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from '../schemas/tasks.schema';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    ) {}

    async findAllByUser(userId: string): Promise<Task[]> {
        return this.taskModel.find({ user: userId }).exec();
    }

    async create(task: Task): Promise<Task> {
        const createdTask = new this.taskModel(task);
        return createdTask.save();
    }

    async findByTitle(title: string, userId: string): Promise<Task[]> {
        return this.taskModel.find({ title: new RegExp(title, 'i'), user: userId }).exec();
    }

    async update(task: Task, userId: string): Promise<Task> {
        const existingTask = await this.taskModel.findOne({ _id: task._id, user: userId });
        
        if (!existingTask) {
            throw new NotFoundException('Task not found or you do not have permission to update this task');
        }
        
        task.timeSpent = existingTask.timeSpent;

        if (task.status === 'Active' && existingTask.status !== "Active") {
            task.startTime = new Date();
        } else if (existingTask.status === 'Active' && (task.status === 'Onhold' || task.status === 'Finished')) {
            const endTime = new Date();
            const elapsedTime = (endTime.getTime() - new Date(existingTask.startTime).getTime()) / 1000;
            task.timeSpent += elapsedTime;
        }
    
        const updatedTask = await this.taskModel.findOneAndUpdate(
            { _id: task._id, user: userId },
            task,
            { new: true },
        );
        return updatedTask;
    }

    async returnSpentTime(id: string, userId: string): Promise<number> {
        const task = await this.taskModel.findById(id);
        
        if (!task || task.user._id !== userId) {
            throw new NotFoundException('Task not found or you do not have permission to update this task');
        }

        return task.timeSpent;
    }

    async delete(id: string, userId: string): Promise<Task> {
        return this.taskModel.findOneAndDelete({ _id: id, user: userId }).exec();
    }
}
