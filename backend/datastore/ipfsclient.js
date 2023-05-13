// const fs = require('fs/promises')
// const path = require('path')

// const CID = require('cids')
// const { create } = require('ipfs-http-client')
// const all = require('it-all')
// const { concat, toString } = require('uint8arrays')
// const config = require('getconfig')

// // ipfs.add parameters for more deterministic CIDs
// const ipfsAddOptions = {
//   cidVersion: 1,
//   hashAlg: 'sha2-256'
// }

// /**
//  * Construct and asynchronously initialize a new IPFS instance.
//  * @returns {Promise<IPFS>} a new instance of IPFS, ready to mint CIDs.
//  */
//  async function IPFSDataClient() {
//     const m = new IPFS()
//     await m.init()
//     return m
// }

// /**
//  * IPFS is the main object responsible for storing CID data.
//  * 
//  * IPFS requires async initialization, so the IPFS class (and its constructor) are not exported. 
//  * To make one, use the async {@link IPFSDataClient} function.
//  */
// class IPFS {
//     constructor() {
//         this.ipfsHttp = null
//         this._initialized = false
//     }

//     async init() {
//         if (this._initialized) {
//             return
//         }
    
//         console.log(config.ipfsApiUrl);
//         // create a local IPFS node
//         this.ipfsHttp = create(config.ipfsApiUrl)

//         this._initialized = true
//     }

//     //////////////////////////////////////////////
//     // ------ CID Creation
//     //////////////////////////////////////////////

//     /**
//      * Create a new CID from the given asset data.
//      * 
//      * @param {Buffer|Uint8Array} content - a Buffer or UInt8Array of data (e.g. for an image)
//      * @param {object} options
//      * @param {?string} path - optional file path to set when storing the data on IPFS
//      * @param {?string} tokenId - optional tokenId to set in CID metadata
//      * @param {?string} name - optional name to set in CID metadata
//      * @param {?string} description - optional description to store in CID metadata
//      * @param {?string} price - optional starting price of the CID. 
//      * 
//      * @returns {Promise<string>}
//      */
//     async createCIDFromAssetData(content, options) {
//         // add the asset to IPFS
//         const filePath = options.path || 'asset.bin'
//         const basename =  path.basename(filePath)

//         const ipfsPath = '/nft/' + basename
//         const { cid: assetCid } = await this.ipfsHttp.add({ path: ipfsPath, content }, ipfsAddOptions)

//         // make the CID metadata JSON
//         const assetURI = ensureIpfsUriPrefix(assetCid) + '/' + basename
//         const metadata = await this.makeCIDMetadata(assetURI, options)

//         // add the metadata to IPFS
//         const { cid: metadataCid } = await this.ipfsHttp.add({ path: '/nft/metadata.json', content: JSON.stringify(metadata)}, ipfsAddOptions)
//         const metadataURI = ensureIpfsUriPrefix(metadataCid) + '/metadata.json'

//         // format and return the results
//         return metadataURI;
//     }

//     /**
//      * Create a new CID from an asset file at the given path.
//      * 
//      * @param {string} filename - the path to an image file or other asset to use
//      * @param {object} options
//      * @param {?string} name - optional name to set in CID metadata
//      * @param {?string} description - optional description to store in CID metadata
//      * @param {?string} owner - optional ethereum address that should own the new CID. 
//      * If missing, the default signing address will be used.
//      * 
//      * @returns {Promise<string>}
//      */
//     async createCIDFromAssetFile(filename, options) {
//         const content = await fs.readFile(filename)
//         return this.createCIDFromAssetData(content, {...options, path: filename})
//     }

//     /**
//      * Helper to construct metadata JSON for 
//      * @param {string} assetCid - IPFS URI for the CID asset
//      * @param {object} options
//      * @param {?string} name - optional name to set in CID metadata
//      * @param {?string} description - optional description to store in CID metadata
//      * @returns {object} - CID metadata object
//      */
//     async makeCIDMetadata(assetURI, options) {
//         const {name, description} = options;
//         assetURI = ensureIpfsUriPrefix(assetURI)
//         return {
//             name,
//             description,
//             image: assetURI
//         }
//     }

//     //////////////////////////////////////////////
//     // -------- CID Retreival
//     //////////////////////////////////////////////

