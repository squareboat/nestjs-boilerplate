import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import { Create } from '../utils'

@Injectable()
@Command('convert:monoRepo {name}', { desc: 'Command to convert boilerplate to monorepo, give 2nd app name as arg' })
export class MakeMonorepo {
    public async handle(_cli: ConsoleIO): Promise<void> {

        const name = _cli.argument<string>('name');

        // run `nest g app user` in console
        const nestCliPath = './nest-cli.json';
        const nestCliContent = await fs.readFile(nestCliPath, 'utf8');
        const nestCliJson: { projects: Record<string, any>; root: string; sourceRoot: string, compilerOptions:Record<string, any>, monorepo: Boolean } = JSON.parse(nestCliContent);
        if (nestCliJson.monorepo) {
            _cli.error('This Project is already in monorepo mode');
            _cli.info(`Hint: Run "node cli gen:app ${name}" to generate app`);
            return;
        }
        await Create.app(name, _cli);
        nestCliJson.root = "apps/control-panel";
        nestCliJson.monorepo = true;
        nestCliJson.sourceRoot = "apps/control-panel/src";
        nestCliJson.projects['control-panel'] = {
            "type": "application",
            "root": "apps/control-panel",
            "entryFile": "main",
            "sourceRoot": "apps/control-panel/src",
            "compilerOptions": {
                "tsConfigPath": "apps/control-panel/tsconfig.app.json"
            }
        };
        nestCliJson.compilerOptions['tsConfigPath'] = "apps/tsconfig.app.json";
        nestCliJson.compilerOptions['webpack'] = false;
        delete nestCliJson.projects['nestjs-boilerplate'];
        await fs.writeFile(nestCliPath, JSON.stringify(nestCliJson, null, 2))
        await fs.rename('apps/nestjs-boilerplate', 'apps/control-panel');
        await fs.rm('apps/control-panel/test', { recursive: true, force: true });
        const tsConfigPath = 'apps/tsconfig.app.json';
        try {
            await fs.access(tsConfigPath);
        } catch {
            await fs.writeFile(tsConfigPath, '');
        }        
        await fs.writeFile('apps/tsconfig.app.json', JSON.stringify({
            "extends": "../tsconfig.json",
            "compilerOptions": {
                "declaration": false,
                "outDir": "../dist"
            },
            "include": ["**/*"],
            "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
        }, null, 2))
        await fs.writeFile('apps/control-panel/tsconfig.app.json', JSON.stringify({
            "extends": "../tsconfig.app.json",
        }, null, 2));
        await new Promise<void>((resolve, reject) => {
            const process = spawn('mv', ['apps/control-panel/src/app.ts', 'apps/control-panel/src/module.ts'], { shell: true });
            process.on('close', code => code === 0 ? resolve() : reject());
        });
        await fs.writeFile('apps/control-panel/src/main.ts', "import { RestServer } from '@libs/boat';\nimport { AppModule } from './module';\nRestServer.make(AppModule, {\n\tport: +process.env.APP_PORT,\n\taddValidationContainer: true\n});");
        let clifile = await fs.readFile('cli', 'utf8');
        clifile = clifile.replace(`const fileName = './dist/src/app';`, `const fileName = './dist/apps/control-panel/src/module';`);
        await fs.writeFile('cli', clifile);
        await fs.rm('apps/control-panel/src/user', { recursive: true, force: true });
        await fs.rm('apps/control-panel/src/transformer', { recursive: true, force: true });
        _cli.success('Monorepo created successfully');
        _cli.success(
            `Enjoy building cool stuff with this boilerplate! 😁`,
        );
    }
}
