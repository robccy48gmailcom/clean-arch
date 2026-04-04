import readline from 'node:readline';
import { services } from '../../config';
import { ScriptsController } from '../../controllers';
import { IError } from '../../interfaces';
import { CreateUser } from '../../use-cases/user';
import { User } from '../../entities';

const consoleReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function getInput(prompt: string): Promise<string> {
  return new Promise<string>((resolve) => {
    consoleReader.question(prompt, (answer: string) => {
      resolve(answer);
    });
  });
}
const createUser = new CreateUser(
  services.user.validators.create,
  new services.user.DAO(),
  services.utils.encryptPassword,
);
const controller = new ScriptsController(createUser);

const commands: Record<string, () => Promise<unknown>> = {
  'create-admin': async () => {
    try {
      const body = {
        email: await getInput('Enter Admin email address: '),
        password: await getInput('Create Admin password: '), //qwe123
      };
      consoleReader.close();

      const admin: User = await controller.createAdmin({ body });
      console.log('Admin Created!');
      console.log(`You can now login with: ${admin.email}`);
    } catch (error) {
      const err = error as IError & Error;
      const name = err?.name ?? 'Error';
      const message =
        err?.message ??
        (typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message: unknown }).message)
          : String(error));
      console.error(`${name}: ${message}`);
      if (err?.details) {
        console.error(err.details);
      }
      if (process.env.DEBUG && error instanceof Error && error.stack) {
        console.error(error.stack);
      }
    }
  },
};

const cli = async () => {
  const availableCommands = Object.keys(commands).join(', ');
  const commandName = process.argv[2];

  if (!commandName && typeof commandName !== 'string') {
    console.error(
      `Please choose one of the following commands: ${availableCommands}`,
    );
    process.exit();
  }
  if (!commands[commandName]) {
    console.error(
      `Don't know how to handle command: ${commandName}. Supported commands: ${availableCommands}`,
    );
    process.exit();
  }

  await commands[commandName]();
  process.exit();
};

export default cli;
