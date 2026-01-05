/**
 * Recursively copy a directory
 */
export declare function copyDirectory(src: string, dest: string): Promise<void>;
/**
 * Copy and process source files, replacing package names
 */
export declare function copyAndProcessSourceFiles(srcDir: string, destDir: string, packageName: string, templatePackages?: string[]): Promise<void>;