//     /**
//      * Get information about an existing token. 
//      * By default, this includes the token id, owner address, metadata, and metadata URI.
//      * To include info about when the token was created and by whom, set `opts.fetchCreationInfo` to true.
//      * To include the full asset data (base64 encoded), set `opts.fetchAsset` to true.
//      *
//      * @param {string} tokenId
//      * @param {object} opts
//      * @param {?boolean} opts.fetchAsset - if true, asset data will be fetched from IPFS and returned in assetData (base64 encoded)
//      * @param {?boolean} opts.fetchCreationInfo - if true, fetch historical info (creator address and block number)
//      * 
//      * 
//      * @typedef {object} CIDInfo
//      * @property {string} tokenId
//      * @property {string} ownerAddress
//      * @property {object} metadata
//      * @property {string} metadataURI
//      * @property {string} metadataGatewayURI
//      * @property {string} assetURI
//      * @property {string} assetGatewayURL
//      * @property {?string} assetDataBase64
//      * @property {?object} creationInfo
//      * @property {string} creationInfo.creatorAddress
//      * @property {number} creationInfo.blockNumber
//      * @returns {Promise<CIDInfo>}
//      */
//     async getCID(metadataURI, opts) {
//         const metadata = await this.getCIDMetadata(metadataURI)
//         const metadataGatewayURL = makeGatewayURL(metadataURI)
//         const nft = {metadata, metadataURI, metadataGatewayURL}

//         const {fetchAsset} = (opts || {})
//         if (metadata.image) {
//             nft.assetURI = metadata.image
//             nft.assetGatewayURL = makeGatewayURL(metadata.image)
//             if (fetchAsset) {
//                 nft.assetDataBase64 = await this.getIPFSBase64(metadata.image)
//             }
//         }
//         return nft
//     }

//     /**
//      * Fetch the CID metadata for a given token id.
//      * 
//      * @param tokenId - the id of an existing token
//      * @returns {Promise<{metadata: object, metadataURI: string}>} - resolves to an object containing the metadata and
//      * metadata URI. Fails if the token does not exist, or if fetching the data fails.
//      */
//     async getCIDMetadata(metadataURI) {
//         return await this.getIPFSJSON(metadataURI);
//     }

//     //////////////////////////////////////////////
//     // --------- IPFS helpers
//     //////////////////////////////////////////////

//     /**
//      * Get the full contents of the IPFS object identified by the given CID or URI.
//      * 
//      * @param {string} cidOrURI - IPFS CID string or `ipfs://<cid>` style URI
//      * @returns {Promise<Uint8Array>} - contents of the IPFS object
//      */
//     async getIPFS(cidOrURI) {
//         const cid = stripIpfsUriPrefix(cidOrURI)
//         return concat(await all(this.ipfsHttp.cat(cid)))
//     }

//     /**
//      * Get the contents of the IPFS object identified by the given CID or URI, and return it as a string.
//      * 
//      * @param {string} cidOrURI - IPFS CID string or `ipfs://<cid>` style URI
//      * @returns {Promise<string>} - the contents of the IPFS object as a string
//      */
//     async getIPFSString(cidOrURI) {
//         const bytes = await this.getIPFS(cidOrURI)
//         return toString(bytes)
//     }

//     /**
//      * Get the full contents of the IPFS object identified by the given CID or URI, and return it as a base64 encoded string.
//      * 
//      * @param {string} cidOrURI - IPFS CID string or `ipfs://<cid>` style URI
//      * @returns {Promise<string>} - contents of the IPFS object, encoded to base64
//      */
//     async getIPFSBase64(cidOrURI) {
//         const bytes = await this.getIPFS(cidOrURI)
//         return toString(bytes, 'base64')
//     }

//     /**
//      * Get the contents of the IPFS object identified by the given CID or URI, and parse it as JSON, returning the parsed object.
//      *  
//      * @param {string} cidOrURI - IPFS CID string or `ipfs://<cid>` style URI
//      * @returns {Promise<string>} - contents of the IPFS object, as a javascript object (or array, etc depending on what was stored). Fails if the content isn't valid JSON.
//      */
//     async getIPFSJSON(cidOrURI) {
//         const str = await this.getIPFSString(cidOrURI)
//         return JSON.parse(str)
//     }

//     //////////////////////////////////////////////
//     // -------- Pinning to remote services
//     //////////////////////////////////////////////

//     /**
//      * Pins all IPFS data associated with the given tokend id to the remote pinning service.
//      * 
//      * @param {string} tokenId - the ID of an CID that was previously minted.
//      * @returns {Promise<{assetURI: string, metadataURI: string}>} - the IPFS asset and metadata uris that were pinned.
//      * Fails if no token with the given id exists, or if pinning fails.
//      */
//     async pinTokenData(metadataURI) {
//         const metadata = await this.getCIDMetadata(metadataURI)
//         const {image: assetURI} = metadata
        
//         console.log(`Pinning asset data (${assetURI}) for token id ${tokenId}....`)
//         await this.pin(assetURI)

