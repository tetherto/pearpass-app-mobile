import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively copy a directory
 */
export async function copyDirectory(src: string, dest: string): Promise<void> {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Copy and process source files, replacing package names
 */
export async function copyAndProcessSourceFiles(
  srcDir: string,
  destDir: string,
  packageName: string,
  templatePackages: string[] = ['com.noxtton.pearpass', 'com.pears.pass']
): Promise<void> {
  await fs.promises.mkdir(destDir, { recursive: true });
  const files = await fs.promises.readdir(srcDir, { withFileTypes: true });

  for (const file of files) {
    const srcPath = path.join(srcDir, file.name);
    const destPath = path.join(destDir, file.name);

    if (file.isDirectory()) {
      await copyAndProcessSourceFiles(srcPath, destPath, packageName, templatePackages);
    } else if (file.name.endsWith('.java') || file.name.endsWith('.kt')) {
      let content = await fs.promises.readFile(srcPath, 'utf-8');

      for (const templatePackage of templatePackages) {
        const escapeRegex = (s: string) => s.replace(/\./g, '\\.');
        const templateEscaped = escapeRegex(templatePackage);

        // Replace package declarations
        content = content.replace(
          new RegExp(`^package ${templateEscaped}`, 'gm'),
          `package ${packageName}`
        );

        // Replace imports
        content = content.replace(
          new RegExp(`import ${templateEscaped}`, 'g'),
          `import ${packageName}`
        );
      }

      await fs.promises.writeFile(destPath, content);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}
