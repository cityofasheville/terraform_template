import fs from 'fs/promises';

export async function init() {
    try {
        // console.log('!!!');
        const __lib_dir = `${import.meta.dirname}/lib`;
        const deploy_dir = `${process.cwd()}/deploy`;
        // console.log(__lib_dir,deploy_dir)
        await fs.cp(`${__lib_dir}/`, `${deploy_dir}/`, { recursive: true });
        // await fs.copyFile(`${__lib_dir}/example.deploy.yaml`, `${deploy_dir}/example.deploy.yaml`);

    } catch (err) {
        console.log(err);
    }
}

