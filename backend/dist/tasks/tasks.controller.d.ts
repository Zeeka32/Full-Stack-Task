import { TasksService } from './tasks.service';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    findAllByUser(req: any): Promise<import("../schemas/tasks.schema").Task[]>;
    create(body: {
        title: string;
    }, req: any): Promise<import("../schemas/tasks.schema").Task>;
    findByTitle(body: {
        title: string;
    }, req: any): Promise<import("../schemas/tasks.schema").Task[]>;
    update(body: {
        _id: string;
        status: string;
        title: string;
    }, req: any): Promise<import("../schemas/tasks.schema").Task>;
    returnSpentTime(req: any): Promise<number>;
    delete(body: {
        _id: string;
    }, req: any): Promise<import("../schemas/tasks.schema").Task>;
}