//         console.log(`Pinning metadata (${metadataURI}) for token id ${tokenId}...`)
//         await this.pin(metadataURI)

//         return {assetURI, metadataURI}
//     }

//     /**
//      * Request that the remote pinning service pin the given CID or ipfs URI.
//      * 
//      * @param {string} cidOrURI - a CID or ipfs:// URI
//      * @returns {Promise<void>}
//      */
//     async pin(cidOrURI) {
//         const cid = extractCID(cidOrURI)

//         // Make sure IPFS is set up to use our preferred pinning service.
//         await this._configurePinningService()

//         // Check if we've already pinned this CID to avoid a "duplicate pin" error.
//         const pinned = await this.isPinned(cid)
//         if (pinned) {
//             return
//         }

//         // Ask the remote service to pin the content.
//         // Behind the scenes, this will cause the pinning service to connect to our local IPFS node
//         // and fetch the data using Bitswap, IPFS's transfer protocol.
//         await this.ipfsHttp.pin.remote.add(cid, { service: config.pinningService.name })
//     }


//     /**
//      * Check if a cid is already pinned.
//      * 
//      * @param {string|CID} cid 
//      * @returns {Promise<boolean>} - true if the pinning service has already pinned the given cid
//      */
//     async isPinned(cid) {
//         if (typeof cid === 'string') {
//             cid = new CID(cid)
//         }

//         const opts = {
//             service: config.pinningService.name,
//             cid: [cid], // ls expects an array of cids
//         }
//         for await (const result of this.ipfsHttp.pin.remote.ls(opts)) {
//             return true
//         }
//         return false
//     }

//     /**
//      * Configure IPFS to use the remote pinning service from our config.
//      * 
//      * @private
//      */
//     async _configurePinningService() {
//         if (!config.pinningService) {
//             throw new Error(`No pinningService set up in IPFS config. Unable to pin.`)
//         }

//         // check if the service has already been added to js-ipfs
//         for (const svc of await this.ipfsHttp.pin.remote.service.ls()) {
//             if (svc.service === config.pinningService.name) {
//                 // service is already configured, no need to do anything
//                 return
//             }
//         }

//         // add the service to IPFS
//         const { name, endpoint, key } = config.pinningService
//         if (!name) {
//             throw new Error('No name configured for pinning service')
//         }
//         if (!endpoint) {
//             throw new Error(`No endpoint configured for pinning service ${name}`)
//         }
//         if (!key) {
//             throw new Error(`No key configured for pinning service ${name}.` +
//               `If the config references an environment variable, e.g. '$$PINATA_API_TOKEN', ` + 
//               `make sure that the variable is defined.`)
//         }
//         await this.ipfsHttp.pin.remote.service.add(name, { endpoint, key })
//     }
// }

// //////////////////////////////////////////////
// // -------- URI helpers
// //////////////////////////////////////////////

// /**
//  * @param {string} cidOrURI either a CID string, or a URI string of the form `ipfs://${cid}`
//  * @returns the input string with the `ipfs://` prefix stripped off
//  */
//  function stripIpfsUriPrefix(cidOrURI) {
//     if (cidOrURI.startsWith('ipfs://')) {
//         return cidOrURI.slice('ipfs://'.length)
//     }
//     return cidOrURI
// }

// function ensureIpfsUriPrefix(cidOrURI) {
//     let uri = cidOrURI.toString()
//     if (!uri.startsWith('ipfs://')) {
//         uri = 'ipfs://' + cidOrURI
//     }
//     // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
//     if (uri.startsWith('ipfs://ipfs/')) {
//       uri = uri.replace('ipfs://ipfs/', 'ipfs://')
//     }
//     return uri
// }

// /**
//  * Return an HTTP gateway URL for the given IPFS object.
//  * @param {string} ipfsURI - an ipfs:// uri or CID string
//  * @returns - an HTTP url to view the IPFS object on the configured gateway.
//  */
// function makeGatewayURL(ipfsURI) {
//     return config.ipfsGatewayUrl + '/' + stripIpfsUriPrefix(ipfsURI)
// }

// /**
//  * 
//  * @param {string} cidOrURI - an ipfs:// URI or CID string
//  * @returns {CID} a CID for the root of the IPFS path
//  */
// function extractCID(cidOrURI) {
//     // remove the ipfs:// prefix, split on '/' and return first path component (root CID)
//     const cidString = stripIpfsUriPrefix(cidOrURI).split('/')[0]
//     return new CID(cidString)
// }


// //////////////////////////////////////////////
// // -------- Exports
// //////////////////////////////////////////////

// module.exports = {
//     IPFSDataClient,
// }
