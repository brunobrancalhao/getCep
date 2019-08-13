const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;

const config = () => {
    switch (env) {
        case 'dev':
        return {
            bd_string: 'mongodb+srv://usuario_admin:hdfvOIiE2ZxPHOCm@clusterapi-uh0ox.mongodb.net/test?retryWrites=true',
            jwt_pass: 'batatafrita2019',
            jwt_expires_in: '365d',
        }

        case 'hml':
        return {
            bd_string: 'mongodb+srv://usuario_admin:hdfvOIiE2ZxPHOCm@clusterapi-uh0ox.mongodb.net/test?retryWrites=true',
            jwt_pass: 'batatafrita2019',
            jwt_expires_in: '365d'
        }

        case 'production':
        return {
            bd_string: 'mongodb+srv://usuario_admin:hdfvOIiE2ZxPHOCm@clusterapi-uh0ox.mongodb.net/test?retryWrites=true',
            jwt_pass: 'batatafrita2019',
            jwt_expires_in: '365d'
        }

        default:
        return {
            bd_string: 'mongodb+srv://usuario_admin:hdfvOIiE2ZxPHOCm@clusterapi-uh0ox.mongodb.net/test?retryWrites=true',
            jwt_pass: 'batatafrita2019',
            jwt_expires_in: '365d'
        }
    }
}

console.log(`inciando a API em ambiente ${env.toUpperCase()}`);

module.exports = config();