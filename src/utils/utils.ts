import * as status from 'statuses';
import {corsHeaders} from './cors';

export function success(code: number, data?: any): Response {
    if (status.empty[code]) return new Response(null, {status: code, headers: corsHeaders});
    return new Response(JSON.stringify({
        success: true,
        code,
        message: status.message[code],
        data: data
    }), {
        status: code,
        headers: {
            'content-type': 'application/json',
            ...corsHeaders
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
            ...corsHeaders
        },
    });
}