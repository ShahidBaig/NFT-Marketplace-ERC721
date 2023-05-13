const config = {
    pinningService: {
        name: '$$PINNING_SERVICE_NAME',
        endpoint: '$$PINNING_SERVICE_ENDPOINT',
        key: '$$PINNING_SERVICE_KEY'
    },

    // If you're running IPFS on a non-default port, update this URL. If you're using the IPFS defaults, you should be all set.
    ipfsApiUrl: '/ip4/127.0.0.1/tcp/5001',

    // If you're running the local IPFS gateway on a non-default port, or if you want to use a public gatway when displaying IPFS gateway urls, edit this.
    ipfsGatewayUrl: 'http://localhost:8080/ipfs',

    pinata_pin_url: 'https://api.pinata.cloud/pinning/',
    pinata_api_jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiZDBiZjE2MC1mZTBmLTQyOGItYmE5NC04YTg1ZDYxOGVkMzkiLCJlbWFpbCI6InNpYmFpZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZWQ2M2NjYmU1OGM2ZjMzOWEzZTUiLCJzY29wZWRLZXlTZWNyZXQiOiIxOTM2Nzk4NmM2MzQ0MDc3OWU5Mjc2MzcxYjhhYmI5MzY3NmU3ODRlNDU0M2ViNGEyMzhmYzU2NjkzOGY1ZDQ1IiwiaWF0IjoxNjgzOTg3NTA1fQ.iUL8IJBeT13C_XVdKX0VgjpTl25Pc8CSoj1NLFQeisQ',
    pinata_gateway_url: 'https://gateway.pinata.cloud/ipfs/'
}

module.exports = config