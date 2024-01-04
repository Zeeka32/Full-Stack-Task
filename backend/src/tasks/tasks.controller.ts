import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @UseGuards(AuthGuard)
    @Get('all')
    async findAllByUser(@Request() req) {
        return this.tasksService.findAllByUser(req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Post('create')
    async create(@Body() body: { title: string }, @Request() req) {
        const task = {
            title: body.title,
            user: req.user.sub,
            status: 'Created',
            timeSpent: 0,
            startTime: null,
        };
        return this.tasksService.create(task);
    }

    @UseGuards(AuthGuard)
    @Post('search')
    async findByTitle(@Body() body: { title: string }, @Request() req) {
        return this.tasksService.findByTitle(body.title, req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Post('update')
    async update(@Body() body: { _id: string, status: string, title: string }, @Request() req) {
        const task = {
            _id: body._id,
            status: body.status,
            title: body.title,
        };
        return this.tasksService.update(task, req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Get('time/:id')
    async returnSpentTime(@Request() req, @Param('id') id: string) {
        return this.tasksService.returnSpentTime(id, req.user._id);
    }

    @UseGuards(AuthGuard)
    @Post('delete')
    async delete(@Body() body: { _id: string }, @Request() req) {
        return this.tasksService.delete(body._id, req.user.sub);
    }
}
