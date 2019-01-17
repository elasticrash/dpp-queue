import * as http from 'http';

(async () => {
    console.log("starting test");
    setInterval(() => {
        const msg = Math.random().toString(36).substring(7);
        console.log(`publishing message ${msg}`);
        request(`/?name=primary&message=${msg}`);
    }, 20);

    setTimeout(() => {
        setInterval(async () => {
            const msg: any = await request(`/?name=primary`);
            console.log(`requested message ${msg.object}`);
        }, 15);
    }, 70);
})();


function request(url: string) {

    const options = {
        host: 'localhost',
        path: url,
        port: '3000',
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        const request = http.request(options, (response) => {
            let str = '';
            response.on('data', (chunk) => {
                str += chunk;
            });

            response.on('end', () => {
                resolve({ request: response, object: str });
            });

            response.on('error', (error) => {
                reject(error);
            });
        });

        request.write('');
        request.end();
    });
}