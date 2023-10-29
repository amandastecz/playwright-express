import { expect, test } from '@playwright/test';
import { TaskModel } from './fixtures/task.model';
import { createTask, deleteTask } from './support/helpers';
import { TasksPage } from './support/pages/tasks';
import input from './fixtures/tasks.json';
import { faker } from '@faker-js/faker';

let taskPage: TasksPage;

test.beforeEach(({ page }) => {
    taskPage = new TasksPage(page);
})

test.describe('cadastro', () => {
    test('deve poder cadastrar uma nova tarefa', async ({ request }) => {
        const task: TaskModel = {
            name: faker.hacker.phrase(),
            is_done: false
        };
        await deleteTask(request, task.name);
        await taskPage.go();
        await taskPage.create(task);
        await taskPage.shouldHaveText(task.name);
        await taskPage.alertNotBeVisible();
    });

    test('não deve permitir tarefa duplicada', async ({ request }) => {
        const task: TaskModel = {
            name: faker.hacker.phrase(),
            is_done: false
        };
        await deleteTask(request, task.name);
        await createTask(request, task);
        await taskPage.go();
        await taskPage.create(task);
        await taskPage.alertHaveText('Task already exists!');
    });

    test('campo obrigatório', async () => {
        const task: TaskModel = input.required;
        await taskPage.go();
        await taskPage.create(task);
        const validationMessage = await taskPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage);
        expect(validationMessage).toEqual('This is a required field');

    });
});

test.describe('atualização', () => {
    test('deve concluir uma tarefa', async ({ request }) => {
        const task: TaskModel = {
            name: faker.hacker.phrase(),
            is_done: false
        };
        await deleteTask(request, task.name);
        await createTask(request, task);
        await taskPage.go();
        await taskPage.toggle(task.name);
        await taskPage.shouldToggleBeDone(task.name);
    });
});

test.describe('exclusão', () => {
    test('deve excluir uma tarefa', async ({ request }) => {
        const task: TaskModel = {
            name: faker.hacker.phrase(),
            is_done: false
        };
        await deleteTask(request, task.name);
        await createTask(request, task);
        await taskPage.go();
        await taskPage.delete(task.name);
        await taskPage.shouldNotExist(task.name);
    });
});