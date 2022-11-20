import * as status from 'statuses';

export function success(code: number, data?: any): Response {
    if (status.empty[code]) return new Response(null, {status: code});
    return new Response(JSON.stringify({
        success: true,
        code,
        message: status.message[code],
        data: data
    }), {
        status: code,
        headers: {
            'content-type': 'application/json',
        },
    });
}

export function error(code: number, error?: any): Response {
    return new Response(JSON.stringify({
        success: false,
        code,
        message: status.message[code],
        error
    }), {
        status: code,
        headers: {
            'content-type': 'application/json',
        },
    });
}