import { APIRequestContext, expect } from "@playwright/test";
import { TaskModel } from "../fixtures/task.model";
require('dotenv').config();
const BASE_API = process.env.BASE_API;

export async function deleteTask(request: APIRequestContext, taskName: string): Promise<void> {
    const response = await request.delete(`${BASE_API}/helper/tasks/${taskName}`);
    await expect(response.ok()).toBeTruthy();
}

export async function createTask(request: APIRequestContext, task: TaskModel): Promise<void> {
    const response = await request.post(`${BASE_API}/tasks`, {
        data: task
    });
    await expect(response.ok()).toBeTruthy();
}