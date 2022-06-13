import { Service } from './Service';
export declare class Exec extends Service {
    run(command: string, args: string[]): Promise<{
        exitCode: number;
        stdout: string;
        stderr: string;
    }>;
    start(command: string, args: string[]): Promise<{
        pid: number;
    }>;
    stop(pid: number, kill?: boolean): Promise<{
        exitCode: number;
        stdout: string;
        stderr: string;
    }>;
}
