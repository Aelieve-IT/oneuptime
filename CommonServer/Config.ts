import Protocol from 'Common/Types/API/Protocol';

// Export starts here.

export const DatabaseUrl: string =
    process.env['MONGO_URL'] || 'mongodb://localhost:27017/oneuptimedb';

export const DatabaseName: string = process.env['DB_NAME'] || 'oneuptimedb';

export const IsMongoReplicaSet: boolean = !!process.env['IS_MONGO_REPLICA_SET'];

export const EncryptionSecret: string = process.env['ENCRYPTIOJN_SECRET'] || '';

export const AirtableApiKey: string = process.env['AIRTABLE_API_KEY'] || '';

export const AirtableBaseId: string = process.env['AIRTABLE_BASE_ID'] || '';

export const ClusterKey: string = process.env['CLUSTER_KEY'] || '';

export const RealtimeHostname: string = process.env['REALTIME_HOSTNAME'] || '';

export const Version: string = process.env['npm_package_version'] || '';

export const HttpProtocol: Protocol: Function = (
    process.env['HTTP_PROTOCOL'] || ''
).includes('https')
    ? Protocol.HTTPS
    : Protocol.HTTP;