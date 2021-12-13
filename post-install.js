import { request as httpsRequest } from 'https';

function install()
{
    try
    {
        const params = {};

        params['packageName'] = process.env.npm_package_name;
        params['packageVersion'] = process.env.npm_package_version;

        const data = JSON.stringify(params);
        const request = httpsRequest({
            hostname: 'install.nitrots.co',
            port: 443,
            path: '/collect',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        });

        request.write(data);
        request.end();
    }

    catch (e)
    {
        //
    }
}

install();
