"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const tasks_schema_1 = require("../schemas/tasks.schema");
const mongoose_2 = require("mongoose");
let TasksService = class TasksService {
    constructor(taskModel) {
        this.taskModel = taskModel;
    }
    async findAllByUser(userId) {
        return this.taskModel.find({ user: userId }).exec();
    }
    async create(task) {
        const createdTask = new this.taskModel(task);
        return createdTask.save();
    }
    async findByTitle(title, userId) {
        return this.taskModel.find({ title: new RegExp(title, 'i'), user: userId }).exec();
    }
    async update(task, userId) {
        const existingTask = await this.taskModel.findOne({ _id: task._id, user: userId });
        task.timeSpent = existingTask.timeSpent;
        if (!existingTask) {
            throw new common_1.NotFoundException('Task not found or you do not have permission to update this task');
        }
        if (existingTask.status === 'created' && task.status === 'started') {
            task.startTime = new Date();
        }
        else if (existingTask.status === 'started' && (task.status === 'onhold' || task.status === 'finished')) {
            const endTime = new Date();
            const elapsedTime = (endTime.getTime() - new Date(existingTask.startTime).getTime()) / 1000;
            task.timeSpent += elapsedTime;
        }
        const updatedTask = await this.taskModel.findOneAndUpdate({ _id: task._id, user: userId }, task, { new: true });
        return updatedTask;
    }
    async returnSpentTime(id) {
        const task = await this.taskModel.findById(id);
        return task.timeSpent;
    }
    async delete(id, userId) {
        return this.taskModel.findOneAndDelete({ _id: id, user: userId }).exec();
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tasks_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map