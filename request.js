const { api } = require('@blurtfoundation/blurtjs')

api.setOptions({
    url: "https://test-rpc.blurt.world",
    retry: true,
});

async function callBridge(method, params, pre = 'bridge.') {
    // [JES] Hivemind throws an exception if you call for my/[trending/payouts/new/etc] with a null observer
    // so just delete the 'my' tag if there is no observer specified
    if (
        method === 'get_ranked_posts'
        && params
        && (params.observer === null || params.observer === undefined)
        && params.tag === 'my'
    ) {
        delete params.tag;
        delete params.observer;
    }

    if (method === 'normalize_post' && params && params.observer !== undefined) delete params.observer;

    console.log(
        'call bridge',
        method,
        params && JSON.stringify(params).substring(0, 200)
    );
    return new Promise(function(resolve, reject) {
        api.call(pre + method, params, function(err, data) {
            if (err) {
                console.error('~~ apii.calBridge error ~~~>', method, params, err);
                reject(err);
            } else resolve(data);
        });
    });
}

async function manageMultiplesRequest() {
    let res1 = await callBridge('get_profile', {account: 'nalexadre'})
    let res2 = await callBridge('get_trending_topics', {limit: 12})
    let res3 = await callBridge('get_post_header', {author: 'nalexadre', permlink: 'meplwjhj'})
    let res4 = await callBridge('get_discussion', {author: 'nalexadre', permlink: 'meplwjhj'})
    let res5 = await callBridge('get_community', {name: 'blurt-177003', observer:null})
    let res6 = await callBridge('get_profile', {account: 'nalexadre'})
}

manageMultiplesRequest()
.then(() => {console.log('succes');})
.catch((error) => { console.log(error) })