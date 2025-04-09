import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import * as fs from 'fs/promises';
import { Create } from '../utils'

@Injectable()
@Command('gen:app {name}', { desc: 'Command to generate boilerplate friendly app' })
export class GenApp {
    public async handle(_cli: ConsoleIO): Promise<void> {
        const appName = _cli.argument<string>('name');
        const nestCliPath = './nest-cli.json';
        const nestCliContent = await fs.readFile(nestCliPath, 'utf8');
        const nestCliJson: { projects: Record<string, any>; root: string; sourceRoot: string, compilerOptions:Record<string, any>, monorepo:Boolean } = JSON.parse(nestCliContent);
        if (nestCliJson.monorepo)
            await Create.app(appName, _cli);
        else{
            _cli.error('This command can only be run in monorepo mode');
            _cli.info(`Hint: Run "node cli convert:monoRepo ${appName}" to convert to monorepo mode`);
        }
    }
};